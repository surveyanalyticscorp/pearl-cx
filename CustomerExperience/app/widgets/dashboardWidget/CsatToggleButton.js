import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {toggleCsatView} from '../../redux/actions/dashboard.actions';
import TextLabel from '../TextLabel/TextLabel';
import {buttonStyles} from '../../styles/button.styles';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {baseTextStyles} from '../../styles/text.styles';
import {Switch} from 'react-native-paper';
import {PaddingConstants} from '../../styles/padding.constants';

const CsatToggleButton = () => {
  const dispatch = useDispatch();
  const {isCsatViewTopBox} = useSelector(state => state.dashboard);
  const label = isCsatViewTopBox ? 'Mean CSAT' : 'Top Box';
  const toggleView = () => {
    dispatch(toggleCsatView(!isCsatViewTopBox));
  };

  return (
    <View style={styles.csatToggleButtonView}>
      <View style={styles.switchContainer}>
        <TextLabel
          text={'Top Box'}
          baseTextStyle={styles.csatToggleButtonText}
        />
        <Switch
          trackColor={{
            false: Colors.darkGrey,
            true: Colors.darkGrey,
          }}
          thumbColor={
            isCsatViewTopBox ? Colors.accentLight : Colors.accentLight
          }
          onValueChange={toggleView}
          value={isCsatViewTopBox}
        />

        <TextLabel
          text={'Mean CSAT'}
          baseTextStyle={styles.csatToggleButtonText}
        />
      </View>
    </View>
  );
};

export default CsatToggleButton;

const styles = StyleSheet.create({
  csatToggleButtonView: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    top: MarginConstants.tab1_2x,
    zIndex: 100,
  },
  csatToggleButton: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  csatToggleButtonText: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1_2x,
    paddingVertical: PaddingConstants.halfTab,
  },
});
