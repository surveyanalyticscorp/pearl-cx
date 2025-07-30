import React, {useState} from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {
  CheckBoxItem,
  CheckRadioButtonItem,
} from '../../../routes/commonUI/CommonUI';
import {translate} from '../../../Utils/MultilinguaUtils';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import {textStyles} from '../../../styles/text.styles';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
// import IconTextModalDropdown from '../../../widgets/drop-down/IconTextModalDropdown';
// import IonIcons from 'react-native-vector-icons/Ionicons';

const FilterTicket = ({data, onPressHandler}) => {
  const [status, setStatus] = useState(data.status);
  const [priority, setPriority] = useState(data.priority);
  const [type, setType] = useState(data.type);
  // const [showMyTickets, setShowMyTickets] = useState(data.showMyTickets);
  // const [hasOwner, setHasOwner] = useState(data.assignToId.length > 0);
  // const [managerlist, setManagerList] = useState(data.managers);
  const [assignToId, setAssignToId] = useState(data.assignToId);
  console.log('MANAGERS', JSON.stringify(data));

  // let [managerlist, setManagerList] = useState(data.managers);
  let [selectedManager, setSelectedManager] = useState(
    data.selectedManager ?? [],
  );

  const RenderStatusFilter = () => {
    const selectedStatus = (item, index) => {
      setStatus(prevState => {
        const temp = [...prevState];
        temp[index].isChecked = !prevState[index].isChecked;
        return temp;
      });
    };
    return (
      <FlatList
        style={styles.sectionContainer}
        contentContainerStyle={{flexGrow: 0}}
        ListHeaderComponent={
          <Text style={styles.titleText}>{translate('close_loop.status')}</Text>
        }
        data={status}
        keyExtractor={(item, index) => item.toString()}
        numColumns={3}
        renderItem={({item, index}) => (
          <CheckBoxItem
            textStyle={textStyles.optionText}
            item={item}
            index={index}
            onPress={selectedStatus}
          />
        )}
      />
    );
  };

  const RenderPriorityFilter = () => {
    const selectedPriority = (item, index) => {
      setPriority(prevState => {
        const temp = [...prevState];
        temp[index].isChecked = !prevState[index].isChecked;
        return temp;
      });
    };
    return (
      <FlatList
        style={styles.sectionContainer}
        contentContainerStyle={{flexGrow: 0}}
        ListHeaderComponent={
          <Text style={styles.titleText}>
            {translate('close_loop.priority')}
          </Text>
        }
        data={priority}
        keyExtractor={(item, index) => item.toString()}
        numColumns={3}
        renderItem={({item, index}) => (
          <CheckBoxItem
            textStyle={textStyles.optionText}
            item={item}
            index={index}
            onPress={selectedPriority}
          />
        )}
      />
    );
  };

  const RenderTypeFilter = ({typelist}) => {
    const selectType = index => {
      setType(prevState =>
        prevState.map((item, index_, arr) => {
          item.isChecked = index === index_;
          return item;
        }),
      );
    };
    return (
      <FlatList
        data={typelist}
        contentContainerStyle={{flexGrow: 0}}
        ListHeaderComponent={<Text style={styles.titleText}>{'Type'}</Text>}
        keyExtractor={(item, index) => item.toString()}
        numColumns={3}
        renderItem={({item, index}) => (
          <CheckRadioButtonItem
            textStyle={textStyles.optionText}
            item={item}
            index={index}
            onPress={selectType}
          />
        )}
      />
    );
  };
  const RenderShowMyTicketsFilter = ({assignToId, userId}) => {
    const toggleMyTicketVisibility = index => {
      setAssignToId(state => (state.length > 0 ? '' : userId));
    };
    return (
      <View testID="render-show-tickets" style={styles.sectionContainer}>
        <Text style={styles.titleText}>Show tickets</Text>
        <CheckBoxItem
          textStyle={textStyles.optionText}
          item={{
            title: translate('only_my_tickets'),
            isChecked: assignToId.length > 0,
          }}
          index={0}
          onPress={toggleMyTicketVisibility}
        />
      </View>
    );
  };

  //   const defaultText = 'Select...';
  //   const list = managerlist.filter((item) => item.isChecked === false);
  //   return (
  //     <View>
  //       <Text style={styles.titleText}>Assignee</Text>
  //       <RenderAssigneeList />
  //       <IconTextModalDropdown
  //         style={styles.modelDropdown}
  //         textStyle={styles.dropdownText}
  //         dropdownTextStyle={styles.dropdownText}
  //         arrowIconColor={Colors.secondary}
  //         options={list.map((item) => item.ownerName)}
  //         defaultValue={defaultText}
  //         renderRow={dropdownRenderRow}
  //         onSelect={(_index) => {
  //           setAssigneeManager(list[_index], true);
  //           // setSelectedManager((state) => [...state, managerlist[_index]]);
  //           // setManagerList((state) =>
  //           //   state.filter((item) => item.ownerID !== state[_index].ownerID),
  //           // );
  //         }}
  //       />
  //     </View>
  //   );
  // };

  // const setAssigneeManager = (item, isChecked) => {
  //   let index = 0;
  //   managerlist.map((item_, index_) => {
  //     if (item_.ownerID === item.ownerID) {
  //       index = index_;
  //     }
  //   });

  //   setManagerList((prevState) => {
  //     const temp = [...prevState];
  //     temp[index].isChecked = isChecked;
  //     return temp;
  //   });
  // };

  const onApplyFilterHandler = () => {
    // apply filter
    // close filter

    data.status = status;
    data.priority = priority;
    data.type = type;
    // data.managers = managerlist;
    data.selectedManager = selectedManager;
    data.assignToId = assignToId;
    // data.showMyTickets = showMyTickets;
    onPressHandler(data, 'apply');
  };

  const RenderButtons = () => {
    return (
      <View
        style={[
          styles.rowContainer,
          {
            paddingHorizontal: PaddingConstants.tab1_2x,
            justifyContent: 'flex-end',
          },
        ]}>
        <QPButton
          style={{
            ...buttonStyles.primaryButton,
            flex: 1,
          }}
          buttonColor={Colors.accentLight}
          onPress={onApplyFilterHandler}
          textStyle={buttonStyles.primaryButtonText}
          buttonText={'Apply'}
        />
      </View>
    );
  };

  return (
    <View style={styles.innerContainer}>
      <RenderStatusFilter />
      <VerticalSpaceBox multiplyBy={2} />
      <RenderPriorityFilter />
      <VerticalSpaceBox multiplyBy={2} />
      <RenderTypeFilter typelist={type} />
      <VerticalSpaceBox multiplyBy={2} />
      <RenderShowMyTicketsFilter assignToId={assignToId} userId={data.userId} />
      <VerticalSpaceBox multiplyBy={6} />
      <RenderButtons />
    </View>
  );
};

export default FilterTicket;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  sectionContainer: {
    paddingHorizontal: PaddingConstants.tab1,
  },
  checkBoxRow: {
    flexDirection: 'row',
    padding: PaddingConstants.halfTab,
    alignItems: 'center',
  },
  innerContainer: {
    padding: PaddingConstants.tab1_2x,
  },

  assigneeCell: {
    borderWidth: 1,
    borderRadius: 2,
    padding: PaddingConstants.halfTab,
    borderColor: Colors.checkboxColor,
    margin: MarginConstants.halfTab,
  },
  titleText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    padding: PaddingConstants.tab1,
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
