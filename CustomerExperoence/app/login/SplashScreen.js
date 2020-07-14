import {Text, View} from 'react-native';
import {styles} from '../styles/styles';
import React, {useEffect, useState} from 'react';
import AppRouter from '../routes/appRouter';
const SplashScreen = props => {
  const [navigateTotheScreen, setNavigateToTheScreen] = useState(false);
  useEffect(() => {
    let timer1 = setTimeout(() => {
      setNavigateToTheScreen(true);
    }, 2000);
    return () => {
      clearTimeout(timer1);
    };
  }, [props.navigation]);

  let renderSplashScreenView = () => {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Splash screen</Text>
      </View>
    );
  };

  let renderAppScreens = () => {
    return <AppRouter />;
  };

  return navigateTotheScreen ? renderAppScreens() : renderSplashScreenView();
};

export default SplashScreen;
