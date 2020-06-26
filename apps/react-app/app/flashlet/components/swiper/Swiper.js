import React, { Component } from 'react';
import { View, PanResponder } from 'react-native';

class Swiper extends Component {
  constructor() {
    super();

    this._data = 0;
    this._sign = 1; // increase or decrease value
    this._rate = 0; // rate of increment/decrement
    this._factor = 1; // incremental factor for each swipe gesture
    this._maxWidth = 0; // Max width of the responder view
    this._velocityX = 0; // velocity of swipe
    this._previousDx = 0; // total distance covered since swipe started
    this._previousDy = 0;
    this._vx = 0;
    this._vy = 0;
  }

  render() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.props.isSwipeEnabled,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        this.props.isSwipeEnabled && gestureState.dx !== 0,
      onPanResponderMove: this._handleSwipe,
      onPanResponderRelease: this._handleRelease
    });

    this._data = this.props.data;
    this._factor = this.props.factor;

    this._data = this.props.data;

    return (
      <View
        {...this._panResponder.panHandlers}
        {...this.props}
        onLayout={this._onLayout}
      >
        {this.props.children}
      </View>
    );
  }

  /**
   * Handle when the responder(user input) is moving.
   *
   * @param {object} event
   * @param {object} gestureState
   */
  _handleSwipe = (event, gestureState) => {
    this._sign = 1;
    this._vx = gestureState.vx;
    this._vy = gestureState.vy;

    if (this._vx < 0 || this._vy > 0) {
      this._sign = -1;
    }

    // TODO: What would be the appropriate rate of increment/decrement?
    this._rate = this._factor * this._sign / 10;

    // Check whether the swiping gesture is within the bounds of the responding view.
    // if (!(event.nativeEvent.locationX > this._maxWidth || event.nativeEvent.locationX < 0)) {

    // Difference of dx of a constant number triggers the change.
    if (
      Math.abs(gestureState.dx - this._previousDx) > 2 ||
      Math.abs(gestureState.dy - this._previousDy) > 2
    ) {
      this._data += this._rate;

      this._data =
        this.props.minDataLimit && this._data <= this.props.minDataLimit
          ? this.props.minDataLimit
          : this._data;
      this._data =
        this.props.maxDataLimit && this._data >= this.props.maxDataLimit
          ? this.props.maxDataLimit
          : this._data;

      this._previousDx = gestureState.dx;
      this._previousDy = gestureState.dy;
      this.props.onSwipe(this._data, this._sign);
    }
  };

  /**
   * Handle when the responder(user input) is released.
   *
   * @param {object} event
   * @param {object} gestureState
   */
  _handleRelease = (event, gestureState) => {
    const hasSwiperMoved =
      Math.abs(this._previousDx) > 0 || Math.abs(this._previousDy) > 0
        ? true
        : false;

    this._sign = 1;
    this._rate = 0;
    this._previousDx = 0;
    this._previousDy = 0;

    this._vx = gestureState.vx;
    this._vy = gestureState.vy;
    this.props.onRelease(hasSwiperMoved);
  };

  /**
   * Called when the view is mounted and whenever the layout changes.
   *
   * @param {object} event
   */
  _onLayout = event => {
    this._maxWidth = event.nativeEvent.layout.width;
  };
}

export default Swiper;
