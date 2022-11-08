import React, {
  useState, // {useEffect, useState}
} from 'react';
import {
  View,
  // TouchableWithoutFeedback,
  // TouchableOpacity,
  Text,
  // Image,
  StyleSheet,
  // ScrollView,
  // Platform,
  FlatList,
  // SafeAreaView,
  // TextInput,
  // LogBox,
} from 'react-native';
// import StringUtils from '../../Utils/StringUtils';
// import ArrayUtils from '../../Utils/ArrayUtils';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  Colors,
  // statusColors
} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {useSelector} from 'react-redux';
// import {Sizes} from '../../styles/Size.constant';
// import moment from 'moment';
// import {translate} from '../../Utils/MultilinguaUtils';
// import IonIcons from 'react-native-vector-icons/Ionicons';
// import QPButton from '../../widgets/Button';
// import ModalDropdown from '../../widgets/drop-down/ModalDropdown';
// import {backgroundColor} from '../../widgets/qp-calendar/style';
// import style from '../../widgets/qp-calendar/calendar/header/style';
// import {color} from 'react-native-reanimated';

export default function TicketActivity(props) {
  const [ticketActivityList, setTicketActivityList] = useState(
    useSelector((state) => state.dashboard.ticketActivity),
  );
  // const userId = 23;
  // const sampleData = [
  //   {
  //     id: 1,
  //     userId: 2,
  //     userName: 'X Manager',
  //     date: '20, July',
  //     activity: 'updated the ticket status to Open',
  //   },
  //   {
  //     id: 2,
  //     userId: 23,
  //     userName: 'Mehedi Hasan',
  //     date: '24, July',
  //     activity: 'updated the ticket priority to Escalated',
  //   },

  //   {
  //     id: 3,
  //     userId: 3,
  //     userName: 'Y Manager',
  //     date: '29, July',
  //     activity: 'updated the ticket priority to Resolved',
  //   },

  //   // {id: 2, title: 'Bakun'},
  // ];

  const ShowFlatlistOrNoActivityText = () => {
    return ticketActivityList.length ? <ShowFlatList /> : <ShowNoActivity />;
  };

  const ShowFlatList = () => {
    return (
      <FlatList
        style={styles.container}
        data={ticketActivityList}
        renderItem={getRenderItem}
        keyExtractor={(item) => item.id}
      />
    );
  };

  const getRenderItem = ({item}) => {
    // return userId === item.userId ? renderMyItem({item}) : renderItem({item});

    return renderItem({item});
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.renderItemStyle}>
        <Text style={styles.userName}> </Text>
        <Text style={styles.activity}>{item.activityText}</Text>
        <Text style={styles.date}> </Text>
      </View>
    );
  };

  const renderMyItem = ({item}) => {
    return (
      <View style={styles.myRenderItemStyle}>
        <Text style={styles.userName}>{'You'}</Text>
        <Text style={styles.activity}> {item.activity} </Text>
        <Text style={styles.date}> {item.date}</Text>
      </View>
    );
  };

  const ShowNoActivity = () => {
    return (
      <View style={{flex: 1, margin: MarginConstants.tab3}}>
        <Text
          style={{
            fontFamily: FontFamily.medium,
            color: Colors.filterIconColor,
            fontSize: TextSizes.primary,
          }}>
          No Activity...
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ShowFlatlistOrNoActivityText />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  renderItemStyle: {
    flex: 1,
    flexDirection: 'row',
    margin: MarginConstants.tab1,
    justifyContent: 'space-between',
    padding: PaddingConstants.halfTab,
  },
  myRenderItemStyle: {
    flex: 1,
    flexDirection: 'row',
    margin: MarginConstants.tab1,
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: PaddingConstants.halfTab,
  },
  userName: {
    color: Colors.filterIconColor,
    fontWeight: 'bold',
    marginHorizontal: MarginConstants.halfTab,
  },
  activity: {color: Colors.filterIconColor, fontWeight: 'normal', flex: 1},
  date: {
    color: Colors.filterIconColor,
    fontWeight: 'normal',
    marginHorizontal: MarginConstants.halfTab,
  },
});
