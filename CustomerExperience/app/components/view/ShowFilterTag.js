import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet, Pressable} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import StringUtils from '../../Utils/StringUtils';

const ShowFilterTag = ({handleFilterTag, filterData}) => {
  let taglist = [
    'status',
    'priority',
    'type',
    // 'assignToId'
  ];
  let [list, setList] = useState([]);

  //   taglistMap.set('status', 'Status');
  //   taglistMap.set('priority', 'Priority');
  //   taglistMap.set('type', 'type');
  //   taglistMap.set('assignToId', 'Assignee');

  const populateList = () => {
    console.log('TAG_LIST_FILTERDATA', JSON.stringify(filterData));

    for (let tag of taglist) {
      if (filterData.hasOwnProperty(tag) && filterData[tag].length > 0) {
        console.log('TAG_ITEM', tag, filterData[tag]);
        setList(state => [...state, tag]);
      }
      //   console.log('TAG', tag);
    }
    // console.log('TAG_LIST', list);
    // for (let i = 0; i < taglist.length; i++) {
    //   if (taglist[i] in filterData && filterData[taglist[i]].length > 0) {

    //     console.log('TAG_LIST', taglist[i]);
    //   }
    // }
  };

  useEffect(() => {
    populateList();
  }, [filterData]);

  const getTagName = tag => {
    // switch (tag) {
    //   case 'assignToId':
    //     return 'Assignee';
    //   default:
    return StringUtils.uppercaseFirstChar(tag);
    // }
  };

  return (
    <View style={styles.container}>
      {list.length > 0 && (
        <FlatList
          data={list}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <Pressable
                style={styles.cellStyle}
                onPress={() => handleFilterTag(item)}>
                <Text style={styles.labelStyle}>{getTagName(item)}</Text>
                {/* {console.log('TAG', item)} */}
                <IonIcons
                  size={16}
                  name={'close'}
                  color={Colors.filterIconColor}
                />
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};

export default ShowFilterTag;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingBottom: PaddingConstants.halfTab,
    paddingHorizontal: MarginConstants.tab1,
  },
  cellStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    padding: PaddingConstants.halfTab,
    marginHorizontal: MarginConstants.halfTab,
    borderRadius: 5,
  },
  labelStyle: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    paddingLeft: PaddingConstants.tab1,
  },
});
