import React, {Component} from 'react';
import {
  Modal,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import {PaddingConstants} from '../../styles/padding.constants';
import {Colors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import DeviceInfo from 'react-native-device-info';

const {OS} = Platform;
export default class Dialog extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  renderContent() {
    const {children, contentStyle} = this.props;

    return (
      <View
        style={[
          {
            width: '100%',
            padding: PaddingConstants.tab2,
            paddingTop: PaddingConstants.tab1,
          },
          contentStyle,
        ]}>
        {children}
      </View>
    );
  }

  renderTitle() {
    const {title, titleStyle} = this.props;

    const textAlign = OS === 'ios' ? 'center' : null;

    if (title) {
      return (
        <Text
          style={[
            {
              textAlign,
              color: Colors.primary,
              fontSize: TextSizes.primary,
              margin: MarginConstants.tab2,
              marginBottom: 0,
            },
            titleStyle,
          ]}>
          {title}
        </Text>
      );
    }
  }

  renderButtons() {
    const {buttons, buttonsStyle} = this.props;
    const containerStyle =
      OS === 'ios'
        ? {}
        : {
            width: '100%',
            paddingLeft: PaddingConstants.tab1,
            paddingRight: PaddingConstants.halfTab,
            paddingVertical: PaddingConstants.halfTab,
          };

    if (buttons) {
      return <View style={[containerStyle, buttonsStyle]}>{buttons}</View>;
    }
  }

  _renderOutsideTouchable(onTouch) {
    const view = <View style={{flex: 1, width: '100%'}} />;

    if (!onTouch) {
      return view;
    }

    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{flex: 1, width: '100%'}}>
        {view}
      </TouchableWithoutFeedback>
    );
  }

  /*renderCircularTimer = () => {
    const {showCountdownTimer, inactivityTimeOut} = this.props;
    if (showCountdownTimer) {
      return (
        <View
          style={{
            alignItems: 'center',
          }}>
          <CircularTimer
            onTimeElapsed={() => {
              console.log('Timer Finished!');
            }}
            borderWidth={4}
            seconds={inactivityTimeOut}
            radius={30}
            textStyle={null}
            borderColor={'#ffffff'}
            borderBackgroundColor={'#f4c7c3'}
          />
        </View>
      );
    }
  };*/

  render() {
    const {
      dialogStyle,
      visible,
      animationType,
      onRequestClose,
      onShow,
      onOrientationChange,
      onTouchOutside,
      overlayStyle,
      supportedOrientations,
    } = this.props;

    const dialogBackgroundColor = OS === 'ios' ? '#e8e8e8' : '#ffffff';
    const dialogBorderRadius = OS === 'ios' ? PaddingConstants.halfTab : 1;

    return (
      <Modal
        animationType={animationType}
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={onShow}
        onOrientationChange={onOrientationChange}
        supportedOrientations={[
          'portrait',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}>
        <View
          style={[
            {
              flex: 1,
              backgroundColor: '#000000AA',
              padding: 24,
            },
            overlayStyle,
          ]}>
          {this._renderOutsideTouchable(onTouchOutside)}

          <View
            style={[
              {
                alignSelf: 'center',
                backgroundColor: dialogBackgroundColor,
                width: DeviceInfo.isTablet()
                  ? 10 * PaddingConstants.tab4
                  : 7 * PaddingConstants.tab4,
                shadowOpacity: 0.24,
                borderRadius: dialogBorderRadius,
                elevation: 4,
                shadowOffset: {
                  height: 4,
                  width: 2,
                },
              },
              dialogStyle,
            ]}>
            {this.renderTitle()}

            {this.renderContent()}

            {this.renderButtons()}
          </View>

          {this._renderOutsideTouchable(onTouchOutside)}
        </View>
      </Modal>
    );
  }
}

Dialog.propTypes = {
  dialogStyle: ViewPropTypes.style,
  contentStyle: ViewPropTypes.style,
  buttonsStyle: ViewPropTypes.style,
  overlayStyle: ViewPropTypes.style,
  buttons: PropTypes.element,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func,
  onShow: PropTypes.func,
  onTouchOutside: PropTypes.func,
  title: PropTypes.string,
  titleStyle: Text.propTypes.style,
  showCountdownTimer: PropTypes.bool,
  inactivityTimeOut: PropTypes.number,
};

Dialog.defaultProps = {
  visible: false,
  showCountdownTimer: false,
  inactivityTimeOut: 15,
  onRequestClose: () => null,
};
