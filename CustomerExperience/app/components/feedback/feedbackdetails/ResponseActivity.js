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
import {translate} from '../../../Utils/MultilinguaUtils';
import {ShowResponseTicketList} from '../FeedbackDetails';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {baseTextStyles} from '../../../styles/text.styles';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';

const ResponseActivity = props => {
  let isFromFeedback = props.route.params.data.isFromFeedback;
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
  const RenderSurveyComplete = ({surveyTaken}) => {
    return (
      <View
        style={[
          styles.cardContainer,
          {justifyContent: 'space-between', alignItems: 'center'},
        ]}>
        <TextLabel
          text={translate('profile.survey_completed')}
          baseTextStyle={baseTextStyles.secondaryRegularText}
          color={Colors.filterIconColor}
        />
        <TextLabel
          text={surveyTaken}
          baseTextStyle={baseTextStyles.semiSecondaryRegularText}
          color={Colors.filterIconColor}
        />

        <Text style={styles.secondaryText}>{}</Text>
      </View>
    );
  };

  // const RenderSurveyDetails = ({text}) => {
  //   return (
  //     <View style={[styles.innerContainer, {justifyContent: 'center'}]}>
  //       <RenderSurveyComplete text={activityData.surveyTakenDate} />
  //     </View>
  //   );
  // };

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
          <TextLabel
            text={(commentBy ?? 'N/A').trim()}
            baseTextStyle={baseTextStyles.secondaryRegularText}
            color={Colors.filterIconColor}
            fontWeight={FontWeight.bold}
          />
        </View>
        <VerticalSpaceBox />
        <TextLabel
          text={`Last comment: ${moment
            .utc(createdAt)
            .local()
            .format(DMY_AT_TIME_FORMAT)}`}
          baseTextStyle={baseTextStyles.smallRegularText}
          color={Colors.filterIconColor}
        />
        <VerticalSpaceBox />
        <TextLabel
          text={text ?? 'N/A'}
          baseTextStyle={baseTextStyles.secondaryRegularText}
          color={Colors.filterIconColor}
        />
      </View>
    );
  };

  const RenderActivityDetails = () => {
    return (
      <View style={styles.cardContainer}>
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
      <RenderSurveyComplete surveyTaken={activityData.surveyTakenDate} />
      <RenderActivityDetails />
      <ShowResponseTicketList {...props} />
    </ScrollView>
  );
};

export default ResponseActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PaddingConstants.tab1,
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
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    padding: PaddingConstants.tab1_2x,
    marginTop: MarginConstants.tab1,
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
