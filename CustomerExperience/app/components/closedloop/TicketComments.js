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
import {FontFamily} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {NoItemsFound} from '../../routes/CommonScreen';
import {addClosedLoopTicket} from '../../redux/sagas/ClosedLoopSaga';
import {postAddTicketComment} from '../../redux/actions/dashboard.actions';
// import {Sizes} from '../../styles/Size.constant';
// import moment from 'moment';
// import {translate} from '../../Utils/MultilinguaUtils';
// import IonIcons from 'react-native-vector-icons/Ionicons';
// import QPButton from '../../widgets/Button';
// import ModalDropdown from '../../widgets/drop-down/ModalDropdown';
// import {backgroundColor} from '../../widgets/qp-calendar/style';

export default function TicketComments(props) {
  const {authToken} = useSelector((state) => state.global);
  const [ticketComments, setTicketComments] = useState(
    useSelector((state) => state.dashboard.ticketComments),
  );
  const {emailAddress, firstName, lastName} = useSelector(
    (state) => state.global.userInfo,
  );
  const ticketId = useSelector((state) => state.dashboard.ticket.id);
  const dispach = useDispatch();
  const [commentState, setCommentState] = useState({
    commentBy: `${firstName} ${lastName}`,
    userName: `${firstName} ${lastName}`,
    userEmailAddress: `${emailAddress}`,
    text: '',
    ticket: JSON.stringify(ticketId),
    parentId: 0,
    subscriberId: global.subscriberId,
  });
  let commentText = '';

  const sampleData = [
    // {id: 1, title: 'Astro'},
    // {id: 2, title: 'Bakun'},
  ];

  // useEffect(() => {
  //   setTicketComments();
  // }, []);

  console.log('TICKET COMMENTS on UI', JSON.stringify(ticketComments));
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

  const renderItem = ({item}) => (
    <Text style={styles.commentText}>
      {item.text} from {item.commentBy}
    </Text>
  );

  const onChangeCommentHandler = (text) => {
    console.log(text);
    commentText = text;
    // setCommentState((state) => ({...state, text: text}));
  };

  const handleOnSubmit = () => {
    let state = {
      commentBy: 'Mehedi',
      text: commentText,
      ticketId: ticketId,
      parentId: 0,
      subscriberId: global.subscriberId,
    };
    dispach(postAddTicketComment(authToken, state, ticketId));

    setCommentState((state) => ({...state, text: ''}));
  };
  const CommentBox = () => {
    return (
      <KeyboardAvoidingView style={styles.commentBox}>
        <MaterialIconView iconName="chat-bubble" />

        <TextInput
          style={styles.container}
          onChangeText={onChangeCommentHandler}
          placeholder="Comment"
          onEndEditing={onChangeCommentHandler}
        />
      </KeyboardAvoidingView>
    );
  };

  const MaterialIconView = ({iconName}) => (
    <View style={{margin: MarginConstants.halfTab}}>
      <MaterialIcon name={iconName} size={24} color={Colors.filterIconColor} />
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

  const CommentFooter = () => {
    return (
      <View style={styles.commentFooter}>
        <CommentBox style={styles.commentBox} />
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
      <CommentFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
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

  commentText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.white,
    padding: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1,
    marginVertical: MarginConstants.halfTab,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    borderRadius: 5,
  },
});
