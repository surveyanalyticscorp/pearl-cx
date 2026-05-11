import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {Sizes} from '../../styles/Size.constant';

export const SearchIcon = () => {
  let navigation = useNavigation();
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: MarginConstants.tab2},
      ]}>
      <Pressable
        testID={'search-button'}
        onPress={() => {
          navigation.navigate('Search Response');
        }}>
        <Icon name={'magnifier'} size={Sizes.icons} color={Colors.white} />
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
