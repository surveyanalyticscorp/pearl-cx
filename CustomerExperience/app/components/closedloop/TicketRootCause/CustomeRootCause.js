import React, {useState} from 'react';
import {View, StyleSheet, FlatList, ScrollView} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import {MarginConstants} from '../../../styles/margin.constants';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import IconButton from '../../../routes/commonUI/IconButton';
import {MaterialIcons} from '../../../Utils/IconUtils';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {CentralizedRootCause} from './CentralizedRootCause';
import {useNavigation} from '@react-navigation/core';

export const EditCustomRootCause = ({onPress}) => {
  return (
    <IconButton
      buttonStyle={styles.buttonStyle}
      textStyle={styles.buttonStyleText}
      leftIcon={
        <MaterialIcons name="edit" size={20} color={Colors.accentLight} />
      }
      buttonText={'Edit'}
      onPress={onPress}
    />
  );
};
export const AddCustomRootCause = ({onPress}) => {
  return (
    <View>
      <TextLabel
        baseTextStyle={baseTextStyles.secondaryLightText}
        text={'Currently, this ticket does not have any custom root causes.'}
      />
      <VerticalSpaceBox />
      <IconButton
        buttonStyle={styles.buttonStyle}
        textStyle={styles.buttonStyleText}
        leftIcon={
          <MaterialIcons name="add" size={20} color={Colors.accentLight} />
        }
        buttonText={'Add'}
        onPress={onPress}
      />
    </View>
  );
};

export const CustomRootCauseHeader = ({children}) => {
  return (
    <View style={styles.headerContainer}>
      <TextLabel
        baseTextStyle={baseTextStyles.primaryMediumText}
        text={'Custom root causes'}
      />
      {children}
    </View>
  );
};

// export const SelectedRootCauseList = () => {
//   return <View style={styles.flatList}></View>;
// };

export const CustomRootCause = () => {
  const [hasRootCause, setHasRootCause] = useState(false);

  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('CentralizedRootCause');
    // console.log('navigateToAddCustomRootCause');
  };

  return (
    <View style={styles.rootview}>
      <CustomRootCauseHeader>
        {hasRootCause ? <EditCustomRootCause onPress={onPress} /> : null}
      </CustomRootCauseHeader>
      <VerticalSpaceBox />
      {!hasRootCause ? <AddCustomRootCause onPress={onPress} /> : null}
      <VerticalSpaceBox />
    </View>
  );
};

const styles = StyleSheet.create({
  rootview: {
    marginVertical: MarginConstants.tab1_2x,
    marginHorizontal: MarginConstants.tab1_2x,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: MarginConstants.tab1_6x,
  },

  flatList: {
    marginVertical: MarginConstants.tab1_2x,
  },
  buttonStyle: {
    width: PaddingConstants.tab1_8x,
    paddingHorizontal: PaddingConstants.tab1_2x,
    height: MarginConstants.tab1_6x,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyleText: {
    color: Colors.accentLight,
    fontSize: TextSizes.secondary2,
  },
});
