import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import StringUtils from '../../Utils/StringUtils';
import ArrayUtils from '../../Utils/ArrayUtils';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Colors, statusColors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {Sizes} from '../../styles/Size.constant';
import moment from 'moment';
import {translate} from '../../Utils/MultilinguaUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';

export default function ClosedLoopCell(props) {
  let sampleText =
    'The manager completely botched our loan application! We were there for more than four hours trying to resolve t...';
  let [isTapped, setTapped] = useState(false);

  useEffect(() => {
    if (isTapped) {
      setTapped(false);

      props.navigation.navigate('closedLoopTicketDetails');
    }
  }, [isTapped]);

  const getTicketID = () => {
    return <Text style={styles.idText}>{'ID 9993213'} </Text>;
  };

  let getNPSIcon = (sentiment) => {
    let icon;
    switch (sentiment) {
      case 'Detractor':
        icon = require('./../../../assets/images/detractor.png');
        break;
      case 'Passive':
        icon = require('./../../../assets/images/passive.png');
        break;
      default:
        icon = require('./../../../assets/images/promoter.png');
        break;
    }

    return <Image source={icon} style={{width: 16, height: 16}} />;
  };

  let getNPSColor = (sentiment) => {
    switch (sentiment) {
      case 'Detractor':
        return Colors.detractor2;
      case 'Passive':
        return Colors.passive2;
      default:
        return Colors.promoter2;
    }
  };

  let getNPSScore = (score, sentiment) => {
    let textColor = getNPSColor(sentiment);
    return (
      <Text
        style={{
          marginHorizontal: 12,
          fontSize: 16,
          fontWeight: 'bold',
          color: textColor,
        }}>
        {score}
      </Text>
    );
  };

  const getNPSAndTicketRow = () => {
    return (
      <View style={styles.rowContainer}>
        <View style={[{flex: 2}, styles.rowContainer]}>
          {getNPSIcon('Detractor')}
          {getNPSScore('2', 'Detractor')}
        </View>
        <View
          style={[{flex: 2, justifyContent: 'flex-end'}, styles.rowContainer]}>
          {getTicketID()}
        </View>
      </View>
    );
  };

  const getNameANdDateRow = () => {
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.userNameText}>Jessica Parker</Text>
        <Text style={styles.dateText}> · May 15, 2022</Text>
      </View>
    );
  };

  const getTicketDetails = () => {
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.detailsText} numberOfLines={3} ellipsizeMode="tail">
          {sampleText}
        </Text>
      </View>
    );
  };

  const getStatusUI = () => {
    return (
      <View style={styles.rowContainer}>
        <View
          style={{
            width: 20,
            height: 20,

            borderRadius: 50,
            borderColor: statusColors.escalatedBorder,
            borderWidth: 1,
            backgroundColor: statusColors.escalatedFiller,
          }}
        />
        <Text style={[{marginHorizontal: 4}, styles.statusText]}>
          Escalated
        </Text>
      </View>
    );
  };

  const getPriorityUI = () => {
    return (
      <View style={styles.rowContainer}>
        <IonIcons name="flag" size={20} color={Colors.passive2} />
        <Text style={[{marginStart: 4}, styles.detailsText]}>Normal</Text>
      </View>
    );
  };

  const getUserPic = () => {
    return (
      <View>
        <Image
          style={{height: 24, width: 24, borderRadius: 50}}
          source={{
            uri: 'https://reactnative.dev/img/tiny_logo.png',
          }}
        />
      </View>
    );
  };

  const getStatusRow = () => {
    return (
      <View style={styles.statusContainer}>
        {getStatusUI()}
        {getPriorityUI()}
        {getUserPic()}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.onPressHandler();
      }}
      style={styles.container}>
      <View style={styles.container}>
        <View style={{backgroundColor: Colors.white}}>
          {getNPSAndTicketRow()}
          {/* {getTicketID()} */}
          {getNameANdDateRow()}
          {getTicketDetails()}
        </View>
        <View>{getStatusRow()}</View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: MarginConstants.tab1,
    borderColor: Colors.evenDarkerGrey,
    borderWidth: 1,
    borderRadius: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PaddingConstants.tab1,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PaddingConstants.tab1,
  },
  userNameText: {
    fontFamily: FontFamily.bold,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.accent,
  },

  dateText: {
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    fontSize: 16,
    color: Colors.primary,
  },

  detailsText: {
    fontFamily: FontFamily.regular,
    fontWeight: '900',
    fontSize: 16,
    color: Colors.lightBlack,
  },

  idText: {
    fontFamily: FontFamily.regular,
    fontWeight: '900',
    fontSize: 16,
    color: Colors.accentLight,
  },

  statusText: {
    fontFamily: FontFamily.regular,
    fontWeight: '900',
    fontSize: 16,
    color: Colors.lightBlack,
  },
});
