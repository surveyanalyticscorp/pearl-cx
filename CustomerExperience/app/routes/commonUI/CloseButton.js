import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {Sizes} from '../../styles/Size.constant';

export const CloseButton = ({color}) => {
  let navigation = useNavigation();
  const iconColor = !color ? Colors.white : color;
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: MarginConstants.tab2},
      ]}>
      <Pressable
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => {
          navigation.goBack();
        }}
        testID={'button'}>
        <MaterialIcon
          name={'close'}
          size={1.1 * Sizes.filterIcon}
          color={iconColor}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  rightHeaderButton: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
