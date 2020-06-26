import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  Animated,
  Platform,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  TouchableHighlight,
  TouchableNativeFeedback
} from 'react-native';

import * as Animatable from 'react-native-animatable';

const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;

let isAlreadySelected = false;

class TreeViewElementWidget extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      collapsed: {}
    }
  }

  _pressed = (event) => {
    if (this.props.index) {
      this.props.onSelect(this.props.node, event.nativeEvent);
    }
  };

  _runLayoutAnimation = () => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
    //   console.log('animation completion');
    }); 
  }

  render() {
    let data = this.props;

    if (!isAlreadySelected) { isAlreadySelected = data.selected; }

    let imageStyle = data.active ? {
      borderWidth: 5,
      borderColor: data.selected === true ? '#99cc99' : 'white'
    } : {
      borderWidth: 2,
      borderColor: data.selected === true ? '#99cc99' : 'white'
    };

    return (
      <Animatable.View 
        transition="borderColor"
        duration={1000}
        style={[styles.peer, this.props.style]}>
        <TouchableHighlight
          onPress={this._pressed}
          underlayColor='rgba(255, 255, 255, 0)'
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={[styles.employeeImage, imageStyle, { width: data.selected ? 70 : 60, height: data.selected ? 70 : 60, borderRadius: data.selected ? 35 : 30 }]}
                source={{ uri: data.imageURI }}/>
            </View>
            <View style={styles.employeeNameBg}><Text numberOfLines={2} style={styles.employeeName}>{data.text}</Text></View>
          </View>
        </TouchableHighlight>
        { data.hasChild && this.renderConnector()}
      </Animatable.View>
    );
  }

  renderConnector(hasChild) {
    return (
      <Animatable.View style={{ opacity: 0.4 }} animation={'zoomIn'} duration={200} easing={'ease-in-out-sine'} >
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 1
        }}>
          <View style={{ width: 1, height: 25, backgroundColor: 'white' }}/>
        </View>

        <View style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{ width: 100, height: 1, backgroundColor: 'white' }}/>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'center'

        }}>
          <View style={{ width: 1, height: 20, backgroundColor: 'white', left: 50 }}/>
          <View style={{ width: 1, height: 20, backgroundColor: 'white', right: 50 }}/>
        </View>
      </Animatable.View>);
  }

}


const styles = StyleSheet.create({
  employeeName: {
    fontSize: 16,
    color: 'white',
    width: 100,
    alignItems: 'center',
    textAlign: 'center'
  },
  employeeNameBg: {
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
    alignItems: 'center',
    borderColor: 'grey',
    padding: 4
  },
  peer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  employeeImage: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  active: {
    borderColor: '#0097DC'
  }
});

export default TreeViewElementWidget;
