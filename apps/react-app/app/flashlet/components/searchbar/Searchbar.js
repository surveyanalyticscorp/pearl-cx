import React, { Component } from 'react';
import {
  View,
  Image,
  Animated,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import * as _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from './styles';

const INITIAL_TOP = Platform.OS === 'ios' ? -80 : -60;
class Search extends Component {

  // static propTypes = {
  //   hideX: PropTypes.bool,
  //   data: PropTypes.array,
  //   onHide: PropTypes.func,
  //   onBack: PropTypes.func,
  //   animate: PropTypes.bool,
  //   hideBack: PropTypes.bool,
  //   showOnLoad: PropTypes.bool,
  //   iOSPadding: PropTypes.bool,
  //   clearOnShow: PropTypes.bool,
  //   clearOnHide: PropTypes.bool,
  //   textColor: PropTypes.string,
  //   autoCorrect: PropTypes.bool,
  //   iconColor: PropTypes.string,
  //   fontFamily: PropTypes.string,
  //   handleSearch: PropTypes.func,
  //   focusOnLayout: PropTypes.bool,
  //   placeholder: PropTypes.string,
  //   handleResults: PropTypes.func,
  //   heightAdjust: PropTypes.number,
  //   onSubmitEditing: PropTypes.func,
  //   handleChangeText: PropTypes.func,
  //   autoCapitalize: PropTypes.string,
  //   backgroundColor: PropTypes.string,
  //   animationDuration: PropTypes.number,
  //   allDataOnEmptySearch: PropTypes.bool,
  //   placeholderTextColor: PropTypes.string
  // };

  static defaultProps = {
    data: [],
    hideX: false,
    animate: true,
    hideBack: false,
    heightAdjust: 0,
    autoCorrect: true,
    iconColor: 'gray',
    textColor: 'gray',
    iOSPadding: true,
    showOnLoad: false,
    clearOnHide: true,
    clearOnShow: false,
    focusOnLayout: false,
    fontFamily: 'System',
    placeholder: 'Search',
    animationDuration: 200,
    backgroundColor: 'white',
    autoCapitalize: 'sentences',
    allDataOnEmptySearch: false,
    placeholderTextColor: 'lightgray'
  };

  constructor(props) {
    super(props);

    this.state = {
      input: '',
      show: props.showOnLoad,
      top: new Animated.Value(props.showOnLoad ? 0 : INITIAL_TOP + props.heightAdjust),
    };
  }

  show = () => {
    const { animate, animationDuration, clearOnShow } = this.props;

    if (clearOnShow) {
      this.setState({ input: '' });
    }

    this.setState({ show: true });

    if (animate) {
      Animated.timing(
        this.state.top, {
          toValue: 0,
          duration: animationDuration
        }
      ).start();
    } else {
      this.setState({ top: new Animated.Value(0) });
    }
  }

  hide = () => {
    const { onHide, animate, animationDuration } = this.props;

    if (onHide) {
      onHide(this.state.input);
    }

    if (animate) {
      Animated.timing(
        this.state.top, {
          toValue: INITIAL_TOP,
          duration: animationDuration
        }
      ).start();
      setTimeout(() => {
        this._doHide();
      }, animationDuration);
    } else {
      this.setState({ top: new Animated.Value(INITIAL_TOP) });
      this._doHide();
    }
  }

  _doHide = () => {
    const { clearOnHide } = this.props;

    this.setState({ show: false });
    if (clearOnHide) {
      this.setState({ input: '' });
    }
  }

  _onChangeText = (input) => {
    const { handleChangeText, handleSearch, handleResults } = this.props;

    this.setState({ input });
    if (handleChangeText) {
      handleChangeText(input);
    }

    if (handleSearch) {
      handleSearch(input);
    } else {
      _.debounce(() => {
        // use internal search logic (depth first)!
        if (handleResults) {
          const results = this._internalSearch(input);
          handleResults(results);
        }
      }, 500)();
    }
  }

  _internalSearch = (input) => {
    const { data, allDataOnEmptySearch } = this.props;

    if (input === '') {
      return allDataOnEmptySearch ? data : [];
    }

    return _.filter(data, (item) => this._depthFirstSearch(item, input));
  }

  _depthFirstSearch = (collection, input) => {
    // let's get recursive boi
    let type = typeof collection;
    // base case(s)
    if (type === 'string' || type === 'number' || type === 'boolean') {
      return _.includes(collection.toString().toLowerCase(), input.toString().toLowerCase());
    }
    return _.some(collection, (item) => this._depthFirstSearch(item, input));
  }

  _clearInput = () => {
    this.setState({ input: '' });
    this._onChangeText('');
  }

  _getImageUri(src) {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  }

  _showSearchButton = () => {
    return (
      this.state.input === '' ?
        <TouchableWithoutFeedback>
          <Image style={{ width: 18, height: 18 }} source={this._getImageUri('search.png')} />
        </TouchableWithoutFeedback>
        :
        <TouchableWithoutFeedback onPress={this._clearInput}>
          <Image style={{ width: 18, height: 18 }} source={this._getImageUri('cancel.png')} />
        </TouchableWithoutFeedback>
    );
  }

  render() {
    const {
      hideBack,
      textColor,
      fontFamily,
      placeholder,
      autoCorrect,
      heightAdjust,
      focusOnLayout,
      autoCapitalize,
      onSubmitEditing,
      backgroundColor,
      placeholderTextColor
    } = this.props;

    return (
      <Animated.View>
        {
          this.state.show &&
          <View style={styles.navWrapper}>
            <TextInput
              returnKeyType='search'
              value={this.state.input}
              placeholder={placeholder}
              autoCorrect={autoCorrect}
              autoCapitalize={autoCapitalize}
              underlineColorAndroid='transparent'
              ref={(ref) => this.textInput = ref}
              placeholderTextColor={placeholderTextColor}
              onChangeText={(input) => this._onChangeText(input)}
              onLayout={() => focusOnLayout && this.textInput.focus()}
              onSubmitEditing={() => onSubmitEditing ? onSubmitEditing() : null}
              style={styles.input}
            />
            {this._showSearchButton()}
          </View>
        }
      </Animated.View>
    );
  }

}

export default Search;
