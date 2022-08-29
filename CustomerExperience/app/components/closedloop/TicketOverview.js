import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  FlatList,
} from 'react-native';
import StringUtils from '../../Utils/StringUtils';
import ArrayUtils from '../../Utils/ArrayUtils';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
  Colors,
  statusColors,
  priorityColors,
} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {Sizes} from '../../styles/Size.constant';
import moment from 'moment';
import {translate} from '../../Utils/MultilinguaUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';
import QPButton from '../../widgets/Button';
import ModalDropdown from '../../widgets/drop-down/ModalDropdown';
import IconTextModalDropdown from '../../widgets/drop-down/IconTextModalDropdown';
import {backgroundColor} from '../../widgets/qp-calendar/style';
import style from '../../widgets/qp-calendar/calendar/header/style';

export default function TicketOverview(props) {
  const statusoptions = [
    {value: 'Open', color: statusColors.openFiller},
    {value: 'Closed', color: statusColors.closedFiller},
    {value: 'Overdue', color: statusColors.overDueFiller},
    {value: 'Escalated', color: statusColors.escalatedFiller},
    {value: 'Resolved', color: statusColors.resolvedFiller},
    {value: 'New', color: statusColors.newFiller},
  ];

  const priorityOptions = [
    {value: 'Critical', color: priorityColors.critical.filler},
    {value: 'High', color: priorityColors.high.filler},
    {value: 'Normal', color: priorityColors.normal.filler},
    {value: 'Low', color: priorityColors.low.filler},
    {value: 'Unassigned', color: priorityColors.unassigned.filler},
  ];

  const userOptions = [
    {value: 'Dummy 1', url: 'https://picsum.photos/id/237/200'},
    {value: 'Dummy 2', url: 'https://picsum.photos/id/327/200'},
    {value: 'Dummy 3', url: 'https://picsum.photos/id/247/200'},
  ];
  const departmentOptions = ['Sales', 'Client Services'];

  let sampleText =
    'The manager completely botched our loan application! We were there for more than four hours trying to resolve t...';
  let [isTapped, setTapped] = useState(false);

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

  const onTakeActionHandler = () => {
    console.log('takeaction');
    props.navigation.navigate('TicketTakeAction');
  };

  const takeActionButton = () => {
    return (
      <View style={styles.takeActionContainer}>
        <QPButton
          testID="SignInButton"
          style={styles.takeActionButton}
          onPress={onTakeActionHandler}
          buttonText={'Take Action'}
          textStyle={styles.takeActionText}
        />
      </View>
    );
  };

  function dropdownRenderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={[
          styles.dropdownRow,
          {backgroundColor: highlighted ? Colors.overlay : Colors.white},
        ]}>
        {/* <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 50,
            backgroundColor: rowData.color,
          }}/> */}
        {renderImageOrColor(rowData)}
        <Text style={styles.dropdownText}>{rowData.value}</Text>
      </View>
    );
  }
  const renderImageOrColor = (data) => {
    const viewStyles = StyleSheet.create({
      color: {
        height: 20,
        width: 20,
        borderRadius: 50,
        alignSelf: 'center',
        backgroundColor: data.color ?? Colors.transparent,
      },
      image: {
        height: 20,
        width: 20,
        borderRadius: 50,
        alignSelf: 'center',
        backgroundColor: Colors.transparent,
      },
    });

    return data.hasOwnProperty('color') ? (
      <View style={viewStyles.color} />
    ) : (
      <Image
        source={{
          uri: data.url,
        }}
        style={viewStyles.image}
      />
    );
  };
  const DropDownView = (options, defaultText) => {
    return (
      <View style={[{flex: 2}, styles.rowContainer]}>
        <IconTextModalDropdown
          style={styles.modelDropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownStyle}
          dropdownTextStyle={styles.dropdownText}
          arrowIconColor={Colors.secondary}
          options={options}
          defaultValue={defaultText}
          renderRow={dropdownRenderRow}
          onSelect={(i) => {
            // setDataOnSelection(header, options, i);
          }}
        />
      </View>
    );
  };

  const DescriptionHeader = (text) => {
    return (
      <View style={[{flex: 1}, styles.rowContainer]}>
        <Text style={styles.headerText}>{text}</Text>
      </View>
    );
  };
  const Title = (text) => {
    return (
      <View style={[{flex: 1}, styles.rowContainer]}>
        <Text style={styles.titleText}>{text}</Text>
      </View>
    );
  };
  const getText = (text) => {
    return (
      <View
        style={[{flex: 2, justifyContent: 'flex-start'}, styles.rowContainer]}>
        <Text style={styles.detailsText}>{text}</Text>
      </View>
    );
  };

  const getUnderLineText = (text) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          console.log(text);
        }}>
        <View
          style={[
            {flex: 2, justifyContent: 'flex-start'},
            styles.rowContainer,
          ]}>
          <Text style={styles.underLineText}>{text}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  const departmentNameCell = ({item}) => {
    return (
      <View style={[{flex: 1}, styles.rowContainer]}>
        <Text style={styles.departmentNameText}>{item}</Text>
      </View>
    );
  };

  const ticketStatusPriorityView = () => {
    return (
      <View style={styles.ticketStatusContainer}>
        <View style={styles.rowContainer}>
          {Title('Status')}
          {DropDownView(statusoptions, 'Select status')}
        </View>
        <View style={styles.rowContainer}>
          {Title('Priority')}
          {DropDownView(priorityOptions, 'Select priority')}
        </View>
        <View style={styles.rowContainer}>
          {Title('Assigned to')}
          {DropDownView(userOptions, 'Assign manager')}
        </View>
        <View style={styles.rowContainer}>{Title('Department')}</View>
        <View style={styles.rowContainer}>
          <FlatList
            horizontal={true}
            data={departmentOptions}
            renderItem={departmentNameCell}
            keyExtractor={(item) => item}
          />
        </View>
      </View>
    );
  };

  const descriptionView = () => {
    return (
      <View style={styles.ticketStatusContainer}>
        <View style={styles.rowContainer}>
          {DescriptionHeader('Description')}
          <TouchableWithoutFeedback>
            <View
              style={{
                borderColor: Colors.accentLight,
                borderRadius: 4,
                borderWidth: 1,
                padding: PaddingConstants.halfTab,
              }}>
              <Text
                style={{
                  fontFamily: FontFamily.medium,
                  fontSize: TextSizes.primary,
                  color: Colors.accentLight,
                }}>
                ID 9033212
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.rowContainer}>
          {Title('Segment')}
          {getText('Main segment')}
        </View>
        <View style={styles.rowContainer}>
          {Title('Created')}
          {getText('22 July, 2022')}
        </View>
        <View style={styles.rowContainer}>
          {Title('NPS')}
          {getText('0')}
        </View>
        <View style={styles.columnContainer}>
          {Title('Description')}
          <Text style={{paddingHorizontal: PaddingConstants.halfTab}}>
            {sampleText}
          </Text>
        </View>
      </View>
    );
  };

  const contactView = () => {
    return (
      <View style={styles.ticketStatusContainer}>
        {DescriptionHeader('Contact')}
        <View style={styles.rowContainer}>
          <Text
            style={{
              color: Colors.accent,
              fontSize: TextSizes.largeText,
              fontWeight: 'bold',
            }}>
            Jessica Plam
          </Text>
        </View>
        <View style={styles.rowContainer}>
          {Title('Email')}
          {getUnderLineText('jessica.plam@quntica.com')}
        </View>
        <View style={styles.rowContainer}>
          {Title('Phone')}
          {getUnderLineText('+140002031')}
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {takeActionButton()}
        {ticketStatusPriorityView()}
        {descriptionView()}
        {contactView()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: MarginConstants.tab1,
    // borderColor: Colors.evenDarkerGrey,
    // borderWidth: 1,
    // borderRadius: 4,
  },

  ticketStatusContainer: {
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: PaddingConstants.tab1,
  },
  columnContainer: {
    alignItems: 'flex-start',
    padding: PaddingConstants.tab1,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PaddingConstants.tab1,
  },

  headerText: {
    fontFamily: FontFamily.regular,
    fontWeight: '500',
    fontSize: TextSizes.extraLargeText,
    color: Colors.filterIconColor,
  },

  titleText: {
    fontFamily: FontFamily.bold,
    fontWeight: 'bold',
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },

  departmentNameText: {
    backgroundColor: Colors.settingsBackground,
    padding: PaddingConstants.halfTab,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
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
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },

  underLineText: {
    fontFamily: FontFamily.regular,
    fontWeight: '900',
    fontSize: TextSizes.primary,
    color: Colors.accentLight,
    textDecorationLine: 'underline',
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
  takeActionContainer: {
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  takeActionButton: {
    height: MarginConstants.tab4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
    marginBottom: MarginConstants.tab2,
  },
  takeActionText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  rowText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
  },
  modelDropdown: {
    minHeight: MarginConstants.tab3,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    marginHorizontal: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.halfTab,
    borderColor: Colors.evenDarkerGrey,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
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
});
