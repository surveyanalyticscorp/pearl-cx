import React, {useCallback, useState} from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar} from '../../routes/CommonScreen';
import {
  getClosedLoopTicketItemComments,
  postAddTicketComment,
} from '../../redux/actions/dashboard.actions';
import moment from 'moment';
import StringUtils from '../../Utils/StringUtils';
import {getDateTimeAgo} from '../../Utils/TimeUtils';

const MaterialIconView = ({iconName, color}) => (
  <View style={{margin: MarginConstants.halfTab}}>
    <MaterialIcon
      name={iconName}
      size={24}
      color={color ?? Colors.filterIconColor}
    />
  </View>
);

const SendButton = ({handleOnSubmit}) => {
  return (
    <Pressable onPress={handleOnSubmit}>
      <MaterialIconView iconName="send" />
    </Pressable>
  );
};
const CommentItem = ({item}) => {
  return (
    <Pressable
      style={[
        styles.commentItemView,
        {marginVertical: MarginConstants.halfTab},
      ]}>
      <View style={styles.commentUserView}>
        <Avatar title={item.commentBy} />
      </View>
      <View style={styles.commentTextView}>
        <Text style={[styles.commentByText]}>{item.commentBy.trim()}</Text>
        <Text style={styles.commentText}>{item.text.trim()}</Text>
        <Text style={styles.commentDateText}>
          {getDateTimeAgo(moment.utc(item.createdAt).toDate())}
        </Text>
      </View>
    </Pressable>
  );
};

const ShowNestedFlatList = ({data}) => {
  const MemoizedCommentItem = React.memo(CommentItem);

  return (
    <FlatList
      style={[styles.container, {marginStart: MarginConstants.tab2}]}
      data={data}
      initialNumToRender={4}
      inverted={false}
      renderItem={({item}) => <MemoizedCommentItem item={item} />}
      extraData={data}
      keyExtractor={item => item.id.toString()}
    />
  );
};

export default function TicketComments(props) {
  const {authToken} = useSelector(state => state.global);
  const ticketComments = useSelector(state => state.dashboard.ticketComments);
  const {emailAddress, firstName, lastName, userID} = useSelector(
    state => state.global.userInfo,
  );
  const ticketId = useSelector(state => state.dashboard.ticket.id);
  const dispatch = useDispatch();

  const commentState = {
    commentBy: `${firstName} ${lastName}`.trim(),
    userName: `${firstName} ${lastName}`.trim(),
    userEmailAddress: `${emailAddress}`,
    userId: userID,
    ticketId: ticketId,
    parentId: 0,
    subscriberId: global.subscriberId,
  };
  const [refreshing, setRefreshing] = useState(false);

  const makeAPICall = () => {
    dispatch(getClosedLoopTicketItemComments(authToken, ticketId));
  };

  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    makeAPICall();
    wait(500).then(() => setRefreshing(false));
  }, []);

  const ShowFlatList = ({data}) => {
    const MemoizedCommentParentItem = React.memo(CommentParentItem);

    return (
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        keyboardShouldPersistTaps={'never'}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <MemoizedCommentParentItem item={item} />}
        extraData={data}
        ListFooterComponent={<View style={{margin: MarginConstants.tab4}} />}
      />
    );
  };

  const CommentParentItem = ({item}) => {
    const [isCommentBoxVisible, setCommentBoxVisibility] = useState(false);
    const toggleCommentBoxVisibility = () => {
      setCommentBoxVisibility(isHidden => !isHidden);
    };
    return (
      <ScrollView
        style={{
          margin: MarginConstants.tab1,
          padding: PaddingConstants.halfTab,
        }}>
        <CommentItem item={item} />
        {item.children.length > 0 && (
          <View
            style={{
              marginStart: MarginConstants.tab2,
              marginTop: MarginConstants.halfTab,
            }}>
            <ShowNestedFlatList data={item.children} />
          </View>
        )}

        <Pressable
          style={{
            marginStart: MarginConstants.tab4,
            marginVertical: MarginConstants.halfTab,
          }}
          onPress={toggleCommentBoxVisibility}>
          <Text style={[styles.replyText, {color: Colors.accentLight}]}>
            {isCommentBoxVisible ? 'Cancel' : 'Reply'}
          </Text>
        </Pressable>
        {isCommentBoxVisible && <CommentBox parentId={item.id} />}
      </ScrollView>
    );
  };

  const CommentBox = ({parentId}) => {
    const [commentText, setCommentText] = useState('');
    const placeHolder = parentId > 0 ? 'Write a reply' : 'Write a comment';
    const marginForCommentBox = parentId > 0 ? MarginConstants.tab4 : 0;

    console.log('RERENDERED_API_CALL');

    const onChangeCommentHandler = text => {
      setCommentText(text);
    };

    const handleOnSubmit = () => {
      if (StringUtils.isEmptyOrNull(commentText) || commentText.length === 0) {
        return;
      }
      console.log(
        JSON.stringify({COMMENT_STATE: commentState, text: commentText}),
      );

      dispatch(
        postAddTicketComment(
          authToken,
          {...commentState, text: commentText, parentId: parentId},
          ticketId,
        ),
      );

      setCommentText('');
    };

    return (
      <KeyboardAvoidingView
        style={[
          styles.commentBoxContainer,
          {marginStart: marginForCommentBox},
        ]}>
        <View style={[styles.commentBox, styles.borderStyle]}>
          <MaterialIconView iconName="chat-bubble" />
          {console.log('KEYBOARD')}
          <TextInput
            defaultValue={commentText}
            multiline
            style={[styles.container, styles.commentText]}
            onChangeText={onChangeCommentHandler}
            placeholder={placeHolder}
            // onEndEditing={onChangeCommentHandler}
            returnKeyType={'send'}
            onSubmitEditing={event => {
              console.log('KEYBOARD_DONE', JSON.stringify(event.nativeEvent));
              onChangeCommentHandler(event.nativeEvent.text);
              handleOnSubmit();
            }}
          />
          <SendButton handleOnSubmit={handleOnSubmit} />
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ShowFlatList
          data={ticketComments}
          onRefresh_={onRefresh}
          refreshing_={refreshing}
        />
      </View>
      <CommentBox parentId={0} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,

    marginHorizontal: MarginConstants.tab2,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: MarginConstants.halfTab,
  },

  borderStyle: {borderColor: Colors.darkerGrey, borderWidth: 1},
  commentBoxContainer: {
    minHeight: MarginConstants.tab2 * 3,
    marginVertical: MarginConstants.tab1,
  },

  commentUserView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: MarginConstants.halfTab,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,

    borderRadius: 5,
  },

  commentDateView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginEnd: MarginConstants.halfTab,
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.medium,
    borderRadius: 5,
  },

  commentTextView: {
    flex: 1,
    marginEnd: MarginConstants.halfTab,

    backgroundColor: Colors.darkerGrey,
    padding: PaddingConstants.halfTab,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  commentItemView: {
    flexDirection: 'row',
    paddingHorizontal: MarginConstants.halfTab,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    borderRadius: 5,
  },
  commentText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  commentByText: {
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  replyText: {
    flex: 1,
    marginStart: MarginConstants.tab4,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  commentByYouText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  commentDateText: {
    flex: 1,
    textAlign: 'right',
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.mediumText,
    color: Colors.primary,
  },
});
