import React, {useEffect, useState} from 'react'; // , {useEffect, useState}
import {
  View,
  // TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  // Image,
  StyleSheet,
  // ScrollView,
  // Platform,
  FlatList,
  // SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  // LogBox,
} from 'react-native';
// import StringUtils from '../../Utils/StringUtils';
// import ArrayUtils from '../../Utils/ArrayUtils';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  Colors,
  // , statusColors
} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, NoItemsFound} from '../../routes/CommonScreen';
import {addClosedLoopTicket} from '../../redux/sagas/ClosedLoopSaga';
import {postAddTicketComment} from '../../redux/actions/dashboard.actions';
import moment from 'moment';
import {DMY_AT_TIME_FORMAT} from '../../Utils/AppConstants';
import {clockRunning} from 'react-native-reanimated';
import {getNameInitials} from '../../Utils/TicketUtils';
// import {Sizes} from '../../styles/Size.constant';
// import moment from 'moment';
// import {translate} from '../../Utils/MultilinguaUtils';
// import IonIcons from 'react-native-vector-icons/Ionicons';
// import QPButton from '../../widgets/Button';
// import ModalDropdown from '../../widgets/drop-down/ModalDropdown';
// import {backgroundColor} from '../../widgets/qp-calendar/style';

export default function TicketComments(props) {
  const {authToken} = useSelector((state) => state.global);
  const ticketComments = useSelector((state) => state.dashboard.ticketComments);
  const {emailAddress, firstName, lastName, userID} = useSelector(
    (state) => state.global.userInfo,
  );
  const ticketId = useSelector((state) => state.dashboard.ticket.id);
  const dispach = useDispatch();
  const [isMainCommentHidden, setMainCommentVisibility] = useState(false);

  const commentState = {
    commentBy: `${firstName} ${lastName}`.trim(),
    userName: `${firstName} ${lastName}`.trim(),
    userEmailAddress: `${emailAddress}`,
    userId: userID,
    ticketId: ticketId,
    parentId: 0,
    subscriberId: global.subscriberId,
  };
  const [commentText, setCommentText] = useState('');

  const ShowFlatList = (data) => {
    return (
      <FlatList
        style={styles.container}
        data={data}
        inverted={false}
        renderItem={renderItem}
        ListEmptyComponent={
          ticketComments.length === 0 && (
            <NoItemsFound>No comments found</NoItemsFound>
          )
        }
        ListFooterComponent={commentFooter()}
        keyExtractor={(item) => item.id.toString()}
      />
    );
  };

  const ShowNestedFlatList = (data) => {
    return (
      <FlatList
        style={[styles.container, {marginStart: MarginConstants.tab2}]}
        data={data}
        inverted={false}
        renderItem={CommentItem}
        keyExtractor={(item) => item.id.toString()}
      />
    );
  };

  const CommentParentItem = ({item}) => {
    const [isCommentBoxVisible, setCommentBoxVisibility] = useState(false);
    const toggleCommentBoxVisibility = () => {
      setCommentBoxVisibility((isHidden) => !isHidden);
      // setMainCommentVisibility((isHidden) => !isHidden);
    };
    return (
      <View
        style={{
          margin: MarginConstants.tab1,
          padding: PaddingConstants.halfTab,
        }}>
        {CommentItem({item})}
        {item.children && (
          <View
            style={{
              marginStart: MarginConstants.tab2,
              marginTop: MarginConstants.tab1,
            }}>
            {ShowNestedFlatList(item.children)}
          </View>
        )}

        <TouchableOpacity
          style={{
            marginStart: MarginConstants.tab4,
            marginVertical: MarginConstants.halfTab,
          }}
          onPress={toggleCommentBoxVisibility}>
          <Text style={[styles.replyText, {color: Colors.accentLight}]}>
            {isCommentBoxVisible ? 'Cancel' : 'Reply'}
          </Text>
        </TouchableOpacity>
        {isCommentBoxVisible && commentFooter()}
      </View>
    );
  };

  const renderItem = ({item}) => {
    return <CommentParentItem item={item} />;
  };

  const CommentItem = ({item}) => {
    const isOtherUser = item.userId !== userID;
    return (
      <View style={styles.commentItemView}>
        <View style={styles.commentUserView}>
          {item.userId !== userID && <Avatar title={item.commentBy} />}
        </View>
        <View style={styles.commentTextView}>
          <Text
            style={[
              styles.commentByText,
              {textAlign: isOtherUser ? 'left' : 'right'},
            ]}>
            {isOtherUser ? item.commentBy.trim() : 'You'}
          </Text>
          <Text style={styles.commentText}>{item.text}</Text>
          <Text style={styles.commentDateText}>
            {moment.utc(item.createdAt).local().format(DMY_AT_TIME_FORMAT)}
          </Text>
        </View>
      </View>
    );
  };

  const onChangeCommentHandler = (text) => {
    setCommentText(text);
  };

  const handleOnSubmit = () => {
    console.log(
      JSON.stringify({COMMENT_STATE: commentState, text: commentText}),
    );
    dispach(
      postAddTicketComment(
        authToken,
        {...commentState, text: commentText},
        ticketId,
      ),
    );

    setCommentText('');
  };
  const commentBox = () => {
    return (
      <KeyboardAvoidingView style={styles.commentBoxContainer}>
        {/* <View
          style={[styles.commentBox, {marginBottom: MarginConstants.halfTab}]}>
          <Avatar title={`${firstName} ${lastName}`.trim()} />
          <Text style={styles.commentByText}>You</Text>
        </View> */}

        <View style={[styles.commentBox, styles.borderStyle]}>
          <MaterialIconView iconName="chat-bubble" />

          <TextInput
            value={commentText}
            multiline
            style={[styles.container, styles.commentText]}
            onChangeText={onChangeCommentHandler}
            placeholder="Write a comment"
            onEndEditing={onChangeCommentHandler}
            returnKeyType={'send'}
            onSubmitEditing={(event) => {
              console.log('KEYBOARD_DONE', JSON.stringify(event.nativeEvent));
              onChangeCommentHandler(event.nativeEvent.text);
              handleOnSubmit();
            }}
          />
          <SendButton />
        </View>
      </KeyboardAvoidingView>
    );
  };

  const MaterialIconView = ({iconName, color}) => (
    <View style={{margin: MarginConstants.halfTab}}>
      <MaterialIcon
        name={iconName}
        size={24}
        color={color ?? Colors.filterIconColor}
      />
    </View>
  );

  // const ContactButton = () => {
  //   return (
  //     <TouchableOpacity>
  //       <MaterialIconView iconName="account-circle" />
  //     </TouchableOpacity>
  //   );
  // };
  const SendButton = () => {
    return (
      <TouchableOpacity onPress={handleOnSubmit}>
        <MaterialIconView iconName="send" />
      </TouchableOpacity>
    );
  };
  // const AttachmentButton = () => {
  //   return (
  //     <TouchableOpacity>
  //       <MaterialIconView iconName="attach-file" />
  //     </TouchableOpacity>
  //   );
  // };

  // const PictureButton = () => {
  //   return (
  //     <TouchableOpacity>
  //       <MaterialIconView iconName="photo" />
  //     </TouchableOpacity>
  //   );
  // };

  const commentFooter = () => {
    return (
      <View style={styles.commentFooter}>
        {commentBox()}
        {/* <SendButton /> */}
        {/* <ContactButton />
        <AttachmentButton />
        <PictureButton /> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {ShowFlatList(ticketComments)}
      {/* {commentFooter()} */}
    </View>
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
    marginStart: MarginConstants.halfTab,
  },

  borderStyle: {borderColor: Colors.darkerGrey, borderWidth: 1},
  commentBoxContainer: {
    flex: 1,
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
    marginStart: MarginConstants.tab1,
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
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.mediumText,
    color: Colors.primary,
  },
});
