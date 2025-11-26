import React, {useState} from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
  Switch,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {ChipItem} from '../../../routes/commonUI/CommonUI';
import {translate} from '../../../Utils/MultilinguaUtils';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import {textStyles} from '../../../styles/text.styles';
import {HorizontalSpaceBox, VerticalSpaceBox} from '../../../widgets/SpaceBox';
import {set} from 'lodash';
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
  console.log('Filter Tickets, Preset data list', JSON.stringify(data));
  console.log('Filter Tickets, Preset data list type', type);

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
        testID="render-status"
        contentContainerStyle={{flexGrow: 0}}
        ListHeaderComponent={
          <Text style={styles.titleText}>{translate('close_loop.status')}</Text>
        }
        data={status}
        keyExtractor={(item, index) => item.toString()}
        numColumns={4}
        renderItem={({item, index}) => (
          <ChipItem
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
        testID="render-priority"
        contentContainerStyle={{flexGrow: 0}}
        ListHeaderComponent={
          <Text style={styles.titleText}>
            {translate('close_loop.priority')}
          </Text>
        }
        data={priority}
        keyExtractor={(item, index) => item.toString()}
        numColumns={4}
        renderItem={({item, index}) => (
          <ChipItem
            textStyle={textStyles.optionText}
            item={item}
            index={index}
            onPress={selectedPriority}
          />
        )}
      />
    );
  };

  const RenderTypeFilter = () => {
    const selectType = (item_, index_) => {
      console.log(JSON.stringify(type));
      console.log('Selected item:', item_, index_);

      setType(prevState => {
        return prevState.map((item, index, arr) => {
          if (item.id === item_.id) {
            item.isChecked = !item.isChecked;
          } else {
            item.isChecked = false;
          }
          return item;
        });
      });
    };
    return (
      <FlatList
        data={type}
        testID="render-ticket-type"
        contentContainerStyle={{flexGrow: 0}}
        ListHeaderComponent={<Text style={styles.titleText}>{'Type'}</Text>}
        keyExtractor={(item, index) => item.toString()}
        numColumns={3}
        renderItem={({item, index}) => (
          <ChipItem
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
    const toggleMyTicketVisibility = () => {
      setAssignToId(state => (state.length > 0 ? '' : userId));
    };
    return (
      <View testID="render-show-tickets" style={styles.sectionContainer}>
        <View style={styles.switchContainer}>
          <Text style={styles.titleText}>{translate('only_my_tickets')}</Text>
          <Switch
            trackColor={{
              false: Colors.darkGrey,
              true: Colors.darkGrey,
            }}
            thumbColor={
              assignToId.length > 0
                ? Colors.accentLight
                : Colors.filterIconColor
            }
            ios_backgroundColor={Colors.evenDarkerGrey}
            onValueChange={toggleMyTicketVisibility}
            value={assignToId.length > 0}
          />
        </View>
      </View>
    );
  };

  const onApplyFilterHandler = () => {
    data.status = status;
    data.priority = priority;
    data.type = type;
    // data.managers = managerlist;
    data.selectedManager = selectedManager;
    data.assignToId = assignToId;
    // data.showMyTickets = showMyTickets;
    onPressHandler(data, 'apply');
  };

  const onCancel = () => {
    setStatus(prev => [...prev.map(item => ({...item, isChecked: false}))]);
    setPriority(prev => [...prev.map(item => ({...item, isChecked: false}))]);
    setType(prev => [...prev.map(item => ({...item, isChecked: false}))]);
    setAssignToId(assignToId.length > 0 ? '' : data.userId);
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
            ...buttonStyles.outlinePrimaryButton,
            flex: 1,
          }}
          buttonColor={Colors.white}
          onPress={onCancel}
          textStyle={buttonStyles.outlinePrimaryButtonText}
          buttonText={'Clear'}
        />
        <HorizontalSpaceBox multiplyBy={2} />
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
      <RenderTypeFilter />
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
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
