import React, {useRef, useState, useEffect} from 'react';
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
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? contentHeight : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOpen, contentHeight]);

  const animatedStyle = {
    height: animation,
    overflow: 'hidden',
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable style={styles.header} onPress={toggle}>
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

      {/* Hidden content for measurement */}
      <View
        style={styles.hiddenContent}
        onLayout={e => {
          const height = e.nativeEvent.layout.height;
          if (height > 0 && contentHeight !== height) {
            setContentHeight(height);
          }
        }}>
        {children}
      </View>

      {/* Animated visible content */}
      <Animated.View style={animatedStyle}>
        <View>{children}</View>
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
    fontWeight: FontWeight._600,
    color: Colors.filterIconColor,
  },
  trailing: {
    marginLeft: 8,
  },
  hiddenContent: {
    position: 'absolute',
    top: -9999,
    left: 0,
    right: 0,
    opacity: 0,
  },
});

export default Collapsible;
