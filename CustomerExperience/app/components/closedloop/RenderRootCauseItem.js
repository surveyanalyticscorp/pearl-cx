import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {textStyles} from '../../styles/text.styles';
import {CheckBoxItem} from '../../routes/commonUI/CommonUI';
import {FlatList} from 'react-native-gesture-handler';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {Colors} from '../../styles/color.constants';
import NoDataFound from './NoDataFound';
const RenderRootCauseItem = ({onClickCheckBox, title, data}) => {
  return (
    <FlatList
      ListHeaderComponent={<Text style={styles.titleText}>{title}</Text>}
      style={{marginVertical: MarginConstants.tab2}}
      nestedScrollEnabled={true}
      data={data}
      keyExtractor={(item, index) => item.id.toString()}
      numColumns={1}
      ListEmptyComponent={<NoDataFound dataText={title} />}
      renderItem={({item, index}) => (
        <CheckBoxItem
          textStyle={textStyles.optionText}
          item={item}
          index={index}
          onPress={() => onClickCheckBox(title, item, index)}
        />
      )}
    />
  );
};
export default RenderRootCauseItem;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight._700,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },
});
