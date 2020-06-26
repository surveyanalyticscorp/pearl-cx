import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import styles from './style';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';
import FadeInView from '../FadeInView';

class CompentencySelection extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: 'Performance Review' }));
    ActionBarModule.toggleBackButton(false);
    this.props.navFunc();
  }

  getImageUri = src => {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  };

  onButtonPress = (avatar) => {
    Actions.reviewCategories();
    ActionBarModule.toggleBackButton(true);
  };

  render() {
    const items = this.props;
    return (
      <View style={styles.container}>
        <FadeInView delay={1000} from={20} duration={3000} toValue={3000} style={styles.topContainer}>
          <View style={styles.topTextContainer}>
            <Text style={styles.topText}>
              You have selected{' '}
              <Text style={styles.lightText}>
                {`${items.selectedEmployeeInfo.first_name}`}
              </Text>{' '}
              for a performance review.
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image resizeMethod="resize" style={styles.image} source={{ uri: items.selectedEmployeeInfo.imageURL }} />
          </View>
        </FadeInView>
        <FadeInView delay={2000} from={0} duration={3000} toValue={3000} style={styles.middleContainer}>
          <View style={styles.topTextContainer}>
            <Text style={styles.middleText}>
              Now select <Text style={styles.lightText}>{this.props.maxCompetencyCount} compentencies</Text> on which to base your review.
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image resizeMethod="resize" style={styles.image} source={this.getImageUri('compentencies.png')} />
          </View>
        </FadeInView>
        <FadeInView delay={2900} from={0} duration={3000} toValue={3000} style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => this.onButtonPress(items.selectedEmployeeInfo.avatar)}>
            <View style={styles.buttonContainer}>
              <Image style={{ width: 12, height: 22 }} source={this.getImageUri('arrowRightWhite.png')} />
            </View>
          </TouchableOpacity>
        </FadeInView>
      </View>)
  }
}

export default CompentencySelection;
