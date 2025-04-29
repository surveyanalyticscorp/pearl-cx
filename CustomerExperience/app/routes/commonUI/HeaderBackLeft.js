import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Pressable, StyleSheet, View} from 'react-native';
import {Sizes} from '../../styles/Size.constant';
import {Colors} from '../../styles/color.constants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const HeaderBackLeft = props => {
  const navigation = useNavigation();
  return (
    <View style={styles.leftHeaderButton}>
      <Pressable
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        accessibilityRole="button"
        onPress={() => {
          if (
            props &&
            props.route &&
            props.route.params &&
            props.route.params.onBackPress
          ) {
            console.log('props.route.params.onBackPress');
            props.route.params.onBackPress();
            // navigation.goBack();
          } else {
            navigation.goBack();
          }
        }}>
        <Icon name="arrow-left" size={Sizes.icons} color={Colors.white} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  leftHeaderButton: {
    flexDirection: 'row',
    marginLeft: 10,
  },
});

export default HeaderBackLeft;
