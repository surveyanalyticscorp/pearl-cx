import React, {useState} from 'react';
import {
  View,
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

const FilterTicket = ({data, onPressHandler}) => {
  const [status, setStatus] = useState(data.status);
  const [priority, setPriority] = useState(data.priority);
  const [type, setType] = useState(data.type);
  const [assignToId, setAssignToId] = useState(data.assignToId);

  const selectedManager = data.selectedManager ?? [];

  const RenderStatusFilter = () => {
    const selectedStatus = (item, index) => {
      setStatus(prevState => {
        const temp = [...prevState];
        temp[index].isChecked = !prevState[index].isChecked;
        return temp;
      });
    };
    return (
      <View testID="render-status" style={styles.sectionContainer}>
        <Text style={styles.titleText}>{translate('close_loop.status')}</Text>
        <FlatList
          style={styles.flatList}
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
      </View>
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
      <View testID="render-priority" style={styles.sectionContainer}>
        <Text style={styles.titleText}>{translate('close_loop.priority')}</Text>
        <FlatList
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
      </View>
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
      <View testID="render-ticket-type" style={styles.sectionContainer}>
        <Text style={styles.titleText}>Type</Text>
        <FlatList
          data={typelist}
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
      </View>
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

  const onApplyFilterHandler = () => {
    data.status = status;
    data.priority = priority;
    data.type = type;
    data.selectedManager = selectedManager;
    data.assignToId = assignToId;
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
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <RenderStatusFilter />
        <VerticalSpaceBox multiplyBy={2} />
        <RenderPriorityFilter />
        <VerticalSpaceBox multiplyBy={2} />
        <RenderTypeFilter typelist={type} />
        <VerticalSpaceBox multiplyBy={2} />
        <RenderShowMyTicketsFilter
          assignToId={assignToId}
          userId={data.userId}
        />
        <VerticalSpaceBox multiplyBy={2} />
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
  sectionContainer: {
    paddingHorizontal: PaddingConstants.tab1,
  },
  checkBoxRow: {
    flexDirection: 'row',
    padding: PaddingConstants.halfTab,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: PaddingConstants.tab1_2x,
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
    paddingHorizontal: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  // optionText: {
  //   fontFamily: FontFamily.regular,
  //   fontSize: TextSizes.secondary,
  //   marginHorizontal: MarginConstants.halfTab,
  //   color: Colors.filterIconColor,
  // },

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
