import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  ListView,
  Dimensions,
  LayoutAnimation,
  ActivityIndicator,
  TouchableHighlight
} from 'react-native';
import ActionButton from 'react-native-action-button';
import { Actions } from 'react-native-router-flux';
import * as _ from 'lodash';

import PraiseNew from '../PraiseNew';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';

import styles from './Style';
import AnimateBadgeCount from './AnimateBadgeCount';
import AnimateBadgeGiven from './AnimateBadgeGivenContainer';
import MarkerLine from '../../markerLine';

const { width, height } = Dimensions.get('window');

let badgeGivenUsers = {};

class PraiseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.reviewEmployeeList,
      badge: null,
      newBadge: false,
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 0 },
      headerContentHeight: 200,
      showFabIcon: true
    };

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentWillMount() {
    if (!(this.props.users.length > 0)) {
      this.props.fetchEmployeeList().then(() => {
      });
    }
    this.setState({ showFabIcon: this._showFabIcon(this.props) });
  }

  componentWillUnmount() {
    Actions.refresh();

    ActionBarModule.toggleBackButton(false);
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({
        title: 'Praise'
      })
    );
  }

  componentWillReceiveProps(props) {
    this.setState({ showFabIcon: this._showFabIcon(props) });
  }

  _showFabIcon(props) {
    const selectedBadge = props.praiseNewBadge.selectedBadge;

    if (selectedBadge) {
      const fromID = global.appUser.ID;

      let matchUser = _.find(
        props.praiseNewBadge.selectedBadge.praiseUsers,
        user => user.from === fromID
      );
      if (matchUser) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  _addNewBadge() {
    LayoutAnimation.easeInEaseOut();

    global.titleAndMenuStack.push(
      JSON.stringify({ title: this.props.item.name })
    );

    this.props.addNewBadge(this.props.item);
    ActionBarModule.toggleBackButton(true);
    ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: 'Praise' }));

    Actions.praiseUsers();
    //this.setState({ newBadge: true });
  }

  _getBorderColor(item) {
    return {
      borderColor: badgeGivenUsers[item.id] ? 'green' : 'black'
    };
  }

  _getUserBadgeCount(userId) {
    let badgeCount = 0;
    const { userBadges, item } = this.props;

    if (userBadges && userBadges.length > 0) {
      const selectedUser = _.find(userBadges, user => user.userid === userId);
      if (selectedUser) {
        if (selectedUser.badges && _.isArray(selectedUser.badges)) {
          const selectedBadge = _.find(
            selectedUser.badges,
            badge => badge.id === item.id
          );
          if (selectedBadge) {
            badgeCount = selectedBadge.users ? selectedBadge.users.length : 0;
          }
        }
      }
    }

    return badgeCount;
  }

  _getImage(src) {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  }

  _renderRow(item, sectionId, RowId) {
    return (
      <View>
        <View style={styles.item}>
          <Image style={styles.employeeImage} source={{ uri: item.avatar }}/>
          <View style={styles.desc}>
            <Text>{`${item.first_name} ${item.last_name}`}</Text>
            <Text style={styles.text}>{`${item.industry.department}, ${
              item.industry.role
              }`}</Text>
          </View>
          <View style={[styles.userBadgeCount, this._getBorderColor(item)]}>
            <AnimateBadgeCount
              flip={this.usersLength === parseInt(RowId) + 1}
              animateRowId={item.id}
              count={this._getUserBadgeCount(item.id)}
            />
          </View>
        </View>
        <View style={styles.bottomView}/>
      </View>
    );
  }

  loading() {
    return <ActivityIndicator style={styles.loading} color="black"/>;
  }

  showError(msg) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTxt}>{msg}</Text>
      </View>
    );
  }

  // noresult() {
  //   return (
  //     <View style={styles.info}>
  //       <Text>No Badge Found</Text>
  //     </View>
  //   );
  // }

  getQuarterPraises(praises) {
    return _.find(
      praises,
      praise =>
        praise.quarter === this.state.quarter && praise.year === this.state.year
    );
  }

  getBadgeUsers(users, praiseUsers) {
    let badgeUsers = [];
    const loginUserId = global.appUser.ID;

    if (praiseUsers.length > 0) {
      praiseUsers.forEach((user, i) => {
        if (loginUserId === user.from) {
          badgeGivenUsers[user.to] = true;
        }

        praiseUsers[i] = Object.assign({}, praiseUsers[i], {
          id: user.to
        });
      });

      badgeUsers = _.intersectionBy(users, praiseUsers, 'id');
    }

    return badgeUsers;
  }

  _setTextPosition(nativeEvent) {
    this.setState({
      startPoint: {
        x: width / 2,
        y: nativeEvent.layout.y + nativeEvent.layout.height + 5
      },
      endPoint: {
        x: width - 90,
        y:
        height -
        this.state.headerContentHeight -
        (Platform.OS === 'ios' ? 95 : 115)
      }
    });
  }

  _setHeaderContentHeight(nativeEvent) {
    this.setState({
      headerContentHeight: nativeEvent.layout.height
    });
  }

  noresult() {
    const emptyText = 'Nominate your colleague';
    return (
      <View style={styles.info}>
        <Text
          style={styles.emptyText}
          onLayout={({ nativeEvent }) =>
            setTimeout(() => this._setTextPosition(nativeEvent), 1)
          }
        >
          {emptyText}
        </Text>
        <View
          style={{
            position: 'absolute',
            top: 0,
            height: height,
            width: width,
            backgroundColor: 'transparent'
          }}
        >
          <MarkerLine
            startingPoint={this.state.startPoint}
            endingPoint={this.state.endPoint}
            width={width}
            height={height - 10}
          />
        </View>
      </View>
    );
  }

  _getImageUri(src) {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  }

  render() {
    const { item, praiseNewBadge, praises } = this.props;

    // if (praiseNewBadge && praiseNewBadge.add) {
    //   return <PraiseNew badge={this.props.item} />;
    // }

    let users = this.props.users;

    if (users.length > 0) {
      users = this.getBadgeUsers(users, item.praiseUsers);
    }

    this.usersLength = users.length > 0 ? users.length : 0;

    return (
      <View style={styles.container}>
        <View
          onLayout={({ nativeEvent }) =>
            this._setHeaderContentHeight(nativeEvent)
          }
          style={
            Platform.OS === 'android' ? styles.headerAndroid : styles.header
          }
        >
          <Image source={this._getImage(item.image)} style={styles.image}/>
          <Text style={styles.headerTitle}>{item.name}</Text>
          <Text numberOfLines={3} style={styles.headerDesc}>
            {item.description}
          </Text>
        </View>
        {users &&
        users.length > 0 &&
        (
          <View style={styles.badgeUsers}>
            <ListView
              onEndReachedThreshold={100}
              renderRow={this._renderRow.bind(this)}
              dataSource={this.ds.cloneWithRows(users)}
            />
          </View>
        )}
        {_.isEmpty(users) && this.noresult()}

        {this.state.showFabIcon &&
        (
          <TouchableHighlight
            style={styles.customAddIcon}
            onPress={this._addNewBadge.bind(this)}
          >
            <View>
            <Image style={{ width: 22, height: 22 }} source={this._getImageUri('plus-sign-to-add.png')} />
            </View>
          </TouchableHighlight>
        )}
        {praiseNewBadge.badgeAssigned && (
          <AnimateBadgeGiven
            badgeUserImage={praiseNewBadge.selectedUser.avatar}
            badgeUser={`${praiseNewBadge.selectedUser.first_name} ${
              praiseNewBadge.selectedUser.last_name
              }`}
            badgeName={praiseNewBadge.selectedBadge.name}
          />
        )}
      </View>
    );
  }
}

export default PraiseDetail;
