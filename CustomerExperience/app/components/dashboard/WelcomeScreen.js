import React, {useEffect, useState, useRef} from 'react';
// import AsyncStorage from '@react-native-community/async-storage';
import {
  // ScrollView,
  // SafeAreaView,
  StyleSheet,
  ImageBackground,
  // Image,
  Button,
  Text,
} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {View} from 'react-native-animatable';
import AppRouter from '../../routes/appRouter';
// import CreateTicket from './ticketManagement/CreateTicket';

export const WelcomeScreen = (props) => {
  let [moveNext, setMoveNext] = useState(false);
  let splashTimer = useRef(null);

  useEffect(() => {
    splashTimer = setTimeout(() => {
      setMoveNext(true);
    }, 3000);

    return () => {
      clearTimeout(splashTimer);
    };
  }, []);

  const onSkipHandler = () => {
    setMoveNext(true);
    clearTimeout(splashTimer);
  };

  const RenderWelcomeScreen = () => {
    return (
      <ImageBackground
        resizeMode={'cover'}
        source={require('../../config/images/background1.png')}
        style={styles.backgroundContainer}>
        <View style={styles.backgroundContainer}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.nameText}>Mehedi hasan</Text>

          <View style={styles.responseContainer}>
            <View style={styles.responseBox}>
              <Text style={styles.titleText}>34</Text>
              <Text style={styles.valueText}>New Responses</Text>
            </View>
          </View>
          <View style={styles.ticketAndOverdueContainer}>
            <View style={styles.ticketBox}>
              <Text style={styles.titleText}>5</Text>
              <Text style={styles.valueText}>New Tickets</Text>
            </View>
            <View style={styles.ticketBox}>
              <Text style={styles.titleText}>1</Text>
              <Text style={styles.valueText}>Over due</Text>
            </View>
          </View>
        </View>
        <View style={styles.skipButton}>
          <Button title="SKIP" onPress={onSkipHandler} />
        </View>
      </ImageBackground>
    );
  };

  return moveNext ? <AppRouter /> : <RenderWelcomeScreen />;
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.accent,
    width: '80%',
  },
  nameText: {
    fontSize: 26,
    fontWeight: '100',
    color: Colors.accent,
    width: '80%',
    marginBottom: 16,
  },

  titleText: {
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: Colors.accent,
    textAlign: 'center',
  },

  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
    textAlign: 'center',
  },

  responseBox: {
    flex: 1,
    alignContent: 'stretch',
    borderColor: Colors.accent,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 16,
  },

  responseContainer: {
    flexDirection: 'row',
    width: '80%',
  },
  ticketBox: {
    flex: 2,
    alignContent: 'stretch',
    borderColor: Colors.borderColor,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 16,
  },
  ticketAndOverdueContainer: {
    flexDirection: 'row',
    alignContent: 'space-around',
    justifyContent: 'center',
    width: '80%',
  },

  skipButton: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.white,
    backgroundColor: Colors.accent,
    width: '90%',
    margin: 16,
  },
});
