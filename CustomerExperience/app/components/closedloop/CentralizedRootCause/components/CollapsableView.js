import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  UIManager,
} from 'react-native';
import {IonIcon} from '../../../../Utils/IconUtils';
import {TextSizes} from '../../../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../../../styles/font.constants';
import {Colors} from '../../../../styles/color.constants';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const Collapsible = ({
  headerTitle,
  leadingComponent,
  tailingComponent,
  style,
  headerStyle,
  children,
  isInitiallyOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(
    new Animated.Value(isInitiallyOpen ? 9999 : 0),
  ).current;

  const toggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    Animated.timing(animatedHeight, {
      toValue: nextState ? contentHeight : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const onMeasure = e => {
    const height = e.nativeEvent.layout.height;
    if (height !== contentHeight) {
      setContentHeight(height);
      if (isInitiallyOpen) {
        animatedHeight.setValue(height); // ensure correct height on first mount
      }
    }
  };

  return (
    <View style={style ?? styles.container}>
      <Pressable style={headerStyle ?? styles.header} onPress={toggle}>
        {leadingComponent && (
          <View style={styles.leading}>{leadingComponent}</View>
        )}
        <Text style={styles.title}>{headerTitle}</Text>
        <View style={styles.trailing}>
          {tailingComponent ? (
            tailingComponent
          ) : (
            <IonIcon
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.filterIconColor}
            />
          )}
        </View>
      </Pressable>

      {/* Off-screen measurement of content */}
      <View
        style={styles.hiddenContent}
        onLayout={onMeasure}
        pointerEvents="none">
        {children}
      </View>

      {/* Animated visible content */}
      <Animated.View
        style={{height: animatedHeight, overflow: 'hidden'}}
        pointerEvents={isOpen ? 'auto' : 'none'}>
        {isOpen ? children : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.negativePromter,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.settingsBackground,
  },
  leading: {
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary2,
    fontWeight: Platform.OS === 'ios' ? FontWeight._400 : FontWeight._600,
    color: Colors.filterIconColor,
  },
  trailing: {
    marginLeft: 8,
  },
  hiddenContent: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
    left: 0,
    right: 0,
  },
});

export default Collapsible;

// import React, {useRef, useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Animated,
//   Platform,
//   UIManager,
// } from 'react-native';
// import {Colors} from '../../../../styles/color.constants';
// import {TextSizes} from '../../../../styles/textsize.constants';
// import {FontFamily} from '../../../../styles/font.constants';
// import {PaddingConstants} from '../../../../styles/padding.constants';

// if (Platform.OS === 'android') {
//   UIManager.setLayoutAnimationEnabledExperimental?.(true);
// }

// const Collapsible = ({
//   headerTitle,
//   children,
//   isInitiallyOpen = false,
//   style,
//   onToggle,
// }) => {
//   const [isOpen, setIsOpen] = useState(isInitiallyOpen);
//   const [contentHeight, setContentHeight] = useState(0);
//   const animatedHeight = useRef(
//     new Animated.Value(isInitiallyOpen ? 999 : 0),
//   ).current;

//   const toggle = () => {
//     const next = !isOpen;
//     Animated.timing(animatedHeight, {
//       toValue: next ? contentHeight : 0,
//       duration: 250,
//       useNativeDriver: false,
//     }).start();
//     setIsOpen(next);
//     onToggle?.(next);
//   };

//   const onMeasure = e => {
//     const height = e.nativeEvent.layout.height;
//     if (height !== contentHeight) {
//       setContentHeight(height);
//       if (isOpen) {
//         animatedHeight.setValue(height);
//       }
//     }
//   };

//   return (
//     <View style={[styles.container, style]}>
//       <Pressable style={styles.header} onPress={toggle}>
//         <Text style={styles.title}>
//           {isOpen ? '▾' : '▸'} {headerTitle}
//         </Text>
//       </Pressable>

//       {/* Offscreen hidden content for measuring height */}
//       <View style={styles.hiddenContent} onLayout={onMeasure}>
//         {children}
//       </View>

//       {/* Animated visible content */}
//       <Animated.View style={{height: animatedHeight, overflow: 'hidden'}}>
//         <View pointerEvents={isOpen ? 'auto' : 'none'}>{children}</View>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 1,
//     borderColor: '#aaa',
//     borderRadius: 8,
//     marginVertical: 6,
//     backgroundColor: '#fff',
//   },
//   header: {
//     padding: PaddingConstants.tab1_2x,
//     backgroundColor: Colors.settingsBackground,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: TextSizes.primary,
//     fontFamily: FontFamily.regular,
//   },
//   hiddenContent: {
//     position: 'absolute',
//     opacity: 0,
//     zIndex: -1,
//     left: 0,
//     right: 0,
//   },
// });

// export default Collapsible;
