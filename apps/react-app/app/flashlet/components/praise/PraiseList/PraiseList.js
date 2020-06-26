import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Easing,
  Platform,
  ListView,
  Animated,
  Dimensions,
  LayoutAnimation,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight
} from 'react-native';

import * as _ from 'lodash';

import { Actions } from 'react-native-router-flux';

import styles from './Style';
import AppStore from '../../../../index/AppStore';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';
import AnimateBadgeCount from './AnimateBadgeCount';

const moment = require('moment');
const { width, height } = Dimensions.get('window');

let selectedRowCount = 0;

const CustomLayoutLinear = {
  duration: 700,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut
  }
};

class PraiseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      praises: props.praises.length ? _.sortBy(props.praises, ['year', 'quarter']) : [],
      year: props.year ? props.year : moment().year(),
      quarter: props.quarter ? props.quarter : moment().quarter(),
      clickDirection: 'none',
      currentIndex: props.praises.length ? props.praises.length - 1 : null,
      setCurrentIndex: false,
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 0 },
      selectedRow: null,
      selected: false
    };

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.animatedValue = new Animated.Value(0);
    this.hasPressedQuarterBtn = false;
    this._showHeightAnimation = false;
    this._mount = false;
  }

  componentWillMount() {
    this.props.clearNewBadge();
    selectedRowCount = 0;
    if (!(this.props.praises.length > 0)) {
      this.props.clearUserBadges();
      this.props.fetchPraises();
    }
  }

  componentWillUnmount() {
    this._mount = false;
  }

  componentWillReceiveProps(props) {
    setTimeout(() => {
      this.setState({
        praises: _.sortBy(props.praises, ['year', 'quarter']),
        currentIndex: !this.state.setCurrentIndex ? props.praises.length - 1 : this.state.currentIndex,
        setCurrentIndex: true,
        selectedRow: null
      }, () => selectedRowCount = 0);
    }, 600);
  }

  animate() {
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.easeInOutQuad
    }).start(() => {
      LayoutAnimation.configureNext(CustomLayoutLinear);

      this.animatedValue = new Animated.Value(0);
      let direction = this.state.clickDirection;
      this.setState({
        currentIndex: direction === 'left' ? this.state.currentIndex - 1 : this.state.currentIndex + 1,
        currentType: 'active',
        setCurrentIndex: true
      });
      this.hasPressedQuarterBtn = false;
    });
  }

  loading() {
    return <ActivityIndicator style={styles.loading} color="black" />;
  }

  showError(msg) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTxt}>{msg}</Text>
      </View>
    );
  }

  _setTextPosition(nativeEvent) {
    this.setState({
      startPoint: { x: width / 2, y: nativeEvent.layout.y + nativeEvent.layout.height + 5 },
      endPoint: { x: width - 90, y: height - 150 }
    });
  }

  noresult() {
    const emptyText = 'No Praises';
    return (
      <View style={styles.info}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  _onPressPraise(rowID, item) {
    if (selectedRowCount === 0) {
      selectedRowCount = 1;
      global.titleAndMenuStack.push(JSON.stringify({ title: 'Praise' }));

      item.year = this.state.year;
      item.quarter = this.state.quarter;
      this.setState({ selectedRow: rowID }, () =>
        setTimeout(() => {
          this.props.addNewBadge(item);
          ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: item.name }));
          Actions.praiseDetail({ item });
          ActionBarModule.toggleBackButton(true);
        }, 300)
      );
    }
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    let selected = this.state.selectedRow === rowID ? true : false;
    return (
      <TouchableHighlight
        onPress={() => this._onPressPraise(rowID, rowData)}
        underlayColor={'rgba(0, 0, 0, 0.04)'}
        style={{ marginTop: 5 }}
      >
        <View style={[styles.item, { backgroundColor: selected ? 'rgba(0, 0, 0, 0.08)' : 'white' }]}>
          <View style={styles.image}>
            <Image source={this._getImageUri(rowData.image)} style={styles.imageIcon} />
          </View>
          <View style={styles.desc}>
            <Text>{rowData.name}</Text>
            <Text style={styles.praiseDescTxt}>
              {rowData.description}
            </Text>
          </View>
          <View style={styles.badgeCount}>
            <AnimateBadgeCount
              style={styles.badgeCountTxt}
              animateRowId={rowData.id}
              count={_.isArray(rowData.praiseUsers) ? rowData.praiseUsers.length : 0}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _getImageUri(src) {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  }

  _onPressLeft() {
    if (this.hasPressedQuarterBtn) return;

    this.hasPressedQuarterBtn = true;

    if (this.state.quarter === 1) {
      this.setState(
        {
          type: 'active',
          clickDirection: 'left',
          year: this.state.year - 1,
          quarter: 4
        },
        () => this.animate()
      );
    } else {
      this.setState(
        {
          type: 'active',
          clickDirection: 'left',
          quarter: this.state.quarter - 1
        },
        () => this.animate()
      );
    }
  }

  _onPressRight() {
    if (this.hasPressedQuarterBtn) return;

    this.hasPressedQuarterBtn = true;

    if (this.state.quarter === 4) {
      this.setState(
        {
          type: 'active',
          clickDirection: 'right',
          year: this.state.year + 1,
          quarter: 1
        },
        () => this.animate()
      );
    } else {
      this.setState(
        {
          type: 'active',
          clickDirection: 'right',
          quarter: this.state.quarter + 1
        },
        () => this.animate()
      );
    }

    // setTimeout(() => {
    //   this.animate();
    // }, 50);
  }

  _canViewQuarter() {
    let canViewRight = !(this.props.praises.length - 1 === this.state.currentIndex);
    let canViewLeft = !(this.state.currentIndex === 0);
    return { canViewLeft, canViewRight };
  }

  _renderHeader() {
    const { canViewLeft, canViewRight } = this._canViewQuarter();
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          {canViewLeft && (
            <TouchableOpacity
              onPress={this._onPressLeft.bind(this)}
              hitSlop={{ top: 10, left: 100, bottom: 10, right: 20 }}
            >
              <Image style={{ width: 12, height: 12 }} source={this._getImageUri('play-button-left.png')} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerCenter}>
          <View style={{ height: 2 }} />
          <View>
            <Text>{`${this.state.year} Q${this.state.quarter}`}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {canViewRight && (
            <TouchableOpacity
              onPress={this._onPressRight.bind(this)}
              hitSlop={{ top: 10, left: 20, bottom: 10, right: 100 }}
            >
              <Image style={{ width: 12, height: 12 }} source={this._getImageUri('play-button-right.png')} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  getQuarterPraises(praises) {
    return _.find(praises, praise => praise.quarter === this.state.quarter && praise.year === this.state.year);
  }

  _renderBody(praise, index) {
    let tempInitialMargin = -width * (this.state.currentIndex - index);
    let initialMargin = tempInitialMargin === -0 ? 0 : tempInitialMargin;
    let finalMargin = this.state.clickDirection === 'left' ? initialMargin + width : initialMargin - width;

    const marginLeft = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: this.state.clickDirection === 'left' ? [initialMargin, finalMargin] : [initialMargin, finalMargin],
      extrapolate: 'clamp'
    });

    let filterPraises = praise.praises;

    return (
      <Animated.View
        key={`${index}-${this.state.type}`}
        style={{
          position: 'absolute',
          left: marginLeft,
          width: width,
          top: 0,
          height: height - 122
        }}
      >
        {!_.isEmpty(filterPraises) && (
          <ListView renderRow={this._renderRow.bind(this)} dataSource={this.ds.cloneWithRows(filterPraises)} />
        )}
        {_.isEmpty(filterPraises) && this.noresult()}
      </Animated.View>
    );
  }

  render() {
    const { isLoading, error, praises } = this.props;

    if (!praises.length) {
      return this.loading();
    }

    if (error && !praises.length) {
      return this.showError(error);
    }

    return (
      <View style={styles.container}>
        {this._renderHeader()}
        <View style={{ height: 1000 }}>{praises.map((praise, index) => this._renderBody(praise, index))}</View>
      </View>
    );
  }

}

export default PraiseList;
