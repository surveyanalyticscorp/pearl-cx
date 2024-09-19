import React from 'react';
import {
  DrawerActions,
  StackActions,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Sizes} from '../../styles/Size.constant';

const MenuIcon = () => {
  let navigation = useNavigation();
  return (
    <View style={styles.rightHeaderButton}>
      <Pressable
        accessibilityRole="button"
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}>
        <Icon name="menu" size={Sizes.icons} color="white" />
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
export default MenuIcon;
