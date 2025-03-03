import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {textStyles} from '../../styles/text.styles';
import {CheckRadioButtonItem} from '../../routes/commonUI/CommonUI';
import {FlatList} from 'react-native-gesture-handler';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {Colors} from '../../styles/color.constants';
import {useSelector} from 'react-redux';
import NoDataFound from './NoDataFound';

const RenderSegmentItem = ({
  onClickRadioButton,
  title,
  currentSelected,
  isCurrentSegment = true,
}) => {
  const segments = useSelector(
    state => state.dashboard.segmentDetails.segments,
  );

  const segmentList = segments.map(item => ({
    title: item.segmentName,
    id: item.segmentID,
    isChecked: currentSelected === item.segmentID,
  }));

  console.log('segmentList : ', JSON.stringify(segmentList));
  // console.log('segments : redux', JSON.stringify(segments));

  return (
    <FlatList
      ListHeaderComponent={<Text style={styles.titleText}>{title}</Text>}
      style={{
        marginVertical: MarginConstants.tab2,
        opacity: isCurrentSegment ? 1 : 0.6,
      }}
      nestedScrollEnabled={true}
      data={segmentList}
      keyExtractor={(item, index) => item.id.toString()}
      numColumns={1}
      ListEmptyComponent={<NoDataFound dataText={title} />}
      renderItem={({item, index}) => (
        <CheckRadioButtonItem
          textStyle={textStyles.optionText}
          item={item}
          index={index}
          onPress={() =>
            isCurrentSegment ? onClickRadioButton(title, item, index) : () => {}
          }
        />
      )}
    />
  );
};
const styles = StyleSheet.create({
  titleText: {
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight._700,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },
});

export default RenderSegmentItem;
