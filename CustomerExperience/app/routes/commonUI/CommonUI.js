import React from 'react';
import {
  //   Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Colors,
  getStatusBorderColor,
  getStatusFillerColor,
  getPriorityBorderColor,
  getPriorityBorderColorbyId,
} from '../../styles/color.constants';
import {
  getNameInitials,
  getPriorityById,
  getStatusById,
} from '../../Utils/TicketUtils';
import {MarginConstants} from '../../styles/margin.constants';

import {
  useNavigation,
  useNavigationState,
  StackActions,
} from '@react-navigation/native';
import {PaddingConstants} from '../../styles/padding.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';

import Icon from 'react-native-vector-icons/SimpleLineIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
// import {TextSizes} from '../../styles/textsize.constants';
// import {FontFamily, FontWeight} from '../../styles/font.constants';
import {baseTextStyles} from '../../styles/text.styles';
import {Sizes} from '../../styles/Size.constant';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {buttonStyles} from '../../styles/button.styles';
import StringUtils from '../../Utils/StringUtils';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import QPSpinner from '../../widgets/QPSpinner';
import QPButton from '../../widgets/Button';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {translate} from '../../Utils/MultilinguaUtils';
import {DMYFORMAT, HalfMonthDateYearFormat} from '../../Utils/AppConstants';
import moment from 'moment';
import testIDs from '../../widgets/qp-calendar/testIDs';
import {useSelector} from 'react-redux';
// let {width} = Dimensions.get('window');

export const StatusIcon = ({
  size,
  borderRadius,
  borderWidth,
  borderColor,
  fillerColor,
}) => {
  const size_ = size ?? 20;
  const radius_ = borderRadius ?? 50;
  const borderWidth_ = borderWidth ?? 1;
  return (
    <View
      style={{
        width: size_,
        height: size_,

        borderRadius: radius_,
        borderColor: borderColor,
        borderWidth: borderWidth_,
        backgroundColor: fillerColor,
      }}
      testID={'status-icon'}
    />
  );
};

export const CopyIcon = ({size = 12, tintColor = Colors.filterIconColor}) => (
  <Image
    // source={require('./../../assets/images/copy_icon.png')}
    source={require('./../../../assets/images/copy_icon.png')}
    style={{width: size, height: size, tintColor: tintColor}}
    testID={'image'}
  />
);

export const CalendarIcon = ({
  size = 12,
  tintColor = Colors.filterIconColor,
}) => (
  <Image
    testID="image-calendar"
    source={require('./../../../assets/images/date_filter_icon.png')}
    style={{width: size, height: size, tintColor: tintColor}}
  />
);

export const ResponsesIcon = ({
  size = 12,
  tintColor = Colors.filterIconColor,
}) => (
  <Image
    testID="image"
    source={require('./../../../assets/images/total_responses_icon.png')}
    style={{width: size, height: size, tintColor: tintColor}}
  />
);
export const RenderStatusIcon = ({size, title, style}) => {
  const statusStyle = {
    ...style,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: getStatusBorderColor(title.toLowerCase()),
    backgroundColor: getStatusFillerColor(title.toLowerCase()),
    height: size ?? 14,
    width: size ?? 14,
  };

  if (title.toLowerCase() === 'all') {
    return <ResponsesIcon size={14} tintColor={Colors.accentLight} />;
  }
  return <View testID="render-status-icon" style={statusStyle} />;
};

export const StatusUI = ({style, status}) => {
  return (
    <View style={[styles.statusContainer, {...style}]}>
      <RenderStatusIcon size={16} title={getStatusById(status)} />

      {/* <StatusIcon borderColor={borderColor} fillerColor={fillerColor} /> */}
      <Text style={styles.statusText}>{getStatusById(status)}</Text>
    </View>
  );
};
export const RenderPriorityIcon = props => {
  return (
    // <View
    //   style={[
    //     {
    //       borderRadius: 50,
    //       borderWidth: 1,
    //       borderColor: getStatusBorderColor(props.title.toLowerCase()),
    //       backgroundColor: getStatusFillerColor(props.title.toLowerCase()),
    //       height: props.size ?? 14,
    //       width: props.size ?? 14,
    //     },
    //     props.style,
    //   ]}
    // />

    <IonIcons
      style={{marginHorizontal: MarginConstants.halfTab}}
      name={'flag'}
      size={14}
      color={getPriorityBorderColor(props.title.toLowerCase())}
      testID="icon"
    />
  );
};

export const PriorityUI = ({style, priority}) => {
  const priorityColor = getPriorityBorderColorbyId(priority);
  const priorityText = getPriorityById(priority);
  return (
    <View style={[styles.statusContainer, {...style}]}>
      <IonIcons name="flag" size={20} color={priorityColor} />
      <Text style={styles.statusText}>{priorityText}</Text>
    </View>
  );
};
export const CloseButton = ({color}) => {
  let navigation = useNavigation();
  const iconColor = !color ? Colors.white : color;
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: MarginConstants.tab2},
      ]}>
      <Pressable
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => {
          navigation.goBack();
        }}
        testID={'button'}>
        <MaterialIcon
          name={'close'}
          size={1.1 * Sizes.filterIcon}
          color={iconColor}
        />
      </Pressable>
    </View>
  );
};

export const SearchTextInput = React.forwardRef((props, ref) => {
  const styles = StyleSheet.create({
    search: {
      padding: PaddingConstants.halfTab,
      margin: MarginConstants.halfTab,
      borderColor: Colors.filterIconColor,
      borderBottomWidth: 0.5,
    },
  });
  return (
    <TextInput
      ref={ref}
      defaultValue={props.defaultValue ?? ''}
      style={props.style ?? styles.search}
      placeholder={props.placeholder}
      returnKeyType={props.returnKeyType}
      onChangeText={props.onChangeText}
    />
  );
});
export const SearchIcon = props => {
  let navigation = useNavigation();
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: MarginConstants.tab2},
      ]}>
      <Pressable
        testID={'search-button'}
        onPress={() => {
          // props.route === 'Dashboard'
          //   ? navigation.navigate('Search Ticket')
          //   : navigation.navigate('Search Response');

          navigation.navigate('Search Response');
        }}>
        <Icon name={'magnifier'} size={Sizes.icons} color={Colors.white} />
      </Pressable>
    </View>
  );
};

export const SaveDashboardDate = ({saveRange}) => {
  return (
    <Pressable
      style={[
        buttonStyles.primaryButton,
        {marginHorizontal: MarginConstants.tab1},
      ]}
      onPress={saveRange}>
      <Text style={buttonStyles.primaryButtonText}>{`Apply`}</Text>
    </Pressable>
  );
};

export const RenderRoundImageOrColor = ({data, size}) => {
  const _size = size ?? 20;

  const viewStyles = StyleSheet.create({
    color: {
      height: _size,
      width: _size,
      borderRadius: 50,
      alignSelf: 'center',
      borderColor:
        data && data.borderColor ? data.borderColor : Colors.transparent,
      backgroundColor: data && data.color ? data.color : Colors.transparent,
    },
    image: {
      height: _size,
      width: _size,
      borderRadius: 50,
      alignSelf: 'center',
    },
  });

  return data && data.hasOwnProperty('color') ? (
    <View testID="round-color" style={viewStyles.color} />
  ) : (
    <Image
      testID="round-image"
      source={{
        uri: data.url,
      }}
      style={viewStyles.image}
    />
  );
};

export const NoItemsFound = ({children}) => {
  return (
    <View
      testID="no-activity"
      style={{
        flex: 1,

        margin: MarginConstants.tab3,
      }}>
      <Text
        style={{
          fontFamily: FontFamily.medium,
          color: Colors.filterIconColor,
          fontSize: TextSizes.primary,
        }}>
        {children ?? 'No items found'}
      </Text>
    </View>
  );
};

export const ApplyButton = ({onPress, buttonText}) => (
  <QPButton
    buttonColor={Colors.accentLight}
    testID="ApplyButton"
    style={[buttonStyles.primaryButton, {marginVertical: MarginConstants.tab2}]}
    onPress={onPress}
    buttonText={buttonText ?? 'Apply'}
    textStyle={buttonStyles.primaryButtonText}
  />
);
export const RenderSpinner = () => {
  return (
    <View style={dashboardStyles.loading}>
      <QPSpinner />
    </View>
  );
};
export const CheckBoxItem = ({
  item,
  title,
  isChecked,
  index,
  onPress,
  textStyle,
  style,
  isDisabled = false,
}) => {
  const _textStyle = textStyle ?? styles.checkBoxText;
  return (
    <Pressable
      isDisabled={isDisabled}
      testID="check-box-button"
      style={[style, {opacity: isDisabled ? 0.5 : 1}]}
      onPress={() => (isDisabled ? null : onPress(item, index))}>
      <View style={styles.checkBoxRow}>
        {/* <CheckBox
            disabled={false}
            value={item.isChecked}
            onCheckColor={Colors.accentLight}
            boxType={'square'}
            onValueChange={(newValue) => {
              // onPress(index);
            }}
          /> */}
        <CheckBox isChecked={item?.isChecked ?? isChecked} />
        <Text style={_textStyle}>{item?.title ? item.title : title}</Text>
      </View>
    </Pressable>
  );
};

export const ChipItem = ({
  item,
  title,
  isChecked,
  index,
  onPress,
  textStyle,
  style,
  isDisabled = false,
}) => {
  const isActive = item?.isChecked ?? isChecked;
  const chipStyle = [
    styles.chipContainer,
    isActive ? styles.chipActive : styles.chipInactive,
    style,
  ];

  // Ensure text color is applied correctly by putting textStyle first, then override with active/inactive colors
  const chipTextStyle = [
    styles.chipText,
    textStyle, // Apply custom text style first
    isActive ? styles.chipTextActive : styles.chipTextInactive, // Then override with color based on state
  ];

  return (
    <Pressable
      isDisabled={isDisabled}
      testID="chip-button"
      style={[chipStyle, {opacity: isDisabled ? 0.5 : 1}]}
      onPress={() => (isDisabled ? null : onPress(item, index))}>
      <Text style={chipTextStyle}>{item?.title ? item.title : title}</Text>
    </Pressable>
  );
};

export const CheckBox = ({isChecked, checkedColor, uncheckedColor}) => {
  return (
    <IonIcons
      testID="checkbox"
      name={isChecked ? 'checkbox' : 'square-outline'}
      size={24}
      color={
        isChecked
          ? checkedColor ?? Colors.accentLight
          : uncheckedColor ?? Colors.checkboxColor
      }
      style={{marginHorizontal: MarginConstants.halfTab}}
    />
  );
};

export const RadioButtonCheckbox = ({
  isChecked = false,
  checkedColor = Colors.accentLight,
  uncheckedColor = Colors.checkboxColor,
  size,
  style,
}) => {
  return (
    <IonIcons
      testID="radio-button-checkbox"
      name={isChecked ? 'radio-button-on' : 'radio-button-off'}
      size={size ?? 24}
      color={isChecked ? checkedColor : uncheckedColor}
      isChecked={isChecked}
      style={{marginHorizontal: MarginConstants.halfTab, ...style}}
    />
  );
};
export const CheckRadioButtonItem = ({
  item,
  index,
  onPress,
  textStyle,
  checkBoxRowStyle,
}) => {
  const _textStyle = textStyle ?? styles.checkBoxText;
  return (
    <Pressable testID="check-radio-button-item" onPress={() => onPress(index)}>
      <View style={checkBoxRowStyle ?? styles.checkBoxRow}>
        <RadioButtonCheckbox isChecked={item.isChecked} />
        <Text style={_textStyle}>
          {StringUtils.uppercaseFirstCharRestLowercase(item.title)}
        </Text>
      </View>
    </Pressable>
  );
};

export const DateIcon = () => {
  return (
    <IonIcons
      testID="icon-calendar"
      style={{margin: MarginConstants.halfTab}}
      name="calendar"
      size={20}
      color={Colors.lightBlack}
    />
  );
};

const DateText = () => {
  const {startDate, endDate} = useSelector(state => state.global.range);

  const sDate = moment(startDate, DMYFORMAT).format(HalfMonthDateYearFormat);
  const eDate = moment(endDate, DMYFORMAT).format(HalfMonthDateYearFormat);
  return (
    <Text
      style={[
        baseTextStyles.secondaryRegularText,
        {marginHorizontal: MarginConstants.halfTab, color: Colors.lightBlack},
      ]}>
      {`${sDate} - ${eDate}`}
    </Text>
  );
};

export const FilterDateBox = () => {
  const navigation = useNavigation();

  let filterAction = () => {
    const pushAction = StackActions.push(translate('date_filter.date_range'));
    navigation.dispatch(pushAction);
  };

  return (
    <Pressable testID="Filter-Date-Box" onPress={() => filterAction()}>
      <View style={styles.filterBox}>
        <DateText />
        <CalendarIcon size={16} />
      </View>
    </Pressable>
  );
};

export const Avatar = ({title, style, textStyle}) => {
  return (
    <View style={[styles.avatarView, {...style}]}>
      <Text
        style={[
          baseTextStyles.mediumRegularText,
          {color: Colors.white},
          {...textStyle},
        ]}>
        {getNameInitials(title ?? 'NA')}
      </Text>
    </View>
  );
};

export const FilterIcon = ({
  onPressFilter,
  size,
  style,
  color,
  endComponent,
}) => {
  return (
    <Pressable
      testID="on-press-filter-icon"
      style={style}
      onPress={onPressFilter}>
      {/* <IonIcons
          name="funnel"
          size={size ?? 20}
          color={color ?? Colors.lightBlack}
        /> */}
      <Image
        // source={require('./../../../assets/images/responses_icon.png')}
        source={require('./../../../assets/images/filter_icon.png')}
        style={{
          width: size ?? 22,
          height: size ?? 22,
          tintColor: color ?? Colors.filterIconColor,
        }}
      />
      {endComponent}
    </Pressable>
  );
};

export const ExclaimationIcon = ({
  onPress,
  size,
  style,
  color,
  endComponent,
}) => {
  return (
    <Pressable style={style} testID="exclaimation-icon" onPress={onPress}>
      <Image
        // source={require('./../../../assets/images/responses_icon.png')}
        source={require('./../../../assets/images/exclaimation_icon.png')}
        style={{
          width: size ?? 22,
          height: size ?? 22,
          tintColor: color ?? Colors.critical,
        }}
      />
      {endComponent}
    </Pressable>
  );
};
export const SortIcon = ({onPressFilter, size, style}) => {
  return (
    <Pressable style={style} testID="on-press-filter" onPress={onPressFilter}>
      <MaterialIcon name="sort" size={size ?? 24} color={Colors.lightBlack} />
    </Pressable>
  );
};
const FilterCountText = ({filterCount}) => {
  return (
    <Text
      style={[
        baseTextStyles.secondaryRegularText,
        {
          color: filterCount > 0 ? Colors.accentLight : Colors.filterIconColor,
          marginEnd: MarginConstants.tab1,
        },
      ]}>{`Filters (${filterCount ?? 0})`}</Text>
  );
};

export const RenderFilterCount = ({filterCount, onPressFilter}) => {
  return (
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
      <Pressable style={{flexDirection: 'row'}} onPress={onPressFilter}>
        <FilterIcon
          size={22}
          color={filterCount > 0 ? Colors.accentLight : Colors.filterIconColor}
        />

        <FilterCountText filterCount={filterCount} />
      </Pressable>
    </View>
  );
};

export const HeaderFilter = ({
  hasFilterIcon = true,
  hasSortIcon = false,

  onPressFilter,

  filterCount,
  endComponent,
  style,
}) => {
  return (
    <View style={[styles.filterAndSearchBox, {...style}]}>
      {hasSortIcon && (
        <SortIcon
          style={{marginEnd: MarginConstants.tab1}}
          onPressFilter={onPressFilter}
        />
      )}

      <FilterDateBox />
      {hasFilterIcon && (
        <RenderFilterCount
          filterCount={filterCount}
          onPressFilter={onPressFilter}
        />
      )}
      {endComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  rightHeaderButton: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  checkBoxRow: {
    flexDirection: 'row',
    padding: PaddingConstants.halfTab,
    alignItems: 'center',
  },
  checkBoxText: {
    color: Colors.filterIconColor,
    textAlign: 'center',
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
  },
  chipContainer: {
    borderRadius: 20,
    paddingHorizontal: PaddingConstants.halfTab,
    paddingVertical: PaddingConstants.halfTab,
    margin: MarginConstants.tab1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: MarginConstants.tab1_8x,
  },
  chipInactive: {
    backgroundColor: '#EEF3FB',
  },
  chipActive: {
    backgroundColor: '#045EBF',
  },
  chipText: {
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  chipTextInactive: {
    color: '#545E6B',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  filterBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.evenDarkerGrey,
    paddingVertical: PaddingConstants.tab1,
    marginVertical: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.tab1,
  },
  filterAndSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: PaddingConstants.halfTab,
    paddingHorizontal: PaddingConstants.tab2,
    backgroundColor: Colors.white,
    // Bottom shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarView: {
    flexDirection: 'row',
    borderRadius: 50,
    height: MarginConstants.tab3,
    width: MarginConstants.tab3,
    backgroundColor: Colors.textAvatarBackground,
    marginHorizontal: MarginConstants.halfTab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,
  },
});
