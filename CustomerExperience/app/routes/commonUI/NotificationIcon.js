import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {Sizes} from '../../styles/Size.constant';
import {TextSizes} from '../../styles/textsize.constants';
import {useNavigation} from '@react-navigation/native';
import FontIcon from 'react-native-vector-icons/FontAwesome';
const NotificationIcon = ({notificationCount}) => {
  let navigation = useNavigation();
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: MarginConstants.tab2},
      ]}>
      <Pressable
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => {
          navigation.navigate('Notifications');
        }}>
        <FontIcon name={'bell'} size={1.1 * Sizes.icons} color={Colors.white} />
      </Pressable>

      {notificationCount > 0 ? (
        <RenderNotificationBadge count={notificationCount} />
      ) : (
        <View />
      )}
    </View>
  );
};

let RenderNotificationBadge = ({count}) => {
  return (
    <View style={styles.badge}>
      <Text style={{fontSize: TextSizes.primary, color: Colors.white}}>
        {count}
      </Text>
    </View>
  );
};

export default NotificationIcon;
const styles = StyleSheet.create({
  drawerStyle: {
    backgroundColor: Colors.white,
    elevation: 5,
    zIndex: 100,
  },
  rightHeaderButton: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badge: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
    alignItems: 'center',
  },
});
