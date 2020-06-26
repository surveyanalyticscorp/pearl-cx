import React, { PropTypes } from 'react';
import {
  View,
  Text,
  Dimensions,
  LayoutAnimation,
  TouchableOpacity
} from 'react-native';

import styles from './styles';
import CustomText from "../ui/CustomText";

const { width } = Dimensions.get('window');

class SegmentedControl extends React.Component {

  constructor() {
    super();

    this.state = {
      selectedIndex: 0
    };
    this._tabWidth = width / 3;
  }

  componentWillMount() {
    this.setState({ selectedIndex: this.props.selectedIndex || 0 });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedIndex !== this.props.selectedIndex) {
      this.setState({ selectedIndex: nextProps.selectedIndex });
    }
  }

  /**
   * Callback when a tab is pressed.
   *
   * @param {number} index
   */
  onTabPress = (index) => {
    if (index !== this.state.selectedIndex) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ selectedIndex: index });

      this.props.onValueChange(index);
    }
  }

  /**
   * Render an individual tab.
   *
   * @param {string} value
   * @param {number} index
   * @returns {string}
   */
  renderTab = (value, index) => {
    const bottomBorderColor = index === this.state.selectedIndex ? this.props.tintColor : '#979797';
    const bottomBorderWidth = index === this.state.selectedIndex ? 2 : 0.5;
    const textColor = index === this.state.selectedIndex? this.props.tintColor : '#9C9C9C';
    return (
      <TouchableOpacity
        key={ index }
        onPress={ () => this.onTabPress(index) }
        style={[ styles.tab, { width: this._tabWidth, borderBottomColor: bottomBorderColor, borderBottomWidth: bottomBorderWidth } ]}
      >
          <CustomText style={ [styles.text,{color:textColor,fontSize: 12,}] }>{ value }</CustomText>
      </TouchableOpacity>
    );
  };

  render() {
    const { values } = this.props;
    this._tabWidth = width / values.length;

    return (
      <View style={ styles.segmentContainer }>
        {
          values.map((value, index) => this.renderTab(value, index))
        }
      </View>
    );
  };

}

// React.propTypes = {
//   style: PropTypes.object,
//   textStyle: PropTypes.object,
//   tintColor: PropTypes.string,
//   onValueChange: PropTypes.func,
//   values: PropTypes.array.isRequired,
//   selectedIndex: PropTypes.number.isRequired
// };

React.defaultProps = {
  style: {},
  textStyle: {},
  selectedIndex: 0,
  tintColor: '#000',
  onValueChange: () => {}
};

export default SegmentedControl;
