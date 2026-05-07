import React from 'react';
import {
  // useWindowDimensions,
  StyleSheet,
  View,
  // FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {translate} from '../../../Utils/MultilinguaUtils';
import {ShowResponseTicketList} from '../FeedbackDetails';
import {textStyles, baseTextStyles} from '../../../styles/text.styles';
import {FontWeight} from '../../../styles/font.constants';

const ResponseProfile = props => {
  const {panelMember, surveyDetails} = useSelector(state => state.response);
  const data = props.route.params.data;
  const responseTickets = useSelector(state => state.response.responseTickets);
  console.log(`FEEDBACK_DATA_SURVEY: ${JSON.stringify(surveyDetails)}`);
  console.log(`FEEDBACK_DATA_PROFILE: ${JSON.stringify(panelMember)}`);

  const Count = ({text, backgroundColor, textColor}) => {
    return (
      <View
        style={{
          backgroundColor: backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          padding: PaddingConstants.halfTab,
        }}>
        <TextLabel
          text={text}
          color={textColor}
          style={{
            margin: 0,
          }}
        />
      </View>
    );
  };

  const SurveyCounterView = ({children}) => {
    const color = Colors.accent;
    return (
      <View style={[styles.counterView, {borderColor: color}]}>
        <TextLabel
          color={color}
          text={translate('dashboard.surveys')}
          style={styles.counterTitle}
        />

        <Count
          text={children}
          backgroundColor={color}
          textColor={Colors.white}
        />
      </View>
    );
  };

  const TicketCounterView = ({children}) => {
    const color = Colors.accentLight;
    return (
      <View style={[styles.counterView, {borderColor: color}]}>
        <TextLabel
          color={color}
          text={translate('dashboard.tickets')}
          style={styles.counterTitle}
        />

        <Count
          text={children}
          backgroundColor={color}
          textColor={Colors.white}
        />
      </View>
    );
  };

  const RenderCounter = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <SurveyCounterView>
          {panelMember?.totalSurveysResponded ?? 0}
        </SurveyCounterView>
        <TicketCounterView>
          {responseTickets?.data?.length ?? 0}
        </TicketCounterView>
      </View>
    );
  };

  const RenderPhoneNumber = () => {
    return (
      <Pressable
        testID="phone-number"
        onPress={() => {
          console.log('Phone Number');
        }}
        style={styles.contactBox}>
        <IonIcon name="call" size={12} color={Colors.filterIconColor} />
        <TextLabel
          text={panelMember.phone ?? 'N/A'}
          baseTextStyle={textStyles.secondaryTextAccentColor}
        />
      </Pressable>
    );
  };

  const RenderEmailAddress = () => {
    return (
      <Pressable
        testID="email-address"
        onPress={() => {
          console.log('Email Address');
        }}
        style={styles.contactBox}>
        <IonIcon name="mail" size={14} color={Colors.filterIconColor} />
        <TextLabel baseTextStyle={textStyles.secondaryTextAccentColor}>
          {panelMember.emailAddress ?? 'N/A'}
        </TextLabel>
      </Pressable>
    );
  };

  const RenderNameDetails = () => {
    return (
      <View
        testID="name-details"
        style={{marginVertical: MarginConstants.tab1}}>
        <TextLabel baseTextStyle={textStyles.secondaryTextBold}>
          {translate('profile.name')}
        </TextLabel>
        <TextLabel baseTextStyle={textStyles.secondaryText}>
          {panelMember.name ?? 'N/A'}
        </TextLabel>
      </View>
    );
  };

  const RenderContactDetails = () => {
    return (
      <View style={{marginVertical: MarginConstants.tab2}}>
        <TextLabel baseTextStyle={textStyles.secondaryTextBold}>
          {translate('profile.contact_information')}
        </TextLabel>
        <RenderPhoneNumber />
        <RenderEmailAddress />
      </View>
    );
  };
  const RenderDateDetails = () => {
    return (
      <View style={{marginVertical: MarginConstants.tab1}}>
        <TextLabel baseTextStyle={textStyles.secondaryTextBold}>
          {translate('profile.date')}
        </TextLabel>
        <TextLabel baseTextStyle={textStyles.secondaryText}>
          {data.surveyTakenDate ?? 'N/A'}
        </TextLabel>
      </View>
    );
  };

  const ProfileDetails = () => {
    return (
      <View style={{margin: MarginConstants.tab2}}>
        <TextLabel baseTextStyle={baseTextStyles.largeMediumText}>
          {translate('profile.profile_details')}
        </TextLabel>
        <View style={styles.border} />

        <View style={{marginHorizontal: MarginConstants.tab2}}>
          <RenderNameDetails />
          <RenderContactDetails />
          <RenderDateDetails />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <RenderCounter />
        <ProfileDetails />
        <ShowResponseTicketList {...props} />
      </View>
    </ScrollView>
  );
};

export default ResponseProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  border: {
    height: 1,
    backgroundColor: Colors.darkGrey,
    marginBottom: MarginConstants.tab1,
  },

  counterView: {
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: 'row',
    width: '25%',
    margin: MarginConstants.tab1_4x,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterTitle: {
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: PaddingConstants.halfTab,
  },
  counterText: {
    textAlign: 'center',
    padding: PaddingConstants.halfTab,
  },
  contactBox: {
    flexDirection: 'row',
    marginTop: MarginConstants.halfTab,
    paddingHorizontal: PaddingConstants.halfTab,
    alignItems: 'center',
    alignContent: 'center',
  },
});
