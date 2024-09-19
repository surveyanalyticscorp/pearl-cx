import React from 'react';
import {View, TouchableWithoutFeedback, Text, StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import moment from 'moment';
import {FullMonthDateYearFormat} from '../../Utils/AppConstants';
import {PriorityUI, StatusUI} from '../../routes/commonUI/CommonUI';
export default function ResponseTicketCell(props) {
  const data = props.data;

  const getTicketID = () => {
    return <Text style={styles.idText}>{`Ticket ID #${data.id}`} </Text>;
  };

  const getNPSAndTicketRow = () => {
    return <View style={styles.rowContainer} />;
  };

  const getNameANdDateRow = () => {
    const createdDate = moment(data.createdAt).format(FullMonthDateYearFormat);
    console.log('USERDATA', JSON.stringify(data));
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.userNameText}>
          {data?.panelMember?.name ?? ' '}
        </Text>
        <Text style={styles.dateText}>{` · ${createdDate ?? ' '}`}</Text>
        <View style={{flex: 1, flexDirection: 'row-reverse'}}>
          {getTicketID()}
        </View>
      </View>
    );
  };

  const getTicketDetails = () => {
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.detailsText} numberOfLines={3} ellipsizeMode="tail">
          {data.comment}
        </Text>
      </View>
    );
  };

  const getStatusRow = () => {
    return (
      <View style={styles.statusContainer}>
        <StatusUI status={data.status} />
        <PriorityUI priority={data.priority} />

        <View />
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      testID="TouchableWithoutFeedback"
      onPress={() => {
        props.onPressHandler(props.data, props.index);
      }}
      style={styles.container}>
      <View style={styles.container}>
        <View style={{backgroundColor: Colors.white}}>
          {getNPSAndTicketRow()}
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
    padding: PaddingConstants.halfTab,
    borderColor: Colors.evenDarkerGrey,
    borderWidth: 1,
    borderRadius: 5,
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
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    color: Colors.accent,
  },

  dateText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.primary,
  },

  detailsText: {
    fontFamily: FontFamily.regular,

    fontSize: TextSizes.regular,
    color: Colors.filterIconColor,
  },

  idText: {
    fontFamily: FontFamily.regular,

    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
  },
});
