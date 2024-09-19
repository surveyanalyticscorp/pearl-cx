import React from 'react';
import {Dimensions, Platform, Pressable, StyleSheet, View} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MaterialIcons} from '../../Utils/IconUtils';
const FabAddButton = props => {
  let {width} = Dimensions.get('window');

  let size = width / 8;
  let fabStyle = StyleSheet.create({
    fabContainer: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 36 : 24,
      right: 24,
      width: size,
      height: size,
      borderRadius: 50,
      backgroundColor: Colors.accentLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={fabStyle.fabContainer}>
      <Pressable
        accessibilityRole="button"
        testID="fab-button"
        onPress={props.onPress}>
        <MaterialIcons name="add" size={size - 5} color={Colors.white} />
      </Pressable>
    </View>
  );
};

export default FabAddButton;
