import React from 'react';
import { Text, View, Modal, TextInput, TouchableHighlight } from 'react-native';

import styles from './PraiseCommentStyle';

const CommentView = props => {
  doneTap = () => {
    props.doneAction(false);
  };

  textChanged = text => {
    props.inputChanged(text);
  };

  return (
    <Modal
      animationType={'none'}
      transparent={true}
      visible={true}
      onRequestClose={() => this.modalClosed()}
    >
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <TextInput
            multiline
            autoFocus={true}
            autoCorrect={false}
            style={styles.input}
            value={props.input}
            placeholder={'Optional Comment'}
            onChangeText={text => this.textChanged(text)}
          />
          {props.showError && (
            <Text style={styles.errorMsg}>Only 255 characters allowed.</Text>
          )}
          {!props.showError && (
            <TouchableHighlight
              onPress={this.doneTap}
              underlayColor={'rgba(0, 0, 0, 0.5)'}
              style={styles.doneButton}
            >
              <Text>DONE</Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CommentView;
