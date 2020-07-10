import React, {Component} from 'react';
import {View} from 'react-native';
import Proptypes from 'prop-types';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {reduxifyNavigator} from 'react-navigation-redux-helpers';
import {AppNavigator} from './routes/index.router';


const App1 = reduxifyNavigator(AppNavigator, "root");


const mapStateToProps = state => {
  return {
    state: state.nav,
  };
};

const AppWithNavigationState = connect(mapStateToProps)(App1);

const mapDispatchToProps = dispatch => ({
  dispatch,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styleBuilt: false,
    };
  }

  componentDidMount() {
    EStyleSheet.subscribe('build', () => {
      this.setState({styleBuilt: true});
    });
  }

  render() {
    const {userPreferences} = this.props;

    if (this.state.styleBuilt) {
      return <AppWithNavigationState screenProps={userPreferences} />;
    }
    return <View />;
  }
}

App.propTypes = {
  dispatch: Proptypes.func,
  nav: Proptypes.object,
  error: Proptypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
