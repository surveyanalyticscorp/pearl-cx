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
import {NoItemsFound} from '../../routes/CommonScreen';
import {addClosedLoopTicket} from '../../redux/sagas/ClosedLoopSaga';
import {postAddTicketComment} from '../../redux/actions/dashboard.actions';
import moment from 'moment';
import {DMY_AT_TIME_FORMAT} from '../../Utils/AppConstants';
import {clockRunning} from 'react-native-reanimated';
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

  const sampleData = [
    // {id: 1, title: 'Astro'},
    // {id: 2, title: 'Bakun'},
  ];

  // useEffect(() => {
  //   setTicketComments();
  // }, []);

  // console.log('TICKET COMMENTS on UI', JSON.stringify(ticketComments));
  const ShowFlatlistOrNoCommentText = () => {
    return ticketComments.length ? (
      <ShowFlatList />
    ) : (
      <NoItemsFound>No comments found</NoItemsFound>
    );
  };

  const ShowFlatList = () => {
    return (
      <FlatList
        style={styles.container}
        data={ticketComments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    );
  };

  const Avatar = ({title}) => {
    const nameArray = title.trim().split(/[. ]/);
    const name =
      nameArray.length > 1
        ? nameArray
            .map((item) => item[0].toUpperCase())
            .join('')
            .slice(0, 2)
        : nameArray[0].slice(0, 2);

    console.log(name);

    return (
      <View style={styles.avatarView}>
        <Text style={styles.avatarText}>{name}</Text>
      </View>
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.commentItemView}>
      <View style={styles.commentUserView}>
        <Avatar title={item.commentBy} />
        <Text style={styles.commentByText}>{item.commentBy.trim()} </Text>
      </View>
      <View style={[styles.commentTextView]}>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
      <View style={styles.commentDateView}>
        <Text style={styles.commentDateText}>
          {moment.utc(item.createdAt).local().format(DMY_AT_TIME_FORMAT)}
        </Text>
      </View>
    </View>
  );

  const onChangeCommentHandler = (text) => {
    // console.log(text);
    // commentText = text;
    setCommentText(text);
  };

  const handleOnSubmit = () => {
    console.log(
      JSON.stringify({COMMENT_STATE: commentState, text: commentText}),
    );
    // setCommentState((state) => ({...state, text: commentText}));
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
      <KeyboardAvoidingView style={styles.commentBox}>
        <MaterialIconView iconName="chat-bubble" />

        <TextInput
          value={commentText}
          style={styles.container}
          onChangeText={onChangeCommentHandler}
          placeholder="Comment"
          onEndEditing={onChangeCommentHandler}
        />
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

  const ContactButton = () => {
    return (
      <TouchableOpacity>
        <MaterialIconView iconName="account-circle" />
      </TouchableOpacity>
    );
  };
  const SendButton = () => {
    return (
      <TouchableOpacity onPress={handleOnSubmit}>
        <MaterialIconView iconName="send" />
      </TouchableOpacity>
    );
  };
  const AttachmentButton = () => {
    return (
      <TouchableOpacity>
        <MaterialIconView iconName="attach-file" />
      </TouchableOpacity>
    );
  };

  const PictureButton = () => {
    return (
      <TouchableOpacity>
        <MaterialIconView iconName="photo" />
      </TouchableOpacity>
    );
  };

  const commentFooter = () => {
    return (
      <View style={styles.commentFooter}>
        {commentBox()}
        <SendButton />
        {/* <ContactButton />
        <AttachmentButton />
        <PictureButton /> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ShowFlatlistOrNoCommentText />
      {commentFooter()}
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
    padding: PaddingConstants.tab1,
    borderTopColor: Colors.darkerGrey,
    borderTopWidth: 1,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.white,
    padding: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1,
    marginVertical: MarginConstants.halfTab,
  },

  commentUserView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: MarginConstants.tab1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    borderRadius: 5,
  },

  commentDateView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginEnd: MarginConstants.halfTab,
    padding: PaddingConstants.halfTab,
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.medium,
    borderRadius: 5,
  },

  commentTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,

    marginStart: MarginConstants.tab4,
    marginEnd: MarginConstants.halfTab,

    backgroundColor: Colors.darkerGrey,
    padding: MarginConstants.tab1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    borderRadius: 5,
  },
  commentItemView: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,

    padding: MarginConstants.tab1,
    marginVertical: MarginConstants.halfTab,
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
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  commentDateText: {
    flex: 1,
    textAlign: 'right',
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.mediumText,
    color: Colors.filterIconColor,
  },
  avatarView: {
    borderRadius: 50,
    height: MarginConstants.tab3,
    width: MarginConstants.tab3,
    backgroundColor: Colors.filterIconColor,
    marginHorizontal: MarginConstants.halfTab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._600,
    fontSize: TextSizes.secondary,
  },
});
