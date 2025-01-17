import React from 'react';
import {StyleSheet, View, Easing} from 'react-native';
import Animated from 'react-native-reanimated';
import TextLabel from '../../../../widgets/TextLabel/TextLabel';
import {PaddingConstants} from '../../../../styles/padding.constants';
import {Colors} from '../../../../styles/color.constants';
import {MarginConstants} from '../../../../styles/margin.constants';
// A colapsible view that can be expanded or collapsed

const CollapsableView = ({title, children, isOpen = false}) => {
  return (
    <View style={styles.rootContainer}>
      <View
        style={{
          backgroundColor: Colors.accentLight,
          height: '100%',
          width: '1%',
        }}
      />

      <View style={styles.columnContainer}>{children}</View>
    </View>
  );
};

export default CollapsableView;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'row', // Ensure content doesn't spill out when collapsed
  },
  columnContainer: {
    padding: PaddingConstants.tab1_2x,
    flex: 1,
    backgroundColor: 'white',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PaddingConstants.tab1_2x,
    backgroundColor: 'white',
  },
});
