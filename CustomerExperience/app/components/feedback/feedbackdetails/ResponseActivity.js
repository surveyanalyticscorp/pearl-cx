import React, {useState} from 'react';
import {
  // useWindowDimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
} from 'react-native';
import {Colors, statusColors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
// import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {FontWeight} from '../../../styles/font.constants';
import StringUtils from '../../../Utils/StringUtils';
import {Avatar, StatusIcon} from '../../../routes/CommonScreen';
import moment from 'moment';
import {DMY_AT_TIME_FORMAT} from '../../../Utils/AppConstants';

const ResponseActivity = props => {
  let activityData = props.route.params.data;
  const {ticketStatusHistory, ticketLastComment} = useSelector(
    state => state.response,
  );

  // console.log(`feedback: ${activityData}`);

  const RenderSurveySent = ({children}) => {
    return (
      <View style={styles.surveyDateBox}>
        <Text style={styles.secondaryTitle}>Survey Sent</Text>
        <Text style={styles.secondaryText}>{children}</Text>
      </View>
    );
  };
  const RenderSurveyComplete = ({children}) => {
    return (
      <View style={styles.surveyDateBox}>
        <Text style={styles.secondaryTitle}>Survey Completed</Text>
        <Text style={styles.secondaryText}>{children}</Text>
      </View>
    );
  };

  const RenderSurveyDetails = () => {
    return (
      <View style={[styles.innerContainer, {justifyContent: 'center'}]}>
        {/* <RenderSurveySent>{'N/A'}</RenderSurveySent>
        <View style={styles.border} /> */}
        <RenderSurveyComplete>
          {activityData.surveyTakenDate}
        </RenderSurveyComplete>
      </View>
    );
  };

  const RenderStatusCell = ({item}) => {
    let borderColor = statusColors.newBorder;
    let fillerColor = statusColors.newFiller;

    switch (item.title.toLowerCase()) {
      case 'open':
        borderColor = statusColors.openBorder;
        fillerColor = statusColors.openFiller;
        break;
      case 'closed':
        borderColor = statusColors.closedBorder;
        fillerColor = statusColors.closedFiller;
        break;
      case 'escalated':
        borderColor = statusColors.escalatedBorder;
        fillerColor = statusColors.escalatedFiller;
        break;
      case 'resolved':
        borderColor = statusColors.resolvedBorder;
        fillerColor = statusColors.resolvedFiller;
        break;
      case 'overdue':
        borderColor = statusColors.overDueBorder;
        fillerColor = statusColors.overDueFiller;
        break;
      default:
        break;
    }

    return (
      <View style={styles.statusRow}>
        <StatusIcon
          borderColor={borderColor}
          fillerColor={fillerColor}
          size={14}
        />
        <Text style={styles.statusText}>
          {StringUtils.uppercaseFirstCharRestLowercase(item.title)}
        </Text>
      </View>
    );
  };

  const renderSeparator = () => {
    return (
      <View style={styles.separator}>
        <IonIcon
          name="arrow-forward"
          size={14}
          color={Colors.filterIconColor}
        />
      </View>
    );
  };

  const CommentSection = ({commentBy, text, createdAt}) => {
    return (
      <View>
        <View style={styles.statusRow}>
          <Avatar title={commentBy} />
          <Text style={styles.secondaryTitle}>
            {(commentBy ?? 'N/A').trim()}
          </Text>
        </View>

        <Text style={styles.commentHeaderText}>
          {`Last comment: ${moment
            .utc(createdAt)
            .local()
            .format(DMY_AT_TIME_FORMAT)}`}
        </Text>
        <Text style={styles.mediumText}>{text ?? 'N/A'}</Text>
      </View>
    );
  };

  const RenderActivityDetails = () => {
    return (
      <View style={styles.innerContainer}>
        <View>
          {ticketLastComment && <CommentSection {...ticketLastComment} />}
          {ticketStatusHistory && ticketStatusHistory.length > 0 ? (
            <View>
              <Text style={styles.secondaryTitle}>Status Changes</Text>

              <FlatList
                style={{
                  marginHorizontal: MarginConstants.tab1,
                  marginBottom: MarginConstants.tab2,
                }}
                data={ticketStatusHistory}
                keyExtractor={(_, index) => index.toString()}
                renderItem={RenderStatusCell}
                onEndReachedThreshold={0}
                refreshing={false}
                horizontal={true}
                ItemSeparatorComponent={renderSeparator}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <RenderSurveyDetails />
        <RenderActivityDetails />
      </View>
    </ScrollView>
  );
};

export default ResponseActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  border: {
    backgroundColor: Colors.darkGrey,
    width: 1,
  },
  surveyDateBox: {
    flex: 1,
    padding: PaddingConstants.tab2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: MarginConstants.halfTab,
  },
  separator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    margin: MarginConstants.tab1,
  },

  counterView: {
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: 'row',
    width: '25%',
    margin: MarginConstants.tab4,
    alignItems: 'baseline',
  },
  ticketCounterView: {
    borderRadius: 2,
    borderColor: Colors.accentLight,
    borderWidth: 1,
    flexDirection: 'row',
    width: '20%',
    margin: MarginConstants.tab4,
    alignItems: 'baseline',
  },
  counterTitle: {
    fontSize: TextSizes.secondary,
    fontWeight: FontWeight.bold,

    textAlign: 'center',
    flex: 1,
    margin: MarginConstants.halfTab,
  },
  ticketCounterTitle: {
    fontSize: TextSizes.secondary,
    fontWeight: FontWeight.bold,
    color: Colors.accentLight,
    textAlign: 'center',
    flex: 1,
    padding: PaddingConstants.halfTab,
  },
  mediumText: {
    fontSize: TextSizes.secondary,
    fontWeight: FontWeight._800,
    color: Colors.lightBlack,
    margin: MarginConstants.tab1,
  },
  secondaryTitle: {
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    fontWeight: FontWeight.bold,
    margin: MarginConstants.tab1,
    paddingBottom: PaddingConstants.tab1,
  },
  secondaryText: {
    fontSize: TextSizes.semiMediumText,
    color: Colors.filterIconColor,
    fontWeight: FontWeight._500,
    marginHorizontal: MarginConstants.tab1,
    marginVertical: MarginConstants.halfTab,
  },
  statusText: {
    fontSize: TextSizes.semiMediumText,
    color: Colors.filterIconColor,
    fontWeight: FontWeight._500,
    marginHorizontal: MarginConstants.halfTab,
    marginVertical: MarginConstants.halfTab,
  },
  commentHeaderText: {
    fontSize: TextSizes.smallText,
    color: Colors.filterIconColor,
    fontWeight: FontWeight._500,
    marginHorizontal: MarginConstants.tab1,
    marginVertical: MarginConstants.halfTab,
  },
  contactBox: {
    flexDirection: 'row',
    marginVertical: MarginConstants.halfTab,

    alignItems: 'baseline',
  },

  contactText: {
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
    fontWeight: FontWeight.bold,
    textDecorationLine: 'underline',
    marginHorizontal: MarginConstants.tab1,
  },
});
