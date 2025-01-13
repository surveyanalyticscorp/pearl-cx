import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {translate} from '../../../../Utils/MultilinguaUtils';
import QPButton from '../../../../widgets/Button';
import {buttonStyles} from '../../../../styles/button.styles';
import {baseTextStyles} from '../../../../styles/text.styles';
import {Colors} from '../../../../styles/color.constants';

export const ViewResponseDetailsButton = () => {
  const responseDetails = useSelector(
    state => state.response.responseDetailsByResponseDetails,
  );
  const {authToken} = useSelector(state => state.global);
  const navigation = useNavigation();
  const navigateToFeedbackDetails = () => {
    navigation.navigate(translate('responses.feedback_details'), {
      data: responseDetails,
      isFromFeedback: false,
      ticketStatus: {},
      token: authToken,
      // parentRoute: translate('responses.responses'),
    });
  };
  return (
    <View style={[styles.rowContainer]}>
      <QPButton
        testID="responseButtonTest"
        style={buttonStyles.textButton}
        onPress={navigateToFeedbackDetails}
        buttonText={`${translate('close_loop.view_response')}`}
        textStyle={[
          baseTextStyles.secondaryRegularText,
          {color: Colors.accentLight},
        ]}
      />
    </View>
  );
};

export default ViewResponseDetailsButton;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
