import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {getClosedLoopTicketItemComments} from '../../redux/actions/dashboard.actions';

import ListItemSeparator from '../../routes/commonUI/ListItemSeparator';
import {CommentBox, ShowFlatList} from './TicketCommentsUtils';

export default function TicketComments(props) {
  const authToken = useSelector(state => state.global);

  const ticketId = useSelector(state => state.dashboard.ticket.id);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        console.log('Keyboard shown');
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log('Keyboard hidden');
        setKeyboardVisible(false);
      },
    );

    // Add additional listeners for better cross-platform support
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        console.log('Keyboard will show');
        setKeyboardVisible(true);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        console.log('Keyboard will hide');
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

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
    <View testID={'ticket-comments'} style={[styles.container]}>
      <View style={{flex: 1, position: 'relative'}}>
        <ShowFlatList onRefresh_={onRefresh} refreshing_={refreshing} />
        {isKeyboardVisible && (
          <View style={styles.shadowOverlay} pointerEvents="none" />
        )}
      </View>
      <ListItemSeparator />
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 130 : MarginConstants.tab4 * 40
        }>
        <CommentBox
          isKeyboardVisible={isKeyboardVisible}
          setKeyboardVisible={setKeyboardVisible}
        />
      </KeyboardAvoidingView>
    </View>
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

    backgroundColor: Colors.white,
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
    textAlign: 'justify',
    justifyContent: 'center',
    alignSelf: 'center',
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.primary,
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
