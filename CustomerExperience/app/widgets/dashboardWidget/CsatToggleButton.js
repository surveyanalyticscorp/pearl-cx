import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
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
    <Pressable
      style={styles.csatToggleButtonView}
      testID="csat-toggle-button"
      onPress={toggleView}>
      <View style={styles.switchContainer}>
        <TextLabel
          text={'Top Box'}
          baseTextStyle={styles.csatToggleButtonText}
        />
        <View style={styles.switchWrapper}>
          <Switch
            trackColor={{
              false: Colors.white,
              true: Colors.white,
            }}
            thumbColor={Colors.accentLight}
            onValueChange={toggleView}
            value={isCsatViewTopBox}
            style={styles.customSwitch}
          />
        </View>
        <TextLabel
          text={'Mean CSAT'}
          baseTextStyle={styles.csatToggleButtonText}
        />
        <Text testID="csat-toggle-button-text" style={styles.csatToggleButtonLabel}>
          {label}
        </Text>
      </View>
    </Pressable>
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
  switchWrapper: {
    borderWidth: 1,
    borderColor: Colors.accentLight,
    borderRadius: 16,
    marginHorizontal: MarginConstants.tab1,
    justifyContent: 'center',
    height: 16 + PaddingConstants.halfTab * 2,
    width: 32 + PaddingConstants.halfTab * 2,
    padding: PaddingConstants.halfTab,
    alignItems: 'center',
    overflow: 'hidden',
  },
  customSwitch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
  csatToggleButtonLabel: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,
  },
});
