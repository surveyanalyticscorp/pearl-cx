import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import {Colors, priorityColors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {
  CheckBoxItem,
  RenderRoundImageOrColor,
} from '../../../routes/CommonScreen';
import IconTextModalDropdown from '../../../widgets/drop-down/IconTextModalDropdown';

const FilterTicket = ({data, onPressHandler}) => {
  const [status, setStatus] = useState(data.status);
  const [priority, setPriority] = useState(data.priority);
  const managerlist = data.managers;
  let selectedManager = data.selectedManager;

  const RenderStatusFilter = () => {
    return (
      <View>
        <Text style={styles.titleText}>Status</Text>
        <FlatList
          data={status}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={({item, index}) => (
            <CheckBoxItem
              textStyle={styles.optionText}
              item={item}
              index={index}
              onPress={selectedStatus}
            />
          )}
        />
      </View>
    );
  };

  const selectedStatus = (index) => {
    setStatus((prevState) => {
      const temp = [...prevState];
      temp[index].isChecked = !prevState[index].isChecked;
      console.log(temp);
      return temp;
    });
  };

  const RenderPriorityFilter = () => {
    return (
      <View>
        <Text style={styles.titleText}>Priority</Text>
        <FlatList
          data={priority}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={({item, index}) => (
            <CheckBoxItem
              textStyle={styles.optionText}
              item={item}
              index={index}
              onPress={selectedPriority}
            />
          )}
        />
      </View>
    );
  };

  const selectedPriority = (index) => {
    setPriority((prevState) => {
      const temp = [...prevState];
      temp[index].isChecked = !prevState[index].isChecked;
      console.log(temp[index]);

      return temp;
    });
  };

  const RenderAssigneeDropDown = () => {
    const defaultText = selectedManager.value ?? 'Select...';

    return (
      <View>
        <Text style={styles.titleText}>Assignee</Text>

        <IconTextModalDropdown
          style={styles.modelDropdown}
          textStyle={styles.dropdownText}
          dropdownTextStyle={styles.dropdownText}
          arrowIconColor={Colors.secondary}
          options={managerlist}
          defaultValue={defaultText}
          renderRow={dropdownRenderRow}
          onSelect={(_index) => {
            selectedManager = managerlist[_index];
            console.log(selectedManager);
          }}
        />
      </View>
    );
  };

  const dropdownRenderRow = (rowData, rowID, highlighted) => {
    return (
      <View
        style={[
          styles.dropdownRow,
          {backgroundColor: highlighted ? Colors.overlay : Colors.white},
        ]}>
        <RenderRoundImageOrColor data={rowData} />
        <Text style={styles.dropdownText}>{rowData.value ?? rowData}</Text>
      </View>
    );
  };

  const onCancelHandler = () => {
    // close filter screen
    onPressHandler(null, 'close');
  };

  const onApplyFilterHandler = () => {
    // apply filter
    // close filter

    data.status = status;
    data.priority = priority;
    data.managers = managerlist;
    data.selectedManager = selectedManager;
    onPressHandler(data, 'apply');
  };

  const onClearHandler = () => {
    // clear filter fields

    setPriority((prevState) => {
      const temp = prevState.map((item) => ({...item, isChecked: false}));
      return temp;
    });

    setStatus((prevState) => {
      const temp = prevState.map((item) => ({...item, isChecked: false}));
      return temp;
    });

    selectedManager = {};

    console.log(status);
  };

  const RenderButtons = () => {
    return (
      <View
        style={[
          styles.rowContainer,
          {marginVertical: MarginConstants.tab4, justifyContent: 'flex-end'},
        ]}>
        <RenderButton
          onPress={onCancelHandler}
          textStyle={styles.clearButtonText}
          text={'Close'}
        />
        <RenderButton
          onPress={onClearHandler}
          textStyle={styles.clearButtonText}
          text={'Clear filter'}
        />

        <RenderButton
          onPress={onApplyFilterHandler}
          textStyle={styles.fiiledButtonText}
          text={'Apply Filter'}
        />
      </View>
    );
  };

  const RenderButton = (props) => {
    return (
      <TouchableOpacity onPress={props.onPress}>
        <Text style={props.textStyle ?? styles.clearButtonText}>
          {props.text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <RenderStatusFilter />
        <RenderPriorityFilter />
        <RenderAssigneeDropDown />
        <RenderButtons />
      </View>
    </SafeAreaView>
  );
};

export default FilterTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  checkBoxRow: {
    flexDirection: 'row',
    padding: PaddingConstants.halfTab,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: PaddingConstants.tab1,
  },
  titleText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  optionText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },

  fiiledButtonText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.white,
    backgroundColor: Colors.accentLight,
    paddingVertical: MarginConstants.tab1,
    paddingHorizontal: MarginConstants.tab2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.accentLight,
  },

  clearButtonText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,

    paddingVertical: MarginConstants.tab1,
    paddingHorizontal: MarginConstants.tab2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.filterIconColor,
  },

  modelDropdown: {
    minHeight: MarginConstants.tab3,
    justifyContent: 'space-around',
    marginHorizontal: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.halfTab,
    borderColor: Colors.evenDarkerGrey,
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownText: {
    flex: 1,
    color: Colors.primary,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.halfTab,
    fontSize: Platform.isPad
      ? TextSizes.primary
      : Platform.OS === 'android'
      ? TextSizes.primary
      : TextSizes.secondary,
    textAlign: 'left',
    paddingLeft: MarginConstants.halfTab,
    paddingRight: MarginConstants.tab3,
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderColor: Colors.darkerGrey,
  },
  dropdownRow: {
    flexDirection: 'row',
    minHeight: MarginConstants.tab4,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
    backgroundColor: Colors.accent,
  },
});
