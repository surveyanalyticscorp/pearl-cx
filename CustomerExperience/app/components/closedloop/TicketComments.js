import React, {useCallback, useEffect, useRef, useState} from 'react';
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
  Platform,
  useWindowDimensions,
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
  resetParentComment,
  setParentComment,
} from '../../redux/actions/dashboard.actions';
import moment from 'moment';
import StringUtils from '../../Utils/StringUtils';
import {getDateTimeAgo} from '../../Utils/TimeUtils';
import RenderHTML, {defaultSystemFonts} from 'react-native-render-html';
import {translate} from '../../Utils/MultilinguaUtils';
import {MAX_COMMENT_LENGTH} from '../../api/Constant';
import Animated, {event} from 'react-native-reanimated';
import {baseTextStyles} from '../../styles/text.styles';

function getFoldedText(text) {
  //
  const MAX_WORD_LENGTH = 10;
  if (StringUtils.getWords(text).length > MAX_WORD_LENGTH) {
    return `${StringUtils.getWords(text).slice(0, MAX_WORD_LENGTH).join(' ')}
      <span><b> ...see more</b></span>`;
  }
  return text;
}

const MaterialIconView = ({iconName, color, size}) => (
  <View style={{margin: MarginConstants.halfTab}}>
    <MaterialIcon
      name={iconName}
      size={size ?? 24}
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

const CommentText = ({text}) => {
  const {width} = useWindowDimensions();
  const systemFonts = [...defaultSystemFonts, FontFamily.regular];

  console.log('HTML comment', text);
  console.log(
    'HTML text',
    JSON.stringify(StringUtils.formatCommentToHTML(text)),
  );

  return (
    <View>
      <RenderHTML
        source={{
          html: `
          <span style="font-size: 100%; ">${StringUtils.formatCommentToHTML(
            text,
          )}</span>`,
        }}
        contentWidth={width / 0.5}
        systemFonts={systemFonts}
        tagsStyles={{
          span: {
            color: Colors.filterIconColor,
            ...baseTextStyles.secondaryRegularText,
          },
        }}
      />
    </View>
  );
};

const TextLengthCount = ({textLength, maxCountLength}) => {
  return textLength > 0 ? (
    <Text
      style={
        textLength === maxCountLength
          ? styles.commentLengthLimitText
          : styles.commentLengthText
      }>{`${textLength}/${maxCountLength}`}</Text>
  ) : (
    <View />
  );
};

const CommentItem = ({item, isSelected = false}) => {
  const [isFolded, setFolded] = useState(true);

  return (
    <Pressable
      style={[
        styles.commentItemView,
        {marginVertical: MarginConstants.halfTab},
      ]}
      onPress={() => {
        setFolded(state => !state);
      }}>
      <View style={styles.commentUserView}>
        <Avatar title={item.commentBy} />
      </View>
      <View
        style={
          isSelected ? styles.commentSelectedTextView : styles.commentTextView
        }>
        <Text style={[styles.commentByText]}>{item.commentBy.trim()}</Text>
        <CommentText
          text={isFolded ? getFoldedText(item.text.trim()) : item.text.trim()}
        />
        {/* <Text style={styles.commentText}>{item.text.trim()}</Text> */}
        <Text style={styles.commentDateText}>
          {getDateTimeAgo(moment.utc(item.createdAt).toDate())}
        </Text>
      </View>
    </Pressable>
  );
};

const ShowNestedFlatList = ({data, isSelected}) => {
  const MemoizedCommentItem = React.memo(CommentItem);

  return (
    <FlatList
      style={[
        styles.container,
        {
          marginStart: MarginConstants.tab2,
        },
      ]}
      data={data}
      initialNumToRender={4}
      inverted={false}
      renderItem={({item}) => (
        <MemoizedCommentItem item={item} isSelected={isSelected} />
      )}
      extraData={data}
      keyExtractor={item => item.id.toString()}
    />
  );
};

const CommentParentItem = ({item}) => {
  // const [isCommentBoxVisible, setCommentBoxVisibility] = useState(false);
  const {parentComment} = useSelector(state => state.dashboard);
  const isSelected = parentComment.id === item.id;
  const dispatch = useDispatch();
  const toggleCommentBoxVisibility = () => {
    // setCommentBoxVisibility(isHidden => !isHidden);
    dispatch(
      setParentComment(
        parentComment.isFocused
          ? {id: 0, isFocused: false}
          : {...item, isFocused: true},
      ),
    );
  };

  // useEffect(() => {
  //   dispatch(
  //     setParentComment(
  //       isCommentBoxVisible
  //         ? {...item, isFocused: true}
  //         : {id: 0, isFocused: false},
  //     ),
  //   );
  // }, [isCommentBoxVisible]);
  return (
    <ScrollView
      style={{
        margin: MarginConstants.tab1,
        padding: PaddingConstants.halfTab,
        borderWidth: 1,
        borderColor: isSelected ? Colors.darkGrey : Colors.transparent,
      }}>
      <CommentItem item={item} isSelected={isSelected} />
      {item.children.length > 0 && (
        <View
          style={{
            marginStart: MarginConstants.tab2,
            marginTop: MarginConstants.halfTab,
          }}>
          <ShowNestedFlatList data={item.children} isSelected={isSelected} />
        </View>
      )}

      <Pressable
        style={{
          marginStart: MarginConstants.tab4,
          marginVertical: MarginConstants.halfTab,
        }}
        onPress={toggleCommentBoxVisibility}>
        <Text style={[styles.replyText, {color: Colors.accentLight}]}>
          {isSelected ? translate('cancel') : translate('comment.reply')}
        </Text>
      </Pressable>
      {/* {isCommentBoxVisible && <CommentBox parentId={item.id} />} */}
    </ScrollView>
  );
};

const CommentBox = () => {
  const {authToken} = useSelector(state => state.global);
  const ticketId = useSelector(state => state.dashboard.ticket.id);
  const dispatch = useDispatch();
  const textInputRef = useRef();
  const {parentComment} = useSelector(state => state.dashboard);
  const {emailAddress, firstName, lastName, userID} = useSelector(
    state => state.global.userInfo,
  );
  const [commentText, setCommentText] = useState('');
  const [textInputHeight, setTextInputHeight] = useState(0);
  const userInfo = useSelector(state => state.global);

  console.log('USER_INFO', JSON.stringify(userInfo));
  const placeHolder =
    parentComment.id > 0
      ? translate('comment.write_a_reply')
      : translate('comment.write_a_comment');
  // const marginForCommentBox = parentId > 0 ? MarginConstants.tab4 : 0;

  useEffect(() => {
    if (parentComment.isFocused) {
      textInputRef.current.focus();
    }
  }, [parentComment]);

  const commentState = {
    commentBy: `${firstName} ${lastName}`.trim(),
    userName: `${firstName} ${lastName}`.trim(),
    userEmailAddress: `${emailAddress}`,
    userId: userID,
    ticketId: ticketId,
    parentId: parentComment.id,
    subscriberId: global.subscriberId,
  };

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
        {...commentState, text: commentText, parentId: parentComment.id},
        ticketId,
      ),
    );
    dispatch(resetParentComment());
    setCommentText('');
  };

  return (
    <View
      style={[
        styles.commentBoxContainer,
        {height: textInputHeight + MarginConstants.tab1},
      ]}>
      <View
        style={[
          styles.commentBox,
          styles.borderStyle,
          {alignItems: textInputHeight < 48 ? 'center' : 'flex-end'},
        ]}>
        {/* <MaterialIconView iconName="chat-bubble" /> */}
        {console.log('KEYBOARD')}
        <TextInput
          ref={textInputRef}
          defaultValue={commentText}
          multiline
          maxLength={MAX_COMMENT_LENGTH}
          placeholderTextColor={Colors.borderColor}
          style={[
            {
              height: Math.max(36, textInputHeight),
              justifyContent: 'space-between',
              backgroundColor: Colors.grey,
            },
            styles.commentText,
          ]}
          onChangeText={onChangeCommentHandler}
          placeholder={placeHolder}
          // onChange={e => {
          //   // setTextInputHeight(e.nativeEvent.contentSize.height);
          //   console.log(
          //     'EVENT',
          //     JSON.stringify(e.nativeEvent.),
          //   );
          // }}
          // onEndEditing={onChangeCommentHandler}
          onContentSizeChange={event => {
            console.log(
              'EVENT',
              JSON.stringify(event.nativeEvent.contentSize.height),
            );
            setTextInputHeight(event.nativeEvent.contentSize.height);
          }}
          returnKeyType={'send'}
          onSubmitEditing={event => {
            console.log('KEYBOARD_DONE', JSON.stringify(event.nativeEvent));
            onChangeCommentHandler(event.nativeEvent.text);
            handleOnSubmit();
          }}
        />
        <TextLengthCount
          textLength={commentText.length}
          maxCountLength={MAX_COMMENT_LENGTH}
        />
      </View>
      <SendButton handleOnSubmit={handleOnSubmit} />
    </View>
  );
};

const ShowFlatList = ({data, onRefresh_, refreshing_}) => {
  const ticketComments = useSelector(state => state.dashboard.ticketComments);

  const MemoizedCommentParentItem = React.memo(CommentParentItem);

  return (
    <FlatList
      data={ticketComments}
      refreshControl={
        <RefreshControl onRefresh={onRefresh_} refreshing={refreshing_} />
      }
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <MemoizedCommentParentItem item={item} />}
      extraData={data}
      // ListFooterComponent={<View style={{margin: MarginConstants.tab4}} />}
      // ListFooterComponent={<CommentBox />}
    />
  );
};
export default function TicketComments(props) {
  const {authToken} = useSelector(state => state.global);

  const ticketId = useSelector(state => state.dashboard.ticket.id);
  const dispatch = useDispatch();

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

  return (
    <Animated.View style={[styles.container]}>
      <ShowFlatList onRefresh_={onRefresh} refreshing_={refreshing} />

      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 50 : MarginConstants.tab4 * 40
        }>
        <CommentBox />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'space-between',
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

    flex: 1,
    backgroundColor: Colors.grey,
    marginHorizontal: MarginConstants.halfTab,
  },

  borderStyle: {borderColor: Colors.darkerGrey, borderWidth: 1},
  commentBoxContainer: {
    minHeight: MarginConstants.tab2 * 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: MarginConstants.tab1,
    marginBottom:
      Platform.OS === 'ios' ? MarginConstants.tab2 * 3 : MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab2,
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
  commentSelectedTextView: {
    flex: 1,
    marginEnd: MarginConstants.halfTab,

    backgroundColor: Colors.darkGrey,
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
  commentLengthText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.semiMediumText,
    color: Colors.filterIconColor,
  },
  commentLengthLimitText: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.semiMediumText,
    color: Colors.deleteButtonText,
  },
  commentByText: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
