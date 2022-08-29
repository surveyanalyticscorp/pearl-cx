import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import StringUtils from '../../../Utils/StringUtils';
import ModalDropdown from '../../../widgets/drop-down/ModalDropdown';
import ArrayUtils from '../../../Utils/ArrayUtils';
import QPSpinner from '../../../widgets/QPSpinner';
import {
  addTicket,
  clearDetractorTicketDetails,
  getClosedLoopOwnerDetails,
  getClosedLoopSegmentDetails,
} from '../../../redux/actions/dashboard.actions';
import {connect} from 'react-redux';
import {addClosedLoopTicket} from '../../../redux/sagas/ClosedLoopSaga';
import {showErrorFlashMessage, validateEmail} from '../../../Utils/Utility';
import {StackActions} from '@react-navigation/native';
import {wantToReloadDashboard} from '../../../redux/actions';
import {translate} from '../../../Utils/MultilinguaUtils';

function CreateTicket(props) {
  let priorityOptions = [
    translate('dashboard.low'),
    translate('dashboard.medium'),
    translate('dashboard.high'),
    translate('dashboard.critical'),
  ];
  let statusOptions = [
    translate('dashboard.new'),
    translate('dashboard.open'),
    translate('dashboard.resolved'),
  ];

  let [email, setEmail] = useState('');
  let [comment, setComment] = useState('');
  let [priority, setPriority] = useState(priorityOptions[0]);
  let [status, setStatus] = useState(statusOptions[0]);
  let [segmentOptions, setSegmentOptions] = useState([]);
  let [segment, setSegment] = useState('');
  let [ownerOptions, setOwnerOptions] = useState([]);
  let [owner, setOwner] = useState('');
  let [validationError, setValidationError] = useState('');
  let [isLoading, setLoading] = useState(false);
  let [callOwnerAPI, setCallOwnerAPI] = useState(false);

  let fetchClosedLoopSegments = () => {
    let statusId = statusOptions.findIndex((item) => item === status);
    let params = {
      statusID: statusId,
    };
    props.getClosedLoopSegments(props.authToken, params);
  };

  let fetchTicketOwners = () => {
    if (
      StringUtils.isNotEmpty(segment) &&
      ArrayUtils.isNotEmpty(segmentOptions)
    ) {
      let selectedSegment = segmentOptions.find(
        (item) => item.segmentName === segment,
      );
      let selectedSegmentId = selectedSegment.segmentID;
      let params = {
        segmentID: selectedSegmentId,
      };
      props.getClosedLoopOwners(props.authToken, params);
    }
  };

  useEffect(() => {
    fetchClosedLoopSegments();
  }, []);

  useEffect(() => {
    if (props.segments) {
      setSegmentOptions(props.segments);
    }
  }, [props.segments]);

  useEffect(() => {
    fetchTicketOwners();
  }, [segmentOptions]);

  useEffect(() => {
    if (props.owners) {
      setOwnerOptions(props.owners);
    }
  }, [props.owners]);

  useEffect(() => {
    fetchClosedLoopSegments();
  }, [status]);

  useEffect(() => {
    if (callOwnerAPI) {
      fetchTicketOwners();
      setCallOwnerAPI(false);
    }
  }, [segment]);

  let renderCustomerEmail = () => {
    return (
      <View>
        <Text style={styles.emailHeaderText}>
          {' '}
          {translate('close_loop.customer_email').slice(0, -1)}{' '}
        </Text>
        <TextInput
          underlineAndroidColor={'transparent'}
          autoFocus={false}
          autoCorrect={false}
          style={styles.emailText}
          value={email}
          placeholder={translate('close_loop.enter_email_id')}
          // keyboardType='email-address'
          onChangeText={(text) => {
            StringUtils.isNotEmpty(validationError) && setValidationError('');
            setEmail(text);
          }}
        />
        <View style={styles.separator} />
      </View>
    );
  };

  let setDataOnSelection = (header, options, selectedIndex) => {
    StringUtils.isNotEmpty(validationError) && setValidationError('');
    switch (header) {
      case translate('close_loop.priority').slice(0, -1):
        setPriority(options[selectedIndex]);
        break;
      case translate('close_loop.status').slice(0, -1):
        setSegment('');
        setOwner('');
        setStatus(options[selectedIndex]);
        break;
      case translate('dashboard.segment'):
        setCallOwnerAPI(true);
        setSegment(options[selectedIndex]);
        setOwner('');
        break;
      case translate('close_loop.owner'):
        setOwner(options[selectedIndex]);
        break;
    }
  };

  let renderValidationError = () => {
    return <Text style={styles.error}>{validationError}</Text>;
  };

  let renderField = (header, options, defaultText) => {
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}> {header} </Text>
        <View style={styles.dropdownContainer}>
          {renderDropDown(header, options, defaultText)}
        </View>
      </View>
    );
  };

  let getSegmentArray = () => {
    if (ArrayUtils.isNotEmpty(segmentOptions)) {
      return segmentOptions.map((item) => item.segmentName);
    }
    return [];
  };

  let getOwners = () => {
    if (ArrayUtils.isNotEmpty(ownerOptions)) {
      return ownerOptions.map((item) => item.ownerName);
    }
    return [];
  };

  let renderDropDown = (header, options, defaultText) => {
    return (
      <View>
        <ModalDropdown
          style={styles.modelDropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownStyle}
          dropdownTextStyle={styles.dropdownText}
          arrowIconColor={Colors.secondary}
          options={options}
          defaultValue={defaultText}
          renderRow={dropdownRenderRow}
          onSelect={(i) => {
            setDataOnSelection(header, options, i);
          }}
        />
      </View>
    );
  };

  let renderContainer = () => {
    let ownerDefaultText = StringUtils.isEmpty(owner) ? 'Select' : owner;
    let segmentDefaultText = StringUtils.isEmpty(segment) ? 'Select' : segment;
    return (
      <View style={styles.fieldContainer}>
        {renderField(
          translate('close_loop.priority').slice(0, -1),
          priorityOptions,
          priority || 0,
        )}
        {renderField(
          translate('close_loop.status').slice(0, -1),
          statusOptions,
          status || 0,
        )}
        {renderField(
          translate('dashboard.segment'),
          getSegmentArray(),
          segmentDefaultText,
        )}
        {renderField(
          translate('close_loop.owner'),
          getOwners(),
          ownerDefaultText,
        )}
      </View>
    );
  };

  let renderComment = () => {
    return (
      <View style={styles.commentContainer}>
        <Text style={styles.emailHeaderText}>
          {' '}
          {translate('close_loop.comment')}{' '}
        </Text>
        <TextInput
          multiline
          maxLength={500}
          underlineAndroidColor={'transparent'}
          autoFocus={false}
          autoCorrect={false}
          style={styles.commentText}
          value={comment}
          placeholder={translate('close_loop.type_a_comment')}
          onChangeText={(text) => {
            StringUtils.isNotEmpty(validationError) && setValidationError('');
            setComment(text);
          }}
        />
        <View style={styles.separator} />
      </View>
    );
  };

  let submitAction = () => {
    let statusId = 0;

    if (StringUtils.isNotEmpty(status)) {
      statusId = statusOptions.findIndex((item) => item === status);
    }

    let priorityId = priorityOptions.findIndex((item) => item === priority);
    priorityId = priorityId === -1 ? 0 : priorityId;

    if (StringUtils.isEmpty(email)) {
      setValidationError('Please enter email');
    } else if (StringUtils.isNotEmpty(email) && !validateEmail(email)) {
      setValidationError('Please enter a valid email');
    } else if (StringUtils.isEmpty(comment)) {
      setValidationError('Please enter a comment');
    } else if (StringUtils.isEmpty(segment)) {
      setValidationError('Please select the segment');
    } else {
      let selectedSegment = segmentOptions.find(
        (item) => item.segmentName === segment,
      );
      let selectedOwner = StringUtils.isNotEmpty(owner)
        ? ownerOptions.find((item) => item.ownerName === owner).ownerID
        : 0;

      let body = {
        priorityID: priorityId,
        statusID: statusId,
        managerComment: comment,
        segmentID: selectedSegment.segmentID,
        ownerID: selectedOwner,
        emailAddress: email,
        storeId: props.storeId,
      };
      submitTicketAPIAction(body);
    }
  };

  let submitTicketAPIAction = (body) => {
    setLoading(true);
    props.addTicket();

    addClosedLoopTicket(
      props.authToken,
      body,
      () => {
        setLoading(false);
        let pushAction = StackActions.replace(props.route.params.parentRoute);
        props.navigation.dispatch(pushAction);
        props.clearTicketDetails();
      },
      (error) => {
        setLoading(false);
        showErrorFlashMessage(error);
      },
    );
  };

  let renderSubmitButton = () => {
    return isLoading ? (
      <View style={styles.submitButton}>
        <QPSpinner spinnerColor={Colors.white} />
      </View>
    ) : (
      <View style={styles.submitButton}>
        <TouchableWithoutFeedback onPress={submitAction}>
          <Text style={styles.submitText}>
            {' '}
            {translate('close_loop.submit')}{' '}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={'handled'}>
        {StringUtils.isNotEmpty(validationError) && renderValidationError()}
        <KeyboardAvoidingView
          behavior="position"
          style={styles.safeArea}
          keyboardVerticalOffset={Platform.select({
            ios: -100,
            android: -200,
          })}
          enabled>
          <View style={styles.container}>
            {renderCustomerEmail()}
            {renderContainer()}
            {renderComment()}
          </View>
        </KeyboardAvoidingView>
        <View style={styles.bottomContainer}>{renderSubmitButton()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

function dropdownRenderRow(rowData, rowID, highlighted) {
  return (
    <View
      style={[
        styles.dropdownRow,
        {backgroundColor: highlighted ? Colors.overlay : Colors.white},
      ]}>
      <Text style={styles.dropdownText}>{rowData}</Text>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    authToken: state.global.authToken,
    ticket: state.dashboard.ticketDetails,
    segments: state.dashboard.segmentDetails.segments,
    owners: state.dashboard.ownerDetails.owners,
    storeId: state.dashboard.dashboardData.primaryStoreId,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getClosedLoopSegments: (token, params) => {
    dispatch(getClosedLoopSegmentDetails(token, params));
  },
  getClosedLoopOwners: (token, params) => {
    dispatch(getClosedLoopOwnerDetails(token, params));
  },
  clearTicketDetails: () => {
    dispatch(clearDetractorTicketDetails());
  },
  addTicket: () => {
    dispatch(addTicket());
    dispatch(wantToReloadDashboard(true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTicket);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: MarginConstants.tab2,
    backgroundColor: Colors.white,
  },
  emailHeaderText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    marginTop: MarginConstants.tab1,
  },
  emailText: {
    fontSize: TextSizes.secondary,
    height: 40,
    textAlignVertical: 'top',
    backgroundColor: Colors.darkerGrey,
    padding: PaddingConstants.tab1,
    marginTop: 1.2 * MarginConstants.tab1,
    color: Colors.primary,
    fontFamily: FontFamily.regular,
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.secondary,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  fieldContainer: {
    marginTop: MarginConstants.tab2,
    backgroundColor: Colors.darkerGrey,
  },
  row: {
    backgroundColor: Colors.white,
    height: 2 * PaddingConstants.tab3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    marginBottom: 1,
  },
  rowText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
  },
  modelDropdown: {
    minHeight: MarginConstants.tab3,
    justifyContent: 'flex-end',
    marginRight: MarginConstants.tab1,
    width: '50%',
  },
  dropdownText: {
    flex: 1,
    color: Colors.secondary,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.halfTab,
    fontSize: Platform.isPad
      ? TextSizes.primary
      : Platform.OS === 'android'
      ? TextSizes.primary
      : TextSizes.secondary,
    textAlign: 'left',
    paddingLeft: MarginConstants.halfTab,
    paddingRight: MarginConstants.tab3,
    textAlignVertical: 'center',
    borderColor: Colors.darkerGrey,
  },
  dropdownRow: {
    flexDirection: 'row',
    minHeight: MarginConstants.tab4,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
    backgroundColor: Colors.accent,
  },
  commentContainer: {
    backgroundColor: Colors.white,
    paddingVertical: PaddingConstants.tab2,
  },
  commentText: {
    fontSize: TextSizes.secondary,
    height: 150,
    textAlignVertical: 'top',
    backgroundColor: Colors.grey,
    padding: PaddingConstants.tab1,
    marginTop: 1.2 * MarginConstants.tab1,
    color: Colors.primary,
    fontFamily: FontFamily.regular,
  },
  submitButton: {
    height: PaddingConstants.tab4,
    marginHorizontal: MarginConstants.tab2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.accent,
  },
  submitText: {
    color: Colors.white,
    fontSize: TextSizes.primary,
    textAlign: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    fontFamily: FontFamily.semiBold,
    width: '90%',
  },
  error: {
    color: Colors.error,
    textAlign: 'center',
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.light,
    marginTop: MarginConstants.tab1,
  },
  dropdownContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
  },
});
