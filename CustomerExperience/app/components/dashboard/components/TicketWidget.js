import React,{useEffect} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Text} from 'react-native';
import ReadMore from 'react-native-read-more-text';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import StringUtils from '../../../Utils/StringUtils';
import {FontFamily} from '../../../styles/font.constants';
import moment from 'moment';
import {HalfMonthDateYearFormat, YMDFORMAT} from '../../../Utils/AppConstants';
import {getDetractorTicketDetails} from '../../../redux/actions/dashboard.actions';
import {connect} from 'react-redux';
import {isObjectEmpty} from '../../../Utils/Utility';

const TicketWidget = props => {

  let time = moment(props.item.timestamp, YMDFORMAT).format(HalfMonthDateYearFormat);

  let _renderTruncatedFooter = handlePress => {
    return (
      <Text
        style={styles.truncatedFooter}
        onPress={handlePress}>
        Read more
      </Text>
    );
  };

  let _renderRevealedFooter = handlePress => {
    return (
      <Text
        style={styles.truncatedFooter}
        onPress={handlePress}>
        Show less
      </Text>
    );
  };

  useEffect(() => {
    if(!isObjectEmpty(props.ticketDetails)) {
      props.navigation.navigate('Ticket Details',{item:props.ticketDetails});
    }
  },[props.ticketDetails]);

  let onPress = () => {
    let params = {
      'ticketID': props.item.ticketID
    };
    props.getTicketDetails(params)
  };

  let renderReadMoreView = () => {
    if (StringUtils.isNotEmpty(props.comment)) {
      return <ReadMore
          numberOfLines={3}
          renderTruncatedFooter={_renderTruncatedFooter}
          renderRevealedFooter={_renderRevealedFooter}>
        <Text style={styles.comment}>{ props.comment }</Text>
      </ReadMore>
    }
    return <Text style={styles.comment}>No comments</Text>
  };


  return (
    <TouchableWithoutFeedback
      onPress={onPress}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'}>
          {props.item.emailAddress}
        </Text>
        <Text style={styles.subtitle}>{time}</Text>
        <View style={{marginTop: MarginConstants.halfTab}}>
          {renderReadMoreView()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const mapStateToProps = state => {
  return {
    ticketDetails: state.dashboard.ticketDetails
  };
};

const mapDispatchToProps = dispatch => ({
  getTicketDetails: (params) => {
    dispatch(getDetractorTicketDetails(params))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketWidget);

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
    marginTop: MarginConstants.tab1,
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: MarginConstants.tab1,
    padding: PaddingConstants.tab1,
  },
  title: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    textAlign: 'left',
    fontFamily: FontFamily.semiBold,
  },
  subtitle: {
    fontSize: TextSizes.semiMediumText,
    marginVertical: 5,
    color: Colors.secondary,
    textAlign: 'left',
  },
  comment: {
    fontSize: TextSizes.semiSecondary+1,
    color: Colors.primary,
    textAlign: 'left',
    marginTop: PaddingConstants.tab1
  },
  truncatedFooter: {
    color: Colors.accent,
    marginTop: 2*MarginConstants.tab1,
    fontSize: TextSizes.semiSecondary
  }
});
