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
  Keyboard,
} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar} from '../../routes/commonUI/CommonUI';
import {
  getClosedLoopTicketItemComments,
  postAddTicketComment,
  resetParentComment,
  setParentComment,
} from '../../redux/actions/dashboard.actions';
import moment from 'moment';
import StringUtils from '../../Utils/StringUtils';
import {getDateTimeAgo, toLocalTime} from '../../Utils/TimeUtils';
import RenderHTML, {defaultSystemFonts} from 'react-native-render-html';
import {translate} from '../../Utils/MultilinguaUtils';
import {baseTextStyles} from '../../styles/text.styles';
import {HorizontalSpaceBox, VerticalSpaceBox} from '../../widgets/SpaceBox';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import {EmptyView} from './EmptyVIew';
import Collapsible from './CentralizedRootCause/components/CollapsableView';
import SendCommentButton from '../../widgets/SendCommentButton';
export function getFoldedText(text, MAX_WORD_LENGTH = 10) {
  if (StringUtils.getWords(text).length > MAX_WORD_LENGTH) {
    return `${StringUtils.getWords(text).slice(0, MAX_WORD_LENGTH).join(' ')}
      <span style="color:${Colors.accentLight};"> ...see more</span>`;
  }
  return text;
}

export function getFoldedTextByCharacter(text, MAX_CHAR_LENGTH = 256) {
  if (text.length > MAX_CHAR_LENGTH) {
    return `${text.slice(0, MAX_CHAR_LENGTH)}<span style="color:${
      Colors.accentLight
    };"> ...see more</span>`;
  }
  return text;
}

export function getFoldedDescriptionText(text, MAX_WORD_LENGTH = 10) {
  if (StringUtils.getWords(text).length > MAX_WORD_LENGTH) {
    return `${StringUtils.getWords(text).slice(0, MAX_WORD_LENGTH).join(' ')}
      <span style="color:${Colors.accentLight};"> ...see more</span>`;
  }
  return text;
}
export const UserNameAndCommentContainer = ({children, isSelected}) => {
  return (
    <View
      style={
        isSelected ? styles.commentSelectedTextView : styles.commentTextView
      }>
      {children}
    </View>
  );
};
export const UserAvatar = ({title}) => {
  const size = MarginConstants.tab1_5x;
  return (
    // <View style={styles.commentUserView}>
    <Avatar
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
      textStyle={{
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.secondary,
      }}
    />
    // </View>
  );
};

export const CommentCancelReplyButton = ({isSelected, toggle}) => {
  return (
    <Pressable
      testID="cancel-reply-button"
      style={{
        paddingStart: MarginConstants.tab1_2x + MarginConstants.halfTab,
        marginVertical: MarginConstants.halfTab,
      }}
      onPress={toggle}>
      <Text style={[styles.replyText, {color: Colors.accentLight}]}>
        {isSelected ? translate('cancel') : translate('comment.reply')}
      </Text>
    </Pressable>
  );
};

export const CommentText = ({text}) => {
  const {width} = useWindowDimensions();
  const systemFonts = [...defaultSystemFonts, FontFamily.regular];

  return (
    <View testID="comment-text-container">
      <RenderHTML
        ignoredDomTags={['html', 'head', 'body']}
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

export const CommentParentItemContainer = ({isSelected, children}) => {
  return (
    <ScrollView
      testID="comment-parent-item-container"
      style={[
        styles.commentParentItemContainer,
        {borderColor: isSelected ? Colors.transparent : Colors.transparent},
      ]}>
      {children}
    </ScrollView>
  );
};
export const CommentBoxParentContainer = ({
  sendButtonVisible,
  textInputHeight,
  UIalignItems,
  children,
}) => {
  // Account for input padding (top + bottom) and additional space for bottom container
  const totalHeight = Math.max(
    // minimum height
    MarginConstants.tab2 * 3,
    textInputHeight +
      MarginConstants.halfTab * 2 +
      MarginConstants.tab2 +
      (sendButtonVisible ? MarginConstants.tab1_4x : 0), // content + padding + bottom space
  );

  return (
    <View
      style={[
        styles.commentBoxContainer,
        styles.borderStyle,
        {
          height: totalHeight,
          alignItems: UIalignItems,
        },
      ]}>
      {children}
    </View>
  );
};

const CommentBoxChildContainer = ({UIalignItems, children}) => {
  return (
    <View
      style={[
        styles.commentBox,
        {
          alignItems: UIalignItems,
          flex: 1,
          maxHeight: '70%', // Prevent overflow, leave space for bottom container
        },
      ]}>
      {children}
    </View>
  );
};

export const CommentBottomContainer = ({children}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: MarginConstants.halfTab,
        paddingTop: MarginConstants.halfTab,
      }}>
      {children}
    </View>
  );
};

export const CommentInput = React.forwardRef(
  (
    {
      value,
      textInputHeight,
      setTextInputHeight,
      onChangeHandler,
      hasParentId,
      onFocus,
      onBlur,
    },
    ref,
  ) => {
    const placeHolder =
      // parentComment.id > 0
      hasParentId
        ? translate('comment.write_a_reply')
        : translate('comment.write_a_comment');

    return (
      <TextInput
        testID="comment-text-input"
        ref={ref}
        value={value}
        multiline
        // maxLength={MAX_COMMENT_LENGTH}
        placeholderTextColor={Colors.borderColor}
        style={[
          {
            height: Math.max(36, textInputHeight + MarginConstants.halfTab * 2),
            maxHeight: 120, // Limit maximum height to prevent excessive growth
            justifyContent: 'flex-start',
            paddingHorizontal: MarginConstants.halfTab,
            paddingVertical: MarginConstants.halfTab,
            textAlignVertical: 'top',
          },
          styles.commentText,
        ]}
        onChangeText={onChangeHandler}
        placeholder={placeHolder}
        onFocus={onFocus}
        onBlur={onBlur}
        onContentSizeChange={event_ => {
          // Get content height and ensure it doesn't exceed reasonable limits
          const contentHeight = event_.nativeEvent.contentSize.height;
          setTextInputHeight(Math.min(contentHeight, 120)); // Cap the height
        }}
        returnKeyType={'default'}
      />
    );
  },
);

export const TextLengthCount = ({textLength, maxCountLength}) => {
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

export const CommentItem = ({item, isSelected = false}) => {
  const [isFolded, setFolded] = useState(true);
  const {commentBy, createdAt, text} = item;

  return (
    <Pressable
      style={[styles.commentItemView]}
      onPress={() => {
        setFolded(state => !state);
      }}>
      <UserAvatar title={StringUtils.reformatComplexName(commentBy)} />
      <UserNameAndCommentContainer isSelected={isSelected}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <TextLabel
            text={StringUtils.reformatComplexName(commentBy.trim())}
            style={styles.commentByText}
          />
          <TextLabel
            text={getDateTimeAgo(moment.utc(createdAt).toDate())}
            style={styles.commentDateText}
          />
        </View>
        <VerticalSpaceBox multiplyBy={0.5} />
        <CommentText
          text={isFolded ? getFoldedTextByCharacter(text.trim()) : text.trim()}
        />
      </UserNameAndCommentContainer>
    </Pressable>
  );
};

export const ShowNestedFlatList = ({data, isSelected}) => {
  const MemoizedCommentItem = React.memo(CommentItem);

  return (
    <View style={[styles.container]}>
      {data.map(item => (
        <MemoizedCommentItem
          key={item.id.toString()}
          item={item}
          isSelected={isSelected}
        />
      ))}
    </View>
  );
};

export const CommentParentItem = ({item}) => {
  // const [isCommentBoxVisible, setCommentBoxVisibility] = useState(false);
  const [isSHowingReplies, setIsShowingReplies] = useState(false);
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

  return (
    <CommentParentItemContainer isSelected={isSelected}>
      <CommentItem item={item} isSelected={isSelected} />
      <CommentCancelReplyButton
        isSelected={isSelected}
        toggle={toggleCommentBoxVisibility}
      />
      {item.children.length > 0 ? (
        <Collapsible
          setIsOpenExternal={setIsShowingReplies}
          headerTitle={`${isSHowingReplies ? 'Hide' : 'Show'} ${
            item.children.length
          } ${item.children.length === 1 ? 'reply' : 'replies'}`}
          isInitiallyOpen={isSHowingReplies}
          headerTitleStyle={{
            fontFamily: FontFamily.regular,
            fontSize: TextSizes.secondary,
            fontWeight:
              Platform.OS === 'ios' ? FontWeight._400 : FontWeight._600,
            color: Colors.evenDarkerGrey,
          }}
          style={{
            marginStart: MarginConstants.tab1_8x,
            marginTop: MarginConstants.halfTab,
            borderWidth: 0,
            backgroundColor: Colors.transparent,
          }}
          headerStyle={{
            backgroundColor: Colors.transparent,
            paddingHorizontal: 0,
            paddingVertical: MarginConstants.halfTab,
            flexDirection: 'row',

            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <ShowNestedFlatList data={item.children} isSelected={isSelected} />
        </Collapsible>
      ) : (
        <View />
      )}
    </CommentParentItemContainer>
  );
};

export const CommentBox = ({isKeyboardVisible, setKeyboardVisible}) => {
  const authToken = useSelector(state => state.global.authToken);
  const ticketId = useSelector(state => state.dashboard.ticket.id);
  const dispatch = useDispatch();
  const textInputRef = useRef();
  const parentComment = useSelector(state => state.dashboard.parentComment);
  const {emailAddress, firstName, lastName, userID} = useSelector(
    state => state.global.userInfo,
  );
  const [commentText, setCommentText] = useState('');
  const [textInputHeight, setTextInputHeight] = useState(0);
  const [isInputFocused, setInputFocused] = useState(false);
  // const userInfo = useSelector(state => state.global.userInfo);
  const UIalignItems = textInputHeight < 48 ? 'center' : 'flex-end';
  // console.log('USER_INFO', JSON.stringify(userInfo));

  // Show SendButton when either keyboard is visible OR input is focused
  const shouldShowSendButton = isKeyboardVisible || isInputFocused;

  // const marginForCommentBox = parentId > 0 ? MarginConstants.tab4 : 0;

  useEffect(() => {
    if (parentComment.isFocused) {
      textInputRef.current.focus();
    }
  }, [parentComment]);

  const commentState = {
    commentBy: `${firstName} ${lastName}`.trim(), //mehedi.hasan
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

  const handleInputFocus = () => {
    console.log('Input focused');
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    console.log('Input blurred');
    setInputFocused(false);
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
    setKeyboardVisible(false);
  };

  return (
    <CommentBoxParentContainer
      textInputHeight={textInputHeight}
      sendButtonVisible={shouldShowSendButton}
      UIalignItems={UIalignItems}>
      <View style={{flex: 1}}>
        <CommentBoxChildContainer UIalignItems={UIalignItems}>
          <VerticalSpaceBox />
          <CommentInput
            ref={textInputRef}
            value={commentText}
            textInputHeight={textInputHeight}
            setTextInputHeight={setTextInputHeight}
            onChangeHandler={onChangeCommentHandler}
            hasParentId={parentComment.id > 0}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </CommentBoxChildContainer>
        <VerticalSpaceBox />
        <CommentBottomContainer>
          <HorizontalSpaceBox />
          {shouldShowSendButton && (
            <SendCommentButton
              buttonStyle={{
                padding: PaddingConstants.halfTab,
                backgroundColor: Colors.accentLight,
                borderRadius: 2,
              }}
              handleOnSubmit={handleOnSubmit}
              size={20}
            />
          )}
          <HorizontalSpaceBox />
        </CommentBottomContainer>
        <VerticalSpaceBox />
      </View>
    </CommentBoxParentContainer>
  );
};

export const ShowFlatList = ({data, onRefresh_, refreshing_}) => {
  const ticketComments = useSelector(state => state.dashboard.ticketComments);

  const MemoizedCommentParentItem = React.memo(CommentParentItem);

  if (ticketComments.length === 0) {
    return (
      <EmptyView
        title={'There are no comments yet'}
        subTitle={
          'Add a note, ask a question, or mention a teammate to move this ticket forward.'
        }
      />
    );
  }
  return (
    <FlatList
      data={ticketComments}
      refreshControl={
        <RefreshControl onRefresh={onRefresh_} refreshing={refreshing_} />
      }
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <MemoizedCommentParentItem item={item} />}
      extraData={data}
    />
  );
};

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
    marginHorizontal: MarginConstants.halfTab,
  },

  borderStyle: {
    borderColor: Colors.darkerGrey,
    borderRadius: 8,
    borderWidth: 1,
  },
  commentBoxContainer: {
    minHeight: MarginConstants.tab2 * 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: MarginConstants.tab1_2x,
    marginBottom:
      Platform.OS === 'ios' ? MarginConstants.tab2 * 3 : MarginConstants.tab2,
    marginHorizontal: MarginConstants.tab2,
    backgroundColor: Colors.white,
  },

  commentUserView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingEnd: MarginConstants.halfTab,
    paddingVertical: MarginConstants.tab1 + MarginConstants.halfTab,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,

    borderRadius: 5,
  },

  commentDateView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginEnd: MarginConstants.halfTab,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    borderRadius: 5,
  },

  commentTextView: {
    flex: 1,
    marginEnd: MarginConstants.halfTab,
    justifyContent: 'flex-start',
    backgroundColor: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  commentSelectedTextView: {
    flex: 1,
    marginEnd: MarginConstants.halfTab,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  commentItemView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
    padding: PaddingConstants.halfTab,
  },
  commentLengthLimitText: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.semiMediumText,
    color: Colors.deleteButtonText,
    padding: PaddingConstants.halfTab,
  },
  commentByText: {
    alignItems: 'flex-end',
    fontFamily: FontFamily.medium,
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
    textAlign: 'justify',
    justifyContent: 'center',
    alignSelf: 'center',
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.evenDarkerGrey,
  },
  commentParentItemContainer: {
    margin: MarginConstants.tab1,
    padding: PaddingConstants.halfTab,
    borderWidth: 1,
  },
  shadowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
});
