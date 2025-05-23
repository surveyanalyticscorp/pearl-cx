import React, {useRef, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const bottomSheetHeight = SCREEN_HEIGHT * 0.9;

/**
 * QPBottomSheet - A customizable bottom sheet component with drag-to-dismiss functionality
 *
 * Features:
 * - Slides up from the bottom of the screen
 * - Can be dragged down to dismiss
 * - Smooth animations for opening/closing
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be displayed inside the bottom sheet
 * @param {boolean} props.visible - Controls the visibility of the bottom sheet
 * @param {Function} props.onClose - Callback function triggered when the sheet is dismissed
 */
const QPBottomSheet = ({
  headerComponent,
  children,
  visible,
  onClose,
  contentStyle,
}) => {
  const translateY = useRef(new Animated.Value(bottomSheetHeight)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.y.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > bottomSheetHeight * 0.3) {
          Animated.timing(translateY, {
            toValue: bottomSheetHeight,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            pan.setValue({x: 0, y: 0});
          });
        } else {
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      translateY.setValue(bottomSheetHeight);
    }
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            contentStyle,

            {
              height: bottomSheetHeight,
              transform: [{translateY: Animated.add(translateY, pan.y)}],
            },
          ]}>
          <View style={styles.dragIndicator} {...panResponder.panHandlers} />
          {headerComponent && headerComponent}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    alignContent: 'center',
  },
  dragIndicator: {
    width: SCREEN_WIDTH * 0.4,
    height: 4,
    backgroundColor: Colors.borderColor,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: MarginConstants.tab1_2x,
    marginBottom: MarginConstants.tab1,
  },
});

export default QPBottomSheet;
