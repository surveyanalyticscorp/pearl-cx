import React from 'react';
import moment from 'moment';
import {StyleSheet, View} from 'react-native';
import {ExclaimationIcon} from '../../../../routes/commonUI/CommonUI';
import {Colors} from '../../../../styles/color.constants';
import TextLabel from '../../../../widgets/TextLabel/TextLabel';
import {DMY_AT_TIME__SHORT_FORMAT} from '../../../../Utils/AppConstants';
import {PaddingConstants} from '../../../../styles/padding.constants';

const OverdueBar = ({overdueDate}) => {
  const date = moment(overdueDate).format(DMY_AT_TIME__SHORT_FORMAT);
  return (
    <View style={styles.overdueContainer}>
      <ExclaimationIcon
        size={16}
        color={Colors.white}
        style={styles.rowContainer}
        endComponent={
          <TextLabel
            text={`Ticket overdue`}
            color={Colors.white}
            style={styles.overdueText}
          />
        }
      />
      <TextLabel text={date} color={Colors.white} style={styles.overdueText} />
    </View>
  );
};

const styles = StyleSheet.create({
  overdueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PaddingConstants.tab1,
    borderTopStartRadius: 4,
    borderTopEndRadius: 4,
    backgroundColor: Colors.overdueAlertColor,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
  },
  overdueText: {
    paddingHorizontal: PaddingConstants.halfTab,
  },
});

export default OverdueBar;
