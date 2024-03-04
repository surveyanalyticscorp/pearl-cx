import React from 'react';
import {Text, Pressable} from 'react-native';
import {FilterIcon} from '../../routes/CommonScreen';
import {buttonStyles} from '../../styles/button.styles';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {translate} from '../../Utils/MultilinguaUtils';
import {PaddingConstants} from '../../styles/padding.constants';
const SortingToggleButton = ({onPress, text}) => {
  return (
    <Pressable
      // style={styles.sortingView}
      style={[
        buttonStyles.textButton,
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.white,
          padding: PaddingConstants.tab1,
          margin: MarginConstants.tab1,
        },
      ]}
      onPress={onPress}>
      <FilterIcon
        style={{marginHorizontal: MarginConstants.halfTab}}
        color={Colors.accentLight}
        size={16}
      />
      <Text style={buttonStyles.textButtonText}>
        {`${translate('activity.sorted_by')} ${text}`}
      </Text>
      {/* <SortingIcon
          iconName={isInverted ? 'caret-up' : 'caret-down'}
          color={Colors.accent}
        /> */}
    </Pressable>
  );
};

export default SortingToggleButton;
