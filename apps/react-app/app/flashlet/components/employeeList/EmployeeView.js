import React from 'react';
import { View, Text, Image, Platform, TouchableHighlight } from 'react-native';

import styles from './EmployeeViewStyle';
import EmployeeImage from './EmployeeImage';

const EmployeeCell = props => {
  _cellTap = () => {
    props.select();
  };

  return (
    <TouchableHighlight onPress={this._cellTap} underlayColor={'rgba(0, 0, 0, 0.04)'}>
      <View style={[styles.cellContainer, { backgroundColor: props.selected ? 'rgba(0, 0, 0, 0.08)' : 'white' }]}>
        <View style={styles.cell}>
          <EmployeeImage source={props.item.imageURL} />
          <View style={styles.employeeDetail}>
            <Text style={styles.text}>{`${props.item.first_name} ${props.item.last_name}`}</Text>
            <Text style={styles.text}>{`${props.item.location}`}</Text>
          </View>
          {getRightIcon(props.origin)}
        </View>
        <View style={styles.bottomView} />
      </View>
    </TouchableHighlight>
  );
};

const _getImageUri = src => {
  if (Platform.OS === 'android') {
    return { uri: `asset:/${src}` };
  }
  return { uri: src };
};

const getRightIcon = origin => {
    if(origin === 'PRAISE')
      return getBadge();
    else if(origin === 'REVIEW') {
      return getImage();
    } else if (origin === 'REQUEST_REVIEW') {
      return getBlankText();
    }

};

const getBlankText = () => {
    return (
        <View>
            <Text></Text>
        </View>
    );
}

const getImage = () => {
  return <Image source={_getImageUri('arrowRight.png')} style={styles.rightIcon} />;
};

const getBadge = () => {
  return (
    <View style={styles.badgeCount}>
      <Text>+1</Text>
    </View>
  );
};

export default EmployeeCell;
