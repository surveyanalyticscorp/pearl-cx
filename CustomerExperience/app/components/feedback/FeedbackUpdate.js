import React, {useState, useEffect} from 'react';
import {showMessage} from 'react-native-flash-message';

import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  Text,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import Slider from '@react-native-community/slider';
import {MarginConstants} from '../../styles/margin.constants';
import {TextSizes} from '../../styles/textsize.constants';
import ArrayUtils from '../../Utils/ArrayUtils';
import StringUtils from '../../Utils/StringUtils';
import {CommonActions} from '@react-navigation/native';
import {DotIndicator} from 'react-native-indicators';
import {clearError} from '../../redux/actions/index';
import {cleanUpdateFeedBack, updateFeedback} from '../../redux/actions/feedback.actions';
import {Colors} from '../../styles/color.constants';

const {width} = Dimensions.get('window');
const sliderItemWidth = width / 3;

const FeedbackUpdate = props => {

  const [comment, setComment] = useState('');

  let ticketStatuses =  props.route.params.ticketStatus.filter(item => item.id !== -1);
  // ArrayUtils.removeMatchingObjectAndReturnNewArray(
  //   props.route.params.ticketStatus,
  //   'id',
  //   -1,
  // );

  const [value, setValue] = useState(
      ArrayUtils.isNotEmpty(props.route.params.data.ticketStatus)
          ? ticketStatuses.map(item => item.id).indexOf(props.route.params.data.ticketStatus) : 0);

  useEffect(() => {
    if (props.isError) {
      showMessage({
        message: props.errorMessage.message,
        type: 'error',
        icon: 'auto',
      });
      let timer = setTimeout(() => {
        props.cleanError();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [props.isError]);

  useEffect(() => {
    if (props.feedback.body) {
      showMessage({
        message: 'Ticket status updated successfully.',
        type: 'success',
        icon: 'auto',
      });
      let timer = setTimeout(() => {
        const popAction = CommonActions.goBack();
        props.navigation.dispatch(popAction);
        props.cleanUpdateFeedback();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [props.feedback, props.navigation]);

  const buildFeedbackUpdateObject = () => {
    let selectedFeedback = props.route.params.data;
    return {
      //ticketID: selectedFeedback.id,
      ticketID: selectedFeedback.ticketID,
      status: ticketStatuses[value].id,
      emailAddress: selectedFeedback.emailAddress,
      comment: comment,
      storeId: selectedFeedback.businessUnitID,
      panelMemberID: selectedFeedback.panelMemberID,
      responseSetID: selectedFeedback.responseSetID,
    };
  };

  const _press = () => {
    if (StringUtils.isNotEmpty(comment)) {
      Keyboard.dismiss();
      props.updateFeedback(
          buildFeedbackUpdateObject(),
          props.route.params.token,
      );
    }
  };

  const renderTextInput = () => {
    return (
        <View>
          <TextInput
              multiline
              maxLength={500}
              underlineAndroidColor={'transparent'}
              autoFocus={true}
              autoCorrect={false}
              style={{
                padding: 6,
                fontSize: TextSizes.semiMediumText,
                height: 150,
                borderWidth: 1,
                textAlignVertical: 'top',
              }}
              value={comment}
              placeholder={'Enter Comment...'}
              onChangeText={text => {
                setComment(text);
              }}
          />
        </View>
    );
  };

  const _onSliderChange = value => {
    setValue(value);
  };

  const getStatusTextStyle = id => {
    switch (id) {
      case 0:
        return {color: 'grey'};
      case 1:
        return {color: 'orange'};
      case 2:
        return {color: 'green'};
      default:
        return {color: 'red'};
    }
  };

  const getSliderContent = () => {
    let contents = [];
    ticketStatuses.map((item, index) => {
      let id = index;
      let text = item.text;
      let style = getStatusTextStyle(index);
      contents.push(
          <View key={'status_' + id}>
            <Text
                onPress={() => {
                  _onSliderChange(id);
                }}
                style={[{fontWeight: value === id ? 'bold' : 'normal'}, style]}>
              {text}
            </Text>
            {value === index && (
                <View style={{height: 2, backgroundColor: 'rgb(29, 119, 186)'}} />
            )}
          </View>,
      );
    });
    return contents;
  };

  const getSliderContainer = () => {
    return (
        <View style={{padding: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {getSliderContent()}
          </View>
          <View>
            <Slider
                step={1}
                minimumValue={0}
                maximumValue={3}
                value={value}
                minimumTrackTintColor= {Colors.accent}
                maximumTrackTintColor= {Colors.primary}
                thumbStyle={{
                  width: 10,
                  height: 20,
                  borderRadius: 5,
                  backgroundColor: '#CCCCCC',
                }}
                onValueChange={value => _onSliderChange(value)}
            />
          </View>
          {value !== 0 && (
              <TouchableWithoutFeedback onPress={() => _onSliderChange(0)}>
                <View
                    style={[
                      {
                        top: 0,
                        height: 60,
                        position: 'absolute',
                        width: sliderItemWidth,
                      },
                      {left: 0},
                    ]}
                />
              </TouchableWithoutFeedback>
          )}
          {value !== 1 && (
              <TouchableWithoutFeedback onPress={() => _onSliderChange(1)}>
                <View
                    style={[
                      {
                        top: 0,
                        height: 60,
                        position: 'absolute',
                        width: sliderItemWidth,
                      },
                      {left: sliderItemWidth},
                    ]}
                />
              </TouchableWithoutFeedback>
          )}
          {value !== 2 && (
              <TouchableWithoutFeedback onPress={() => _onSliderChange(2)}>
                <View
                    style={[
                      {
                        top: 0,
                        height: 60,
                        position: 'absolute',
                        width: sliderItemWidth,
                      },
                      {left: sliderItemWidth * 2},
                    ]}
                />
              </TouchableWithoutFeedback>
          )}
          {value !== 3 && (
              <TouchableWithoutFeedback onPress={() => _onSliderChange(5)}>
                <View
                    style={[
                      {
                        top: 0,
                        height: 60,
                        position: 'absolute',
                        width: sliderItemWidth,
                      },
                      {left: sliderItemWidth * 3},
                    ]}
                />
              </TouchableWithoutFeedback>
          )}
        </View>
    );
  };

  const renderSubmitButton = () => {
    return (
        <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: MarginConstants.tab3,
            }}>
          <TouchableHighlight
              style={{
                backgroundColor: 'rgba(28,118,185,1)',
                paddingHorizontal: MarginConstants.tab3,
                paddingVertical: MarginConstants.tab1,
              }}
              onPress={() => {
                _press();
              }}>
            <View>
              <Text style={{color: 'white'}}>Submit</Text>
            </View>
          </TouchableHighlight>
        </View>
    );
  };

  return (
      <View style={{flex: 1}}>
        <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
          <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                margin: MarginConstants.tab1,
              }}>
            {renderTextInput()}
            {getSliderContainer()}
            {StringUtils.isNotEmpty(comment) && renderSubmitButton()}
            {props.isLoading && (
                <DotIndicator color="#2589E3" count={3} size={10} />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
  );
};

const mapStateToProps = state => {
  return {
    feedback: state.feedback.updateResponse,
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
  };
};

const mapDispatchToProps = dispatch => ({
  cleanError: () => {
    dispatch(clearError(false));
    dispatch(cleanUpdateFeedBack());
  },
  cleanUpdateFeedback: () => {
    dispatch(cleanUpdateFeedBack());
    dispatch(clearError(false));
  },
  updateFeedback: (data, token) => {
    dispatch(clearError(true));
    dispatch(updateFeedback(data, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackUpdate);
