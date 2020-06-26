import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
  LayoutAnimation,
  TouchableWithoutFeedback
} from 'react-native';

import * as _ from 'lodash';
import Slider from 'react-native-slider';
import AppStore from '../../../../index/AppStore';
import { Actions } from 'react-native-router-flux';

import styles from './Style';
import ObjectiveNew from '../ObjectiveNew';
import AnimateToast from './AnimateToast';

import { ActionBarModule } from '../../../../global/native-modules/NativeModules';

const { width } = Dimensions.get('window');
const sliderItemWidth = width / 3;

class ObjectiveDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:
        props.goalDetail.status !== undefined ? props.goalDetail.status : 0,
      editGoal: false,
      goalDetail: props.goalDetail,
      toastVisible: false,
      selectedRow: null
    };

    this.animatedValue = new Animated.Value(0);
  }

  componentWillMount() {
    if (this.popTimeout) {
      clearTimeout(this.popTimeout);
    }
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({
        title: '',
        showMenu: true,
        showStat: false
      })
    );

    AppStore.ObjEditStore.addObjEditListener(this.contextMenuAction.bind(this));
    AppStore.ObjEditActionStore.addObjEditActionListener(
      this.editAction.bind(this)
    );
  }

  componentWillUnmount() {
    this._updateGoalsNObjectives();
    Actions.refresh();

    if (this.popTimeout) {
      clearTimeout(this.popTimeout);
    }

    AppStore.ObjEditStore.removeObjEditListener(this.contextMenuAction);
    AppStore.ObjEditActionStore.removeObjEditActionListener(this.editAction);

    ActionBarModule.toggleBackButton(false);
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({
        title: 'Objectives and Goals',
        showMenu: true,
        showStat: true
      })
    );
  }

  contextMenuAction() {
    ActionBarModule.updateObjAndGoalsContent(
      JSON.stringify({
        contextMenuContent: {
          context: 'Edit'
        }
      })
    );
  }

  editAction() {
    this._editGoal();
  }

  animate() {
    this.animatedValue.setValue(0);
    Animated.spring(this.animatedValue, {
      speed: 50,
      toValue: 1,
      velocity: 8,
      bounciness: 0
    }).start();
  }

  _editGoal() {
    LayoutAnimation.easeInEaseOut();
    ActionBarModule.toggleBackButton(true);
    this.setState({ editGoal: true });
  }

  _updateGoalsNObjectives() {
    const { goalDetail } = this.props;
    let goalsnobjectives = this.props.goalsnobjectives;
    let selectedGoalNObjective = _.find(
      goalsnobjectives,
      goalnobjective =>
        goalnobjective.quarter === goalDetail.quarter &&
        goalnobjective.year === goalDetail.year
    );

    if (selectedGoalNObjective && selectedGoalNObjective.goals) {
      let objectives = selectedGoalNObjective.goals;

      if (objectives.length > 0) {
        objectives.forEach((objective, i) => {
          let status = objective.status === undefined ? 0 : objective.status;

          objectives[i] = Object.assign({}, objectives[i], {
            edited:
              objective.id === goalDetail.id && this.state.value !== status,
            status:
              objective.id === goalDetail.id
                ? this.state.value
                : objective.status
          });
        });
      }

      this.props.updateGoalsNObjevtives(goalsnobjectives);
    }
  }

  showToast() {
    clearTimeout(this.animateStartTimeout);

    this.animateStartTimeout = setTimeout(() => {
      this.setState(
        {
          toastVisible: true
        }
        // () => {
        //   this.animate(true);
        // }
      );
    }, 500);
  }

  _onSliderChange(value) {
    this.setState({ value }, () => this.showToast());
  }

  _afterEdit = goalDetail => {
    this.setState({ editGoal: false, goalDetail });
  };

  _getImageUri(src) {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  }

  render() {
    if (this.state.editGoal) {
      const goalDetail = this.state.goalDetail;
      goalDetail.status = this.state.value;

      return (
        <ObjectiveNew
          edit={true}
          row={goalDetail}
          onAfterEdit={this._afterEdit}
        />
      );
    }

    return (
      <View style={styles.container}>
        <AnimateToast
          showToast={this.state.toastVisible}
          onAfterToastDisplay={pop => {
            if (pop) {
              global.titleAndMenuStack.pop();
              this.popTimeout = setTimeout(
                () => Actions.pop && Actions.pop(),
                500
              );
            }
          }}
        >
          <Image source={this._getImageUri('check_greenBg.png')} style={{width: 22, height: 22}}/>
          <Text style={{ color: '#000000' }}>Status Updated</Text>
        </AnimateToast>
        <View style={styles.content}>
          <ScrollView>
            <Text style={styles.goalDesc}>
              {this.state.goalDetail.objective}
            </Text>
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <View style={styles.sliderTitle}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({ value: 0 }, () => this.showToast())
              }
            >
              <View>
                <Text
                  style={[
                    styles.sliderLabelTxtNS,
                    { fontWeight: this.state.value === 0 ? 'bold' : 'normal' }
                  ]}
                >
                  Not Started
                </Text>
                {this.state.value === 0 && <View style={styles.underline} />}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({ value: 0.5 }, () => this.showToast())
              }
            >
              <View style={{ marginLeft: -15 }}>
                <Text
                  style={[
                    styles.sliderLabelTxtW,
                    { fontWeight: this.state.value === 0.5 ? 'bold' : 'normal' }
                  ]}
                >
                  Working On It
                </Text>
                {this.state.value === 0.5 && <View style={styles.underline} />}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({ value: 1 }, () => this.showToast())
              }
            >
              <View>
                <Text
                  style={[
                    styles.sliderLabelTxtN,
                    { fontWeight: this.state.value === 1 ? 'bold' : 'normal' }
                  ]}
                >
                  Nailed It
                </Text>
                {this.state.value === 1 && <View style={styles.underline} />}
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.slider}>
            <Slider
              step={0.5}
              minimumValue={0}
              maximumValue={1}
              value={this.state.value}
              minimumTrackTintColor="#eeeeee"
              maximumTrackTintColor="#eeeeee"
              thumbStyle={styles.sliderThumbStyle}
              onValueChange={value => this._onSliderChange(value)}
            />
          </View>
        </View>
        {this.state.value !== 0 && (
          <TouchableWithoutFeedback
            onPress={() => this.setState({ value: 0 }, () => this.showToast())}
          >
            <View style={[styles.sliderOverlay, { left: 0 }]} />
          </TouchableWithoutFeedback>
        )}
        {this.state.value !== 0.5 && (
          <TouchableWithoutFeedback
            onPress={() =>
              this.setState({ value: 0.5 }, () => this.showToast())
            }
          >
            <View style={[styles.sliderOverlay, { left: sliderItemWidth }]} />
          </TouchableWithoutFeedback>
        )}
        {this.state.value !== 1 && (
          <TouchableWithoutFeedback
            onPress={() => this.setState({ value: 1 }, () => this.showToast())}
          >
            <View
              style={[styles.sliderOverlay, { left: sliderItemWidth * 2 }]}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

export default ObjectiveDetails;
