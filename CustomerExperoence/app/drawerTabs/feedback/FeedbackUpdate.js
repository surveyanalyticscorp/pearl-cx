import React, {useState, useEffect} from 'react';
import Toast from 'react-native-simple-toast';
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
const {width} = Dimensions.get('window');
const sliderItemWidth = width / 3;
import {CommonActions} from '@react-navigation/native';
import {updateFeedback, cleanUpdateFeedBack} from '../../actions';
const FeedbackUpdate = props => {
  const [comment, setComment] = useState('');
  let ticketStatuses = ArrayUtils.removeMatchingObjectAndReturnNewArray(
    props.route.params.ticketStatus,
    'id',
    -1,
  );
  const [value, setValue] = useState(
    props.route.params.data.ticketStatus > 0
      ? ticketStatuses
          .map(function(e) {
            return e.id;
          })
          .indexOf(props.route.params.data.ticketStatus)
      : 0,
  );

  useEffect(() => {
    if (props.feedback.body) {
      if (props.feedback.body.Success) {
        Toast.show(props.feedback.body.Success);
        let timer = setTimeout(() => {
          const popAction = CommonActions.goBack();
          props.navigation.dispatch(popAction);
          props.cleanUpdateFeedback();
        }, 1000);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [props.feedback, props.navigation]);

  const buildFeedbackUpdateObject = () => {
    let selectedFeedback = props.route.params.data;
    return {
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
    } else {
      console.log('Please enter comment to update the ticket.');
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
            minimumTrackTintColor="#eeeeee"
            maximumTrackTintColor="#eeeeee"
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
      </View>
    </TouchableWithoutFeedback>
  );
};

const mapStateToProps = state => {
  return {
    feedback: state.feedback.updateResponse,
  };
};

const mapDispatchToProps = dispatch => ({
  cleanUpdateFeedback: () => dispatch(cleanUpdateFeedBack()),
  updateFeedback: (data, token) => dispatch(updateFeedback(data, token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedbackUpdate);
