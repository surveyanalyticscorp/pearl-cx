import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const CompanyCode = ({navigation}) => {
  return (
    <View>
      <Text>Company Code </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignInScreen')}
        style={[
          styles.signIn,
          {
            borderColor: '#009387',
            borderWidth: 1,
            marginTop: 15,
          },
        ]}>
        <Text
          style={[
            styles.textSign,
            {
              color: '#009387',
            },
          ]}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompanyCode;

const styles = StyleSheet.create({
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
