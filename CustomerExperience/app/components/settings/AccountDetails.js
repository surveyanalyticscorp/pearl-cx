import React, {useState, useEffect} from 'react';
// import SafeAreaView from 'react-native-safe-area-view';
import {StyleSheet, Text, View} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Sizes} from '../../styles/Size.constant';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_USER_CREDENTIALS} from '../../api/Constant';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function AccountDetails(props) {
  const [userCredentials, setUserCredentials] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(ASYNC_USER_CREDENTIALS).then(value => {
      setUserCredentials(JSON.parse(value));
    });
  }, []);

  let RenderInfoRow = ({icon, title}) => {
    return (
      <View style={styles.row}>
        <Icon name={icon} color={Colors.secondary} size={1.2 * Sizes.icons} />
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

  let RenderCard = () => {
    return (
      <View testID={'render-card'} style={styles.card}>
        <RenderInfoRow
          icon={'account'}
          title={
            props.route.params.userInfo.firstName +
            ' ' +
            props.route.params.userInfo.lastName
          }
        />
        <RenderInfoRow icon={'email'} title={userCredentials.email} />
        <RenderInfoRow
          icon={'office-building'}
          title={props.route.params.userInfo.organizationName}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      testID={'account-details'}
      forceInset={{bottom: 'never'}}
      style={styles.safeArea}>
      <View testID={'account-details-view'} style={styles.safeArea}>
        <RenderCard />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  card: {
    marginHorizontal: MarginConstants.tab2,
    marginTop: MarginConstants.tab2,
    backgroundColor: Colors.white,
    paddingVertical: PaddingConstants.tab2,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: MarginConstants.tab2,
    marginVertical: MarginConstants.tab1,
  },
  title: {
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.regular,
    color: Colors.primary,
    paddingLeft: PaddingConstants.tab2,
  },
});
