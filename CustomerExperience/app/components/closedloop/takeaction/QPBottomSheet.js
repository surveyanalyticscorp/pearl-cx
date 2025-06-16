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

const getHeightFromPercentage = value => {
  if (typeof value === 'string' && value.includes('%')) {
    const parsed = parseFloat(value.replace('%', ''));
    if (!isNaN(parsed)) {
      return SCREEN_HEIGHT * Math.min(Math.max(parsed / 100, 0), 1);
    }
  }
  return null; // Use wrap content
};

/**
 * QPBottomSheet - A customizable bottom sheet with optional height or auto-sizing
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Bottom sheet content
 * @param {React.ReactNode} props.headerComponent - Optional header
 * @param {boolean} props.visible - Controls modal visibility
 * @param {Function} props.onClose - Called when sheet is dismissed
 * @param {string} [props.bottomSheetHeight] - Optional height (e.g., '60%')
 * @param {Object} [props.contentStyle] - Optional style override for content container
 */
const QPBottomSheet = ({
  headerComponent,
  children,
  visible,
  onClose,
  contentStyle,
  bottomSheetHeight,
}) => {
  const sheetHeight = getHeightFromPercentage(bottomSheetHeight);
  const translateY = useRef(
    new Animated.Value(sheetHeight ?? SCREEN_HEIGHT),
  ).current;
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
        const threshold = (sheetHeight ?? SCREEN_HEIGHT) * 0.3;
        if (gestureState.dy > threshold) {
          Animated.timing(translateY, {
            toValue: sheetHeight ?? SCREEN_HEIGHT,
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
        bounciness: 5,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: sheetHeight ?? SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(onClose);
    }
  }, [visible, sheetHeight]);

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
              height: sheetHeight ?? undefined, // undefined = wrap content
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
