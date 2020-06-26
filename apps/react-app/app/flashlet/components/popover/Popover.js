import React, { Component } from 'react';
import {
  View,
  Modal,
  Dimensions,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';

import styles from './styles';

import Swiper from '../swiper/Swiper';

const { width, height } = Dimensions.get('window');

class PopoverModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placement: '',
      contentSize: {},
      anchorPoint: {},
      popoverOrigin: {},
      isTransitioning: false,
      scale: new Animated.Value(0)
    };

    this._arrowSize = props.arrowSize || { width: 30, height: 15 };
    this._showArrow = false;
  }

  render() {
    if (!this.props.visible && this.state.isTransitioning) {
      return null;
    }

    let { popoverOrigin, contentSize } = this.state;

    let arrowColorStyle = { borderTopColor: this.props.arrowColor || '#ccccc' };
    let arrowDynamicStyle = this._getArrowDynamicStyle();
    let arrowStyle = [styles.arrow, arrowDynamicStyle, arrowColorStyle];

    let innerArrowStyle = {};

    if (this.props.showInnerArrow && this._showArrow) {
      let innerArrowColorStyle = {
        borderTopColor: this.props.innerArrowColor || '#eaeaea'
      };
      let innerArrowDynamicStyle = this._getInnerArrowStyle();

      innerArrowStyle = [
        styles.arrow,
        innerArrowDynamicStyle,
        innerArrowColorStyle
      ];
    }

    let height =
      -(contentSize && contentSize.height) +
      popoverOrigin.y +
      arrowDynamicStyle.top;

    if (isNaN(height)) {
      height = 0
    }

    return (
      <Modal
        animationType={'none'}
        transparent={true}
        visible={this.props.visible}
      >
        <View style={styles.container}>
          <Swiper
            data={this.props.swipeData}
            style={styles.background}
            factor={this.props.swipeFactor}
            onSwipe={this.props.onSwipe}
            onRelease={this.props.onRelease}
            minDataLimit={this.props.minDataLimit}
            maxDataLimit={this.props.maxDataLimit}
            isSwipeEnabled={this.props.isSwipeEnabled}
          >
            <TouchableWithoutFeedback onPressIn={this.props.onBgPress}>
              <View style={[styles.background]} />
            </TouchableWithoutFeedback>

            <View
              ref={node => (this._view = node)}
              onLayout={this._measureContent}
              style={[{ top: height }, this.props.containerStyle]}
            >
              {this.props.children}
            </View>
          </Swiper>

          {this.props.showInnerArrow &&
            this._showArrow && (
              <View
                style={[
                  styles.popover,
                  { top: popoverOrigin.y, left: popoverOrigin.x }
                ]}
              >
                <View style={arrowStyle} />
                <View style={innerArrowStyle} />
              </View>
            )}
        </View>
      </Modal>
    );
  }

  /**
   * Computes arrow style.
   *
   * @returns {object}
   */
  _getArrowDynamicStyle = () => {
    let { anchorPoint, popoverOrigin } = this.state;
    let width = this._arrowSize.width + 2;
    let height = this._arrowSize.height * 2 + 2;

    return {
      left: anchorPoint.x - popoverOrigin.x - width / 2,
      top: anchorPoint.y - popoverOrigin.y - height / 2 + this._yOffset,
      width: width,
      height: height,
      borderTopWidth: height / 2,
      borderRightWidth: width / 2,
      borderBottomWidth: height / 2,
      borderLeftWidth: width / 2
    };
  };

  /**
   * Computes innerArrow style to show border like effect.
   *
   * @returns {object}
   */
  _getInnerArrowStyle = () => {
    let { borderWidth } = this.props;
    let { anchorPoint, popoverOrigin } = this.state;

    let width = this._arrowSize.width + 2;
    let height = this._arrowSize.height * 2 + 2;

    return {
      left: anchorPoint.x - popoverOrigin.x + borderWidth - width / 2,
      top:
        anchorPoint.y -
        popoverOrigin.y -
        borderWidth -
        height / 2 +
        this._yOffset,
      width: width - 4,
      height: height,
      borderTopWidth: height / 2 - borderWidth,
      borderRightWidth: width / 2 - borderWidth,
      borderBottomWidth: height / 2 - borderWidth,
      borderLeftWidth: width / 2 - borderWidth
    };
  };

  /**
   * Callback fired upon layout to measure dimensions.
   *
   * @param {object} nativeEvent
   */
  _measureContent = ({ nativeEvent }) => {
    this._yOffset = this.props.yOffset || 0;
    let { x, y, width, height } = nativeEvent.layout;
    this._contentSize = { x, y: y + this._yOffset, width, height };
    let geom = this._computeGeometry();

    this.setState(
      Object.assign(geom, { contentSize: this._contentSize }),
      () => {
        this.setState({ isTransitioning: true });
      }
    );
    this._showArrow = true;
  };

  /**
   * Computes the origin for popover view and anchor point for arrow.
   *
   * @returns {object}
   */
  _computeGeometry = () => {
    this._displayArea = this.props.dataRect || { x: 0, y: 0, width, height };
    this._fromRect = this.props.fromRect;

    let popoverOrigin = {
      x: Math.min(
        this._displayArea.x + this._displayArea.width - this._contentSize.width,
        Math.max(
          this._displayArea.x,
          this._fromRect.x +
            (this._fromRect.width - this._contentSize.width) / 2
        )
      ),
      y:
        this._fromRect.y -
        this._contentSize.height -
        this._arrowSize.height +
        this._yOffset
    };

    let anchorPoint = {
      x: this._fromRect.x + this._fromRect.width / 2.0,
      y: this._fromRect.y + this._yOffset
    };

    return {
      popoverOrigin,
      anchorPoint,
      placement: 'top'
    };
  };
}

export default PopoverModal;
