import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Easing,
  ListView,
  Animated,
  Platform,
  Dimensions,
  LayoutAnimation,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight
} from 'react-native';

import * as _ from 'lodash';
import tweenState from 'react-tween-state';
import { Actions } from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';


import styles from './Style';
import AnimateStatus from './AnimateStatus';

import Swipeout from '../../swipeout/src';
import MarkerLine from '../../markerLine';
import ObjectiveNew from '../ObjectiveNew';
import AppStore from '../../../../index/AppStore';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';

const moment = require('moment');
const { width, height } = Dimensions.get('window');

const rowHeights = {};
const SwipeoutRefs = {};
const accessoryDict = {
  '0': '#D8D8D8',
  '0.5': '#FF7058',
  '1': '#90DFAA'
};
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

let openedSwiper = 0;
let selectedRowCount = 0;

class ObjectiveList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'active',
      selected: false,
      description: '',
      selectedRow: null,
      scrollEnabled: true,
      btnWidth: width / 3,
      currentType: 'active',
      clickDirection: 'none',
      setCurrentIndex: false,
      newGoal: props.isNewGoal,
      endPoint: { x: 0, y: 0 },
      startPoint: { x: 0, y: 0 },
      year: props.year ? props.year : moment().year(),
      quarter: props.quarter ? props.quarter : moment().quarter(),
      currentIndex: props.goalsnobjectives.length
        ? props.goalsnobjectives.length - 1
        : null,
      goals: props.goalsnobjectives.length
        ? _.sortBy(props.goalsnobjectives, ['year', 'quarter'])
        : []
    };

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this._animateHeight = new Animated.Value(80);
    this.animatedValue = new Animated.Value(0);
    this.selectedRowId = null;
    this.hasPressedQuarterBtn = false;
    this._showHeightAnimation = false;
  }

  componentDidMount() {
    this.props.navigationStateHandler.registerFocusHook(this);
  }

  handleNavigationSceneFocus() {
    ActionBarModule.toggleBackButton(false);
  }

  componentWillMount() {
    selectedRowCount = 0;
    this._mount = true;
    if (this.props.goalsnobjectives.length === undefined) {
      this.props.fetchGoals();
    }
    AppStore.ObjButtonStore.addObjButtonListener(
      this.objButtonAction.bind(this)
    );
    AppStore.GoalFilterStore.addGoalFilterListener(
      this.goalFilterAction.bind(this)
    );
    LayoutAnimation.easeInEaseOut();
  }

  componentWillUnmount() {
    this._mount = false;
    if (this.selectedTimeout) clearTimeout(this.selectedTimeout);
    if (this.switchTimeout) clearTimeout(this.switchTimeout);
    if (this.updateTimeout) clearTimeout(this.updateTimeout);
    this.props.navigationStateHandler.unregisterFocusHook(this);
  }

  componentWillReceiveProps(props) {
    if (
      this.state.selectedRow !== null ||
      (this.state.selectedRow !== undefined && this._mount)
    ) {
      this.selectedTimeout = setTimeout(() => {
        this.setState({ selected: false }, () => (selectedRowCount = 0));
      }, 800);
    }
    let { activeCount, archiveCount } = this.getGoalsCountByStatus();
    const objectiveCount =
      this.state.type === 'active' ? activeCount : archiveCount;

    if (objectiveCount === 0) {
      this.setState({
        goals: _.sortBy(props.goalsnobjectives, ['year', 'quarter']),
        currentIndex: !this.state.setCurrentIndex
          ? props.goalsnobjectives.length - 1
          : this.state.currentIndex,
        setCurrentIndex: true
      });
    }
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
        currentIndex:
          direction === 'left'
            ? this.state.currentIndex - 1
            : this.state.currentIndex + 1,
        currentType: 'active',
        setCurrentIndex: true
      });
      this.hasPressedQuarterBtn = false;
    });
  }

  objButtonAction() {
    let { activeCount, archiveCount } = this.getGoalsCountByStatus();
    ActionBarModule.updateObjAndGoalsContent(
      JSON.stringify({
        contextMenuContent: {
          active: activeCount,
          archived: archiveCount,
          context: 'Status',
          selected: this.state.type
        }
      })
    );
  }

  goalFilterAction(data) {
    this.setState({ type: data['filter'], currentType: data['filter'] });
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
      startPoint: {
        x: width / 2,
        y: nativeEvent.layout.y + nativeEvent.layout.height + 5
      },
      endPoint: {
        x: width - 90,
        y: height - (Platform.OS === 'ios' ? 150 : 170)
      }
    });
  }

  noresult() {
    const emptyText =
      this.state.currentType === 'active'
        ? 'Get started by creating your first goal for the quarter'
        : 'No Goals';
    return (
      <View style={styles.info}>
        <Text
          style={styles.emptyText}
          onLayout={({ nativeEvent }) => this._setTextPosition(nativeEvent)}
        >
          {emptyText}
        </Text>
        {this.state.currentType === 'active' && (
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
        )}
      </View>
    );
  }

  getGoalsCountByStatus() {
    let activeCount = 0;
    let archiveCount = 0;
    let selectedGoalNObjective = this.getQuarterGoalsNObjectives(
      this.state.goals
    );

    if (selectedGoalNObjective) {
      const objectives = selectedGoalNObjective.goals;
      if (objectives) {
        activeCount = _.filter(
          objectives,
          objective => objective.type === 'active'
        ).length;
        archiveCount = _.filter(
          objectives,
          objective => objective.type === 'archived'
        ).length;
      }
    }

    return { activeCount, archiveCount };
  }

  _onPressObjective(rowID, row) {
    this._closeSwiper();
    if (selectedRowCount === 0) {
      selectedRowCount = 1;
      global.titleAndMenuStack.push(
        JSON.stringify({ title: 'Objectives and Goals' })
      );
      row.year = this.state.year;
      row.quarter = this.state.quarter;
      this.setState(
        { selectedRow: rowID, selected: true },
        () =>
          (this.switchTimeout = setTimeout(() => {
            ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: ' ' }));
            Actions.objAndGoalDetail({ goalDetail: row });
            ActionBarModule.toggleBackButton(true);
          }, 300))
      );
    }
  }

  _getAimateHeight() {
    return this._animateHeight;
  }

  _onLayout(rowId, nativeEvent) {
    if (!rowHeights[rowId]) {
      rowHeights[rowId] = Math.round(nativeEvent.layout.height);
    }
  }

  _getImageUri(src) {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    const bgColor = rowData['status']
      ? accessoryDict[rowData['status']]
      : '#D8D8D8';

    let selected =
      this.state.selectedRow === rowID && this.state.selected ? true : false;

    return (
      <Animated.View
        key={rowData.id}
        onLayout={({ nativeEvent }) => this._onLayout(rowData.id, nativeEvent)}
        style={{
          height:
            this._showHeightAnimation && this.selectedRowId === rowData.id
              ? this._getAimateHeight()
              : null
        }}
      >
        <Swipeout
          ref={refX => {
            SwipeoutRefs[rowData.id] = refX;
          }}
          sensitivity={10}
          backgroundColor="#f5f5f5"
          right={rowData.right}
          left={rowData.left}
          buttonWidth={width / 3}
          scroll={event => this._allowScroll(event, rowData.id)}
          close={
            rowData.active || this.selectedRowId === rowData.id ? false : true
          }
          onOpen={(sectionID, rowID, direction) =>
            this._onSwipeOpen(rowData.id, sectionID, rowID, direction)
          }
          swipe={(openLeft, openRight, moveX) =>
            this._onSwipe(openLeft, openRight, moveX)
          }
          grant={() => this._onSwipeStart()}
        >
          <TouchableHighlight
            onPress={() => this._onPressObjective(rowID, rowData)}
            underlayColor={'rgba(0, 0, 0, 0.04)'}
            style={{ marginTop: 5 }}
          >
            <View
              style={[
                styles.item,
                {
                  width,
                  backgroundColor: selected ? 'rgba(0, 0, 0, 0.08)' : 'white'
                }
              ]}
            >
              <View style={styles.number}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'ProximaNova-Regular'
                  }}
                >
                  {parseInt(rowID) + 1}
                </Text>
              </View>
              <View style={styles.title}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'ProximaNova-Regular'
                  }}
                >
                  {rowData.objective}
                </Text>
              </View>
              <View>
                <AnimateStatus
                  status={rowData.status}
                  flip={rowData.edited} // false
                  style={[styles.rightIcon, { backgroundColor: bgColor }]}
                />
              </View>
            </View>
          </TouchableHighlight>
        </Swipeout>
      </Animated.View>
    );
  }

  _onSwipeStart() {
    if (openedSwiper > 0 && openedSwiper !== this.selectedRowId) {
      if (SwipeoutRefs[openedSwiper]) {
        SwipeoutRefs[openedSwiper]._close(4);
        openedSwiper = 0;
      }
    }
  }

  _onScrollList() {
    this._closeSwiper();
  }

  _closeSwiper() {
    if (openedSwiper > 0) {
      if (SwipeoutRefs[openedSwiper]) {
        SwipeoutRefs[openedSwiper]._close(5);
        openedSwiper = 0;
      }
    }
  }

  _onSwipeOpen(id, sectionID, rowID, direction) {
    this.selectedRowId = id;

    if (direction === undefined) return;
    this._direction = direction;
    openedSwiper = this.selectedRowId;
    this._updateActiveGoalsNObjevtives(id);
  }

  _onSwipe(openLeft, openRight, moveX) {
    this._swipedOpened = false;
    this._swipedClosed = false;

    if (!openLeft && !openRight) {
      if (moveX > 100) {
        if (!this._swipedOpened && SwipeoutRefs[this.selectedRowId]) {
          SwipeoutRefs[this.selectedRowId].setState(
            {
              btnWidth: width,
              btnsRightWidth: width,
              btnsLeftWidth: width
            },
            () => {
              this._swipedOpened = true;
              this._swipedClosed = false;
            }
          );
        }
      } else {
        if (!this._swipedClosed) {
          SwipeoutRefs[this.selectedRowId].setState(
            {
              btnWidth: width / 3,
              btnsRightWidth: width / 3,
              btnsLeftWidth: width / 3
            },
            () => {
              this._swipedClosed = true;
              this._swipedOpened = false;
            }
          );
        }
      }
    }

    if (openLeft || openRight) {
      if (moveX > 100) {
        if (!this._swipedOpened && SwipeoutRefs[this.selectedRowId]) {
          SwipeoutRefs[this.selectedRowId].setState(
            {
              btnWidth: width,
              btnsRightWidth: width,
              btnsLeftWidth: width,
              openedRight: false,
              openedLeft: false
            },
            () => {
              this._swipedOpened = true;
              this._swipedClosed = false;
            }
          );
        }
      } else {
        if (!this._swipedClosed) {
          SwipeoutRefs[this.selectedRowId].setState(
            {
              btnWidth: width / 3,
              btnsRightWidth: width / 3,
              btnsLeftWidth: width / 3
            },
            () => {
              this._swipedClosed = true;
              this._swipedOpened = false;
            }
          );
        }
      }
    }
  }

  _allowScroll(scrollEnabled) {
    this.setState({ scrollEnabled });

    if (scrollEnabled && this._direction && this._swipedOpened) {
      this._animateRow();
      this._swipedOpened = false;
      this._swipedClosed = false;
      this._direction = null;
    }
  }

  _updateActiveGoalsNObjevtives(id) {
    let goalsnobjectives = this.props.goalsnobjectives;
    const selectedGoalNObjective = this.getQuarterGoalsNObjectives(
      goalsnobjectives
    );

    if (selectedGoalNObjective && selectedGoalNObjective.goals) {
      let objectives = selectedGoalNObjective.goals;

      if (objectives.length > 0) {
        objectives.forEach((objective, i) => {
          objectives[i] = Object.assign({}, objectives[i], {
            active: objective.id === id
          });
        });
      }

      this.props.updateGoalsNObjevtives(goalsnobjectives);
    }
  }

  _updateGoalsNObjevtives(id) {
    let goalsnobjectives = this.state.goals;
    const selectedGoalNObjective = this.getQuarterGoalsNObjectives(
      goalsnobjectives
    );

    if (selectedGoalNObjective && selectedGoalNObjective.goals) {
      const objectives = selectedGoalNObjective.goals;
      let selectedObjectiveIndex = _.findIndex(
        objectives,
        objective => objective.id === id
      );

      if (selectedObjectiveIndex !== -1) {
        let selectedObjective = objectives[selectedObjectiveIndex];
        objectives[selectedObjectiveIndex] = Object.assign(
          {},
          selectedObjective,
          {
            type: this.state.type === 'active' ? 'archived' : 'active',
            active: false
          }
        );
      }

      this.props.updateGoalsNObjevtives(goalsnobjectives);
      Actions.refresh();
    }
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
  }

  /**
   * @todo for pagination offset calculation
   */
  _onEndReached() {
    // const limit = this.getLimit(this.total);
    // if (limit < this.total) {
    //   this.setState({ loadMoreItems: true, limit });
    // }
    // if (limit === this.total) {
    //   this.setState({ loadMoreItems: false, limit });
    // }
  }

  /**
   *
   *  @todo for pagination loading
   */

  _renderFooter() {
    // if (!this.state.loadMoreItems) return <View />;
    // return <ActivityIndicator style={styles.loading} color="black" />;
  }

  _canViewQuarter() {
    let canViewRight = !(
      this.state.goals.length - 1 ===
      this.state.currentIndex
    );
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
          {this.state.type === 'archived' && (
            <View style={{ height: 2 }}>
              <Text style={styles.headerArchive}>Archived</Text>
            </View>
          )}
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

  _addNewGoal() {
    LayoutAnimation.easeInEaseOut();

    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({ title: 'Add New Goal & Objective' })
    );
    ActionBarModule.toggleBackButton(false);

    // this.setState({ newGoal: true });
    this.props.addNewGoal(true);
  }

  getQuarterGoalsNObjectives(goalsnobjectives) {
    return _.find(
      goalsnobjectives,
      goalnobjective =>
        goalnobjective.quarter === this.state.quarter &&
        goalnobjective.year === this.state.year
    );
  }

  filterGoalsByStatus(goals, index) {
    const currentIndex = this.state.currentIndex;
    const currentType = this.state.currentType;
    const filterType = currentIndex === index ? currentType : this.state.type;

    return _.filter(goals, goal => goal.type === filterType);
  }

  _onPressBtn() {
    if (SwipeoutRefs[this.selectedRowId]) {
      SwipeoutRefs[this.selectedRowId].setState(
        {
          btnWidth: width,
          btnsRightWidth: width,
          btnsLeftWidth: width,
          openedRight: false,
          openedLeft: false
        },
        () => {
          const contentPos = this._direction === 'right' ? -width : width;
          // SwipeoutRefs[this.selectedRowId]._tweenContent('contentPos', contentPos);

          SwipeoutRefs[this.selectedRowId].tweenState('contentPos', {
            easing: tweenState.easingTypes.easeInOutQuad,
            duration: 160,
            endValue: contentPos,
            onEnd: () => {
              this._animateRow();
            }
          });
        }
      );
    }
  }

  _animateRow() {
    this._showHeightAnimation = true;
    const rowHeight =
      (rowHeights[this.selectedRowId] && rowHeights[this.selectedRowId]) > 0
        ? rowHeights[this.selectedRowId]
        : 80;
    this._animateHeight.setValue(rowHeight);

    this.setState(
      {
        animateHeight: this._animateHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [rowHeight, 0],
          extrapolate: 'clamp'
        })
      },
      () => {
        Animated.timing(this._animateHeight, {
          toValue: 1,
          duration: 700
        }).start(() => {
          this._animateHeight = new Animated.Value(80);
          this._updateGoalsNObjevtives(this.selectedRowId);
          this.selectedRowId = null;
          this._showHeightAnimation = false;
        });
      }
    );
  }

  _getGoalStatusView(type) {
    let buttonTitle = type === 'active' ? 'Archive' : 'Active';
    let buttonIcon = type === 'active' ? 'archived.png' : 'active.png';

    return (
      <TouchableOpacity
        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        onPress={this._onPressBtn.bind(this)}
      >
        <View style={[styles.archiveButtonContentWrapper]}>
          <Text style={styles.archiveButtonText}>{buttonTitle}</Text>
          <Image
            source={this._getImageUri(buttonIcon)}
            style={{
              width: Platform.OS === 'android' ? 20 : 22,
              height: Platform.OS === 'android' ? 20 : 22
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }

  _getSwipeButtons() {
    const defaultBtns = [];
    const type = this.state.type;
    const backgroundColor = type === 'active' ? '#003366' : 'green';
    for (let i = 0; i < 1; i++) {
      defaultBtns.push({
        component: (
          <View style={styles.archiveButtonContainer}>
            <View style={styles.extraView} />
            <View style={[styles.archiveButtonContent, { backgroundColor }]}>
              {i === 0 ? this._getGoalStatusView(type) : null}
            </View>
          </View>
        )
      });
    }
    return defaultBtns;
  }

  _onAddDescription(description) {
    LayoutAnimation.easeInEaseOut();

    let goalsnobjectives = this.state.goals || [];
    let selectedGoalNObjective =
      _.isArray(goalsnobjectives) &&
      goalsnobjectives.length > 0 &&
      this.getQuarterGoalsNObjectives(goalsnobjectives);

    if (selectedGoalNObjective) {
      selectedGoalNObjective.goals.push({
        id: moment().unix(),
        objective: description,
        type: 'active',
        active: false
      });
    } else {
      const newGoalNObjective = {
        id: moment().unix(),
        name: `Q${this.state.quarter}-${this.state.year}`,
        type: 'quarterly',
        quarter: this.state.quarter,
        year: this.state.year
      };

      if (!newGoalNObjective.goals) {
        newGoalNObjective.goals = [];
        newGoalNObjective.goals.push({
          id: moment().unix(),
          objective: description,
          type: 'active',
          active: false
        });
      }

      goalsnobjectives.push(newGoalNObjective);
    }

    this.updateTimeout = setTimeout(() => {
      this.props.updateGoalsNObjevtives(goalsnobjectives);
    }, 1);
    //this.setState({ newGoal: false });
    this.props.addNewGoal(false);
  }

  _renderBody(goal, index) {
    let tempInitialMargin = -width * (this.state.currentIndex - index);
    let initialMargin = tempInitialMargin === -0 ? 0 : tempInitialMargin;
    let finalMargin =
      this.state.clickDirection === 'left'
        ? initialMargin + width
        : initialMargin - width;

    const marginLeft = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange:
        this.state.clickDirection === 'left'
          ? [initialMargin, finalMargin]
          : [initialMargin, finalMargin],
      extrapolate: 'clamp'
    });
    let filterGoalsNObjectives = this.filterGoalsByStatus(goal.goals, index);

    if (filterGoalsNObjectives && filterGoalsNObjectives.length > 0) {
      filterGoalsNObjectives.forEach((item, i) => {
        let filterGoalNObjective = filterGoalsNObjectives[i];
        const defaultBtns = this._getSwipeButtons();

        filterGoalsNObjectives[i] = Object.assign({}, filterGoalNObjective, {
          right: defaultBtns,
          left: defaultBtns
        });
      });
    }

    return (
      <Animated.View
        key={`${index}-${this.state.type}`}
        style={{
          flex: 1,
          position: 'absolute',
          left: marginLeft,
          width: width,
          top: 0,
          height: height - 122
        }}
      >
        {!_.isEmpty(filterGoalsNObjectives) && (
          <ListView
            scrollEnabled={this.state.scrollEnabled}
            onScroll={this._onScrollList.bind(this)}
            renderRow={this._renderRow.bind(this)}
            onEndReached={this._onEndReached.bind(this)}
            renderFooter={this._renderFooter.bind(this)}
            dataSource={this.ds.cloneWithRows(filterGoalsNObjectives)}
            style={{ flex: 1 }}
          />
        )}
        {_.isEmpty(filterGoalsNObjectives) && this.noresult()}
      </Animated.View>
    );
  }

  render() {
    const { isLoading, error, newGoal, goalsnobjectives } = this.props;

    if (!_.isArray(goalsnobjectives) || !goalsnobjectives.length) {
      return this.loading();
    }

    if (newGoal && newGoal.add) {
      return (
        <ObjectiveNew
          onAddDescription={description => this._onAddDescription(description)}
        />
      );
    }

    if (error && !this.state.goals.length) {
      return this.showError(error);
    }

    return (
      <View style={styles.container}>
        {this._renderHeader()}
        <View style={{ height: 1000 }}>
          {this.state.goals.map((goal, index) => this._renderBody(goal, index))}
        </View>
        {this.state.type === 'active' &&
          (
            <TouchableHighlight
              style={styles.customAddIcon}
              onPress={this._addNewGoal.bind(this)}
            >
              <View>
                <Image style={{ width: 22, height: 22 }} source={this._getImageUri('plus-sign-to-add.png')} />
              </View>
            </TouchableHighlight>
          )}
      </View>
    );
  }
}

export default ObjectiveList;
