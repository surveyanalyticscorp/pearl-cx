import React from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {CloseButton} from '../../routes/commonUI/CommonUI';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {translate} from '../../Utils/MultilinguaUtils';
export default function TakeActionScreen({onPress}) {
  const getMaterialIcon = iconName => (
    <MaterialIcon
      testID="MaterialIcon"
      name={iconName}
      size={18}
      color={Colors.lightBlack}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={[styles.headerText, {flex: 1}]}>
          {translate('ticket_overview.take_action')}
        </Text>
        <CloseButton color={Colors.filterIconColor} />
      </View>

      <Pressable
        testID="button"
        onPress={onPress}
        style={[styles.rowContainer, styles.rowItem]}>
        {getMaterialIcon('chat-bubble')}
        <Text style={styles.buttonText}>{'Forward by Email'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    margin: MarginConstants.tab1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  buttonText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  rowItem: {
    margin: MarginConstants.tab2,
    alignItems: 'center',
    padding: PaddingConstants.halfTab,
  },
});
