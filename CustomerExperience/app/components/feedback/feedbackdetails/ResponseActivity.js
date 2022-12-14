import React, {useState} from 'react';
import {
  // useWindowDimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  // TouchableOpacity,
} from 'react-native';
import {Colors, statusColors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
// import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import IonIcon from 'react-native-vector-icons/Ionicons';

const ResponseActivity = (props) => {
  let activityData = props.route.params.data;

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
        <Text style={styles.secondaryTitle}>Completed</Text>
        <Text style={styles.secondaryText}>{children}</Text>
      </View>
    );
  };

  const RenderSurveyDetails = () => {
    return (
      <View style={styles.innerContainer}>
        <RenderSurveySent>{'STATIC Survey sent DATE'}</RenderSurveySent>
        <View style={styles.border} />
        <RenderSurveyComplete>
          {'STATIC Survey complete DATE'}
        </RenderSurveyComplete>
      </View>
    );
  };

  const RenderStatusCell = ({item}) => {
    let borderColor = statusColors.newBorder;
    let fillerColor = statusColors.newFiller;

    switch (item.status) {
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
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            width: 14,
            height: 14,
            backgroundColor: fillerColor,
            borderColor: borderColor,
            borderRadius: 25,
            borderWidth: 1,
            margin: MarginConstants.halfTab,
          }}
        />
        <Text>{item.status}</Text>
      </View>
    );
  };

  const renderSeparator = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <IonIcon
          name="arrow-forward"
          size={14}
          color={Colors.filterIconColor}
        />
      </View>
    );
  };

  const RenderActivityDetails = () => {
    const managerName = 'DUMMY MANAGER';
    const lastUpdated = 'DUMMY COMMENT';
    const comment = 'LAST COMMENT';
    const history = [
      {
        status: 'new',
      },
      {
        status: 'open',
      },
      {
        status: 'resolved',
      },
    ];

    return (
      <View style={styles.innerContainer}>
        <View>
          <Text style={styles.mediumText}>{managerName}</Text>
          <Text style={styles.secondaryText}>{lastUpdated}</Text>
          <Text style={styles.mediumText}>{comment}</Text>
          <Text style={styles.secondaryTitle}>Status Change</Text>
          <FlatList
            style={{
              marginHorizontal: MarginConstants.tab1,
              marginBottom: MarginConstants.tab2,
            }}
            data={history}
            keyExtractor={(_, index) => index.toString()}
            renderItem={RenderStatusCell}
            onEndReachedThreshold={0}
            refreshing={false}
            horizontal={true}
            ItemSeparatorComponent={renderSeparator}
          />
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
  innerContainer: {
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
    fontWeight: 'bold',

    textAlign: 'center',
    flex: 1,
    margin: MarginConstants.halfTab,
  },
  ticketCounterTitle: {
    fontSize: TextSizes.secondary,
    fontWeight: 'bold',
    color: Colors.accentLight,
    textAlign: 'center',
    flex: 1,
    padding: PaddingConstants.halfTab,
  },
  mediumText: {
    fontSize: TextSizes.secondary,
    fontWeight: '900',
    color: Colors.lightBlack,
    margin: MarginConstants.tab1,
  },
  secondaryTitle: {
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    fontWeight: 'bold',
    margin: MarginConstants.tab1,
    paddingBottom: PaddingConstants.tab1,
  },
  secondaryText: {
    fontSize: TextSizes.semiMediumText,
    color: Colors.filterIconColor,
    fontWeight: '900',
    margin: MarginConstants.tab1,
  },
  contactBox: {
    flexDirection: 'row',
    marginVertical: MarginConstants.halfTab,

    alignItems: 'baseline',
  },

  contactText: {
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginHorizontal: MarginConstants.tab1,
  },
});
