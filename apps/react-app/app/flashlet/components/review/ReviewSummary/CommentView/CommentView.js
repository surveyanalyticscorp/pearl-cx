import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  TextInput,
  Dimensions,
    TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import KeyboardSpacer from 'react-native-keyboard-spacer';


import styles from './styles';
import AppStore from '../../../../../index/AppStore';
import { getColor } from '../../../../utils/levelColors';
import { ActionBarModule } from '../../../../../global/native-modules/NativeModules';

const { width } = Dimensions.get('window');

class CommentView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: props.category,
      value: props.value
    };
  }

  componentWillMount() {
    AppStore.DoneButtonStore.addDoneButtonListener(
      this.doneButtonAction.bind(this)
    );
  }

  componentWillUnmount() {
    AppStore.DoneButtonStore.removeDoneButtonListener(this.doneButtonAction);
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({
        title: 'Summary',
        image: this.props.avatar
      })
    );
    ActionBarModule.toggleBackButton(true);
  }

  doneButtonAction = () => {
    let category = Object.assign({}, this.state.category, { comment: this.state.value });
    this.setState({ category });
    this.props.setCommentText(this.state.category.id, this.state.value);
    Actions.pop();
  };

  _getImageUri(src) {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  }

  // Show done button
  _setDoneImage = () => {
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({
        title: 'Summary',
        image: 'arrowRightWhite',
        isStatic: true
      })
    );
  };

  _setCategoryComment(text) {
    this.setState({ value: text });
  }

  render() {
    const category = this.state.category;

    return (
      <View style={styles.item}>
        <View style={styles.content}>
          <TouchableWithoutFeedback>
            <View>
              <View style={styles.header}>
                <Text style={styles.categoryTxt}>{category.name.toUpperCase()}</Text>
                <Image style={{ width: 16, height: 16 }} source={this._getImageUri('comment-i.png')}/>
              </View>
              <View style={styles.reviewCategoryLayout}>
                {category.items &&
                  category.items.map((item, j) => {
                    const boxNumber = item.boxNumber && item.boxNumber > 0 ? item.boxNumber : item.rating;

                    return (
                      <View
                        style={[styles.reivewCategoryItem, { borderColor: getColor(boxNumber) }]}
                        key={`reviewitem-${j}`}
                      >
                        <Text style={[styles.categoryItemTxt, { color: getColor(boxNumber) }]}>{item.name}</Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TextInput
            multiline
            autoFocus={true}
            autoCorrect={false}
            style={[styles.commentBox]}
            onFocus={this._setDoneImage}
            placeholder={'Comment here...'}
            ref={`commentBox-${category.id}`}
            value={this.state.value}
            onChangeText={text => this._setCategoryComment(text)}
          />
            <TouchableHighlight onPress={this.doneButtonAction.bind(this)}>
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Text style={styles.buttonTxt}>Done</Text>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
      </View>
    );
  }

}

export default CommentView;
