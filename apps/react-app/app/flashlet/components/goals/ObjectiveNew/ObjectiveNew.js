import React, { Component } from 'react';
import { View, TextInput, Dimensions } from 'react-native';

import * as _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './Style';
import AppStore from '../../../../index/AppStore';
import { trimSpaces } from '../../../utils/stringPrototype';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';

const { height } = Dimensions.get('window');

class ObjectiveNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: props.edit ? props.row.objective : '',
      editGoal: props.edit ? true : false,
      row: props.row
    };
  }

  componentWillMount() {
    AppStore.DoneButtonStore.addDoneButtonListener(this.doneButtonAction.bind(this));
  }

  componentDidMount() {
    if (this.state.editGoal) {
      this.refs['objectiveInput'].focus();
      this._setHeaderTitleWithButton();
    }
  }

  doneButtonAction() {
    this._onSubmitGoal();
  }

  componentWillUnmount() {
    if (global.titleAndMenuStack.length > 0) {
      for (let i in global.titleAndMenuStack) global.titleAndMenuStack.pop();
    }

    AppStore.DoneButtonStore.removeDoneButtonListener(this.doneButtonAction);
  }

  _getInputHeight() {
    let percentage = 50;
    if (height > 568) {
      percentage = 45;
    }

    return height - height * percentage / 100 - 15;
  }

  _updateHeaderButton() {
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({
        title: 'Objectives and Goals',
        showMenu: true,
        showStat: true
      })
    );
  }

  _setHeaderTitleWithButton() {
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({
        title: this.state.editGoal ? 'Edit Goal & Objective' : 'Add New Goal & Objective',
        image: 'arrowRightWhite',
        isStatic: true
      })
    );
  }

  _setHeaderTitleWithoutButton() {
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({
        title: this.state.editGoal ? 'Edit Goal & Objective' : 'Add New Goal & Objective'
      })
    );
  }

  _setInputHeight() {
    this.refs['objectiveInput'].setNativeProps({
      height: this._getInputHeight()
    });
  }

  _updateGoalsNObjectives() {
    const { row, description } = this.state;
    let goalsnobjectives = this.props.goalsnobjectives;
    let selectedGoalNObjective = _.find(
      goalsnobjectives,
      goalnobjective => goalnobjective.quarter === row.quarter && goalnobjective.year === row.year
    );

    if (selectedGoalNObjective && selectedGoalNObjective.goals) {
      let objectives = selectedGoalNObjective.goals;
      const selectedObjectiveIndex = _.findIndex(objectives, objective => objective.id === row.id);

      if (selectedObjectiveIndex !== -1) {
        let selectedObjective = objectives[selectedObjectiveIndex];
        objectives[selectedObjectiveIndex] = Object.assign({}, selectedObjective, {
          objective: description
        });
      }

      this.props.updateGoalsNObjevtives(goalsnobjectives);
    }
  }

  _onSubmitGoal() {
    const description = this.state.description;

    if (trimSpaces(description).length > 0) {
      if (this.state.editGoal) {
        this._updateGoalsNObjectives();

        let editedRow = Object.assign({}, this.state.row, {
          objective: this.state.description
        });

        ActionBarModule.updateTitleAndMenu(
          JSON.stringify({
            title: ' ',
            showMenu: true,
            showStat: false
          })
        );
        ActionBarModule.toggleBackButton(true);
        this.props.onAfterEdit(editedRow);
      } else {
        this.props.onAddDescription(description);
        this._updateHeaderButton();
      }
    } else {
      setTimeout(() => {
        this.setState({ description: '' });
      }, 1);
    }
  }

  _checkEmpty(text) {
    this.setState({ description: text });
    if (trimSpaces(text).length > 0) {
      this._setHeaderTitleWithButton();
    } else {
      this._setHeaderTitleWithoutButton();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView ref="kascroll">
          <View style={styles.inputContainer}>
            <TextInput
              multiline
              autoFocus={true}
              autoCorrect={false}
              ref="objectiveInput"
              style={styles.input}
              value={this.state.description}
              placeholder={'Enter Goal...'}
              onChangeText={text => this._checkEmpty(text)}
              onFocus={() => {
                this._setInputHeight();
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default ObjectiveNew;
