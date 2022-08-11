import React from 'react';
import {
  useWindowDimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import IonIcon from 'react-native-vector-icons/Ionicons';

const ResponseProfile = (props) => {
  const profileData = props.route.params.data;

  console.log(`feedback: ${profileData}`);

  const SurveyCounterView = ({children}) => {
    const color = Colors.accent;
    return (
      <View style={[styles.counterView, {borderColor: color}]}>
        <Text style={[styles.counterTitle, {color: color}]}>Surveys</Text>
        <Text style={[styles.counterText, {backgroundColor: color}]}>
          {children}
        </Text>
      </View>
    );
  };

  const TicketCounterView = ({children}) => {
    const color = Colors.accentLight;
    return (
      <View style={[styles.counterView, {borderColor: color}]}>
        <Text style={[styles.counterTitle, {color: color}]}>Tickets</Text>
        <Text style={[styles.counterText, {backgroundColor: color}]}>
          {children}
        </Text>
      </View>
    );
  };

  const RenderCounter = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <SurveyCounterView> {profileData.surveyCount}</SurveyCounterView>
        <TicketCounterView> {profileData.ticketCount}</TicketCounterView>
      </View>
    );
  };

  const RenderPhoneNumber = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('Phone Number');
        }}
        style={styles.contactBox}>
        <IonIcon name="call" size={12} color={Colors.filterIconColor} />
        <Text style={styles.contactText}>{profileData.phone}</Text>
      </TouchableOpacity>
    );
  };

  const RenderEmailAddress = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('Email Address');
        }}
        style={styles.contactBox}>
        <IonIcon name="mail" size={14} color={Colors.filterIconColor} />
        <Text style={styles.contactText}>{profileData.email}</Text>
      </TouchableOpacity>
    );
  };

  const RenderNameDetails = () => {
    return (
      <View style={{marginVertical: MarginConstants.tab1}}>
        <Text style={styles.secondaryTitle}>Name</Text>
        <Text style={styles.secondaryText}>{profileData.name}</Text>
      </View>
    );
  };

  const RenderContactDetails = () => {
    return (
      <View style={{marginVertical: MarginConstants.tab2}}>
        <Text style={styles.secondaryTitle}>Contact Information</Text>
        <RenderPhoneNumber />
        <RenderEmailAddress />
      </View>
    );
  };
  const RenderDateDetails = () => {
    return (
      <View style={{marginVertical: MarginConstants.tab1}}>
        <Text style={styles.secondaryTitle}>Date</Text>
        <Text style={styles.secondaryText}>{profileData.date}</Text>
      </View>
    );
  };

  const ProfileDetails = () => {
    return (
      <View style={{margin: MarginConstants.tab2}}>
        <Text style={styles.profileHeader}>Profile Details</Text>
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
    padding: PaddingConstants.halfTab,
  },
  ticketCounterTitle: {
    fontSize: TextSizes.secondary,
    fontWeight: 'bold',
    color: Colors.accentLight,
    textAlign: 'center',
    flex: 1,
    padding: PaddingConstants.halfTab,
  },
  counterText: {
    fontSize: TextSizes.secondary,
    fontWeight: '900',
    color: Colors.white,
    backgroundColor: Colors.accent,
    textAlign: 'center',
    padding: PaddingConstants.halfTab,
  },
  profileHeader: {
    fontSize: TextSizes.largeText,
    fontWeight: 'bold',
    color: Colors.filterIconColor,
  },
  secondaryTitle: {
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    fontWeight: 'bold',
  },
  secondaryText: {
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    fontWeight: '900',
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
