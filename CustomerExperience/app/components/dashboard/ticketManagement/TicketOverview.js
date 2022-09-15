import React, {useEffect, useState} from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import moment from 'moment';
import {FontFamily} from '../../../styles/font.constants';
import StringUtils from '../../../Utils/StringUtils';
import {Sizes} from '../../../styles/Size.constant';
import Icomoon from '../../../config/Icons/icon-native';
import {
  clearDetractorTicketDetails,
  getDetractorTicketDetails,
} from '../../../redux/actions/dashboard.actions';
import {connect} from 'react-redux';
import QPSpinner from '../../../widgets/QPSpinner';
import {isObjectEmpty, showErrorFlashMessage} from '../../../Utils/Utility';
import {DMYFORMAT, YMDFORMAT} from '../../../Utils/AppConstants';
import {apiHandler} from '../../../api/ApiHandler';
import ArrayUtils from '../../../Utils/ArrayUtils';
import {translate} from '../../../Utils/MultilinguaUtils';

function TicketOverview(props) {
  let [showLoader, setShowLoader] = useState(false);
  let [responseData, setResponseData] = useState([]);
  let [ticketStatus, setTicketStatus] = useState([]);

  let onBackPress = () => {
    props.clearTicketDetails();
  };

  useEffect(() => {
    let params = {
      ticketID: props.route.params.ticketID,
    };
    props.getTicketDetails(props.authToken, params);
    props.navigation
      .dangerouslyGetParent()
      .setParams({onBackPress: onBackPress});
  }, []);

  let getIconName = (nps) => {
    switch (true) {
      case nps <= 6:
        return 'smiley1';
      case nps < 9:
        return 'smiley3';
      case nps <= 10:
        return 'smiley5';
      default:
        return '';
    }
  };

  let getPriorityColor = () => {
    switch (props.ticketDetails.priority) {
      case 0:
        return Colors.promoter;
      case 1:
        return Colors.passive;
      case 2:
        return Colors.high;
      case 3:
        return Colors.critical;
    }
  };

  let getPriority = () => {
    switch (props.ticketDetails.priority) {
      case 0:
        return translate('close_loop.low');
      case 1:
        return translate('close_loop.medium');
      case 2:
        return translate('close_loop.high');
      case 3:
        return translate('close_loop.critical');
    }
  };

  let getStatus = () => {
    switch (props.ticketDetails.status) {
      case 0:
        return translate('dashboard.new');
      case 1:
        return translate('dashboard.open');
      case 2:
        return translate('dashboard.resolved');
      case 5:
        return translate('dashboard.escalated');
    }
  };

  let renderNPS = () => {
    let ticket = props.ticketDetails;
    if (!isObjectEmpty(ticket)) {
      let iconName = getIconName(parseInt(ticket.rating));
      return (
        <View
          style={[
            styles.responseIdContainer,
            {paddingHorizontal: PaddingConstants.tab1},
          ]}>
          <Text style={styles.rowText}> NPS: </Text>
          {StringUtils.isNotEmpty(iconName) && (
            <Icomoon
              name={iconName}
              size={Sizes.inlineIcons}
              color={Colors.secondary}
              style={{marginHorizontal: MarginConstants.tab1}}
            />
          )}
          <Text style={styles.npsText}>{ticket.rating}</Text>
        </View>
      );
    }
    return null;
  };

  let renderTicketPriority = () => {
    if (!isObjectEmpty(props.ticketDetails)) {
      let priority = getPriority();
      return (
        <View
          style={[
            styles.responseIdContainer,
            {paddingHorizontal: PaddingConstants.tab1},
          ]}>
          <Text style={styles.rowText}>
            {' '}
            {translate('close_loop.priority')}{' '}
          </Text>
          <View
            style={[
              styles.ticketStatusView,
              {backgroundColor: getPriorityColor()},
            ]}>
            <Text
              style={[
                styles.ticketStatusText,
                {color: priority === 'Medium' ? Colors.primary : Colors.white},
              ]}>
              {priority}
            </Text>
          </View>
        </View>
      );
    }
  };

  let renderRow = (header, value) => {
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}> {header} </Text>
        <Text style={styles.rowValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    if (ArrayUtils.isNotEmpty(responseData)) {
      moveToResponseViewer();
    }
  }, [responseData]);

  const moveToResponseViewer = () => {
    props.navigation.navigate(translate('responses.feedback_details'), {
      data: responseData[0],
      ticketStatus: ticketStatus,
      token: props.authToken,
      parentRoute: 'Dashboard',
    });
  };

  let getFeedbackData = () => {
    const data = {
      pageOffset: '0',
      sentiment: 'All',
      startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
      endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT),
      searchText: props.ticketDetails.responseID + '',
    };
    apiHandler.getFeedbackResponseList(
      props.authToken,
      data,
      (response) => {
        if (
          response.body &&
          response.body.allResponses &&
          ArrayUtils.isNotEmpty(response.body.allResponses)
        ) {
          setTicketStatus(response.body.cxTicketStatusValues);
          setResponseData(response.body.allResponses);
        }
        setShowLoader(false);
      },
      (error) => {
        showLoader && setShowLoader(false);
        showErrorFlashMessage(error.message);
      },
    );
  };

  let renderResponseIdView = () => {
    if (!isObjectEmpty(props.ticketDetails)) {
      let flag =
        props.ticketDetails.responseID > 0 &&
        props.route.params.parentRoute !== 'Responses';
      return (
        <View style={styles.responseIdContainer}>
          {renderRow(
            translate('close_loop.response_id'),
            props.ticketDetails.responseID,
          )}
          {flag && (
            <TouchableWithoutFeedback
              onPress={() => {
                setShowLoader(true);
                getFeedbackData();
              }}>
              <View style={styles.viewResponseContainer}>
                <Text style={styles.viewResponseText}>
                  {translate('close_loop.view_response')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      );
    }
    return null;
  };

  let renderCustomerComment = () => {
    if (!isObjectEmpty(props.ticketDetails)) {
      return (
        <Text style={styles.commentContainer}>
          <Text style={styles.rowText}>
            {translate('close_loop.customer_comments')}
          </Text>
          <Text style={styles.rowValue}> {props.ticketDetails.comment}</Text>
        </Text>
      );
    }
    return null;
  };

  let renderTicketInfoView = () => {
    if (!isObjectEmpty(props.ticketDetails)) {
      let date = moment(props.ticketDetails.timestamp).format('MMM DD, YYYY');
      return (
        <View style={styles.container}>
          {renderResponseIdView()}
          {renderTicketPriority()}
          {renderRow(translate('close_loop.status'), getStatus())}
          {renderRow(
            translate('close_loop.customer_email'),
            props.ticketDetails.emailAddress,
          )}
          {renderNPS()}
          {renderRow(
            translate('close_loop.origin_segment'),
            props.ticketDetails.originSegment.name,
          )}
          {renderRow(
            translate('close_loop.current_segment'),
            props.ticketDetails.currentSegment.name,
          )}
          {renderRow(
            translate('close_loop.ticket_owner'),
            props.ticketDetails.ticketOwner,
          )}
          {renderRow(translate('close_loop.created_on'), date)}
          {renderCustomerComment()}
          {showLoader && renderSpinner()}
        </View>
      );
    }
    return null;
  };

  let renderSpinner = () => {
    return (
      <View style={styles.loading}>
        <QPSpinner />
      </View>
    );
  };

  return (
    <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.safeArea}>
          {props.isLoading ? renderSpinner() : renderTicketInfoView()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => {
  return {
    ticketDetails: state.dashboard.ticketDetails,
    authToken: state.global.authToken,
    isLoading: state.global.isLoading,
    range: state.global.range,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getTicketDetails: (token, params) => {
    dispatch(getDetractorTicketDetails(token, params));
  },
  clearTicketDetails: () => {
    dispatch(clearDetractorTicketDetails());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketOverview);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkerGrey,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.darkerGrey,
  },
  container: {
    margin: MarginConstants.tab1,
    backgroundColor: Colors.white,
  },
  responseIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: MarginConstants.tab1,
  },
  viewResponseContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: PaddingConstants.tab1,
  },
  viewResponseText: {
    color: Colors.accent,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
  },
  ticketStatusView: {
    width: 2 * MarginConstants.tab4,
    paddingVertical: 2,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: MarginConstants.tab1,
  },
  ticketStatusText: {
    color: Colors.white,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  npsText: {
    color: Colors.secondary,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PaddingConstants.tab1,
    marginVertical: MarginConstants.halfTab,
  },
  rowText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
  },
  rowValue: {
    color: Colors.secondary,
    fontSize: TextSizes.secondary,
    marginHorizontal: MarginConstants.tab1,
    paddingRight: PaddingConstants.halfTab,
  },
  commentContainer: {
    margin: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.halfTab,
    marginBottom: MarginConstants.tab2,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
