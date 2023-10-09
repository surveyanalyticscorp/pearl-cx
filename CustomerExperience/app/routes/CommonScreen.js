import {
  Dimensions,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Alert,
  BackHandler,
  TextInput,
  Keyboard,
} from 'react-native';
import FeedbackDetails from '../components/feedback/FeedbackDetails';
import {
  DrawerActions,
  StackActions,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import UpdateTicket from '../components/dashboard/ticketManagement/UpdateTicket';
import React from 'react';
import {
  Colors,
  getPriorityBorderColor,
  getPriorityBorderColorbyId,
  getStatusBorderColor,
  getStatusFillerColor,
} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {PaddingConstants} from '../styles/padding.constants';
import DashboardDateFilter from '../components/dashboard/components/DashboardDateFilter';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TransitionPresets} from '@react-navigation/stack';
import TicketOverview from '../components/dashboard/ticketManagement/TicketOverview';
import TicketComments from '../components/dashboard/ticketManagement/TicketComments';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Sizes} from '../styles/Size.constant';
import {MarginConstants} from '../styles/margin.constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {FontFamily, FontWeight} from '../styles/font.constants';
import DetractorScenes from '../components/dashboard/components/DetractorScenes';
import {translate} from '../Utils/MultilinguaUtils';
import {dashboardStyles} from '../components/dashboard/dashboard.style';
import QPSpinner from '../widgets/QPSpinner';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {SEGMENT_SELECTOR} from '../api/Constant';
import SelectSegmentScreen from '../components/SelectSegmentScreen';
import moment from 'moment';
import {DMYFORMAT, HalfMonthDateYearFormat} from '../Utils/AppConstants';
import {
  getNameInitials,
  getPriorityById,
  getStatusById,
} from '../Utils/TicketUtils';
import {textStyles} from '../styles/text.styles';
import CreateTicket from '../components/dashboard/ticketManagement/CreateTicket';

// import CheckBox from '@react-native-community/checkbox';

const DateRangeTab = createMaterialTopTabNavigator();
const TicketLogTab = createMaterialTopTabNavigator();
const CloseLoopTicketsTab = createMaterialTopTabNavigator();

let {width} = Dimensions.get('window');

export const FabAddButton = props => {
  let size = width / 8;
  let fabStyle = StyleSheet.create({
    fabContainer: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: size,
      height: size,
      borderRadius: 50,
      backgroundColor: Colors.accentLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={fabStyle.fabContainer}>
      <Pressable onPress={props.onPress}>
        <MaterialIcon name="add" size={size - 5} color={Colors.white} />
      </Pressable>
    </View>
  );
};

export const MenuIcon = () => {
  let navigation = useNavigation();
  return (
    <View style={styles.rightHeaderButton}>
      <Pressable
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}>
        <Icon name="menu" size={Sizes.icons} color="white" />
      </Pressable>
    </View>
  );
};

export const HeaderBackLeft = props => {
  const navigation = useNavigation();
  return (
    <View style={styles.leftHeaderButton}>
      <Pressable
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={() => {
          if (
            props &&
            props.route &&
            props.route.params &&
            props.route.params.onBackPress
          ) {
            props.route.params.onBackPress();
            navigation.goBack();
          } else {
            navigation.goBack();
          }
        }}>
        <Icon name="arrow-left" size={Sizes.icons} color={Colors.white} />
      </Pressable>
    </View>
  );
};

export const DismissKeyboard = ({children}) => (
  <Pressable onPress={() => Keyboard.dismiss()}>{children}</Pressable>
);
export const BottomSheetHeader = props => {
  return (
    <View style={styles.panelHeaderContainer}>
      <View style={styles.panelHandleContainer}>
        <View style={styles.panelHandle} />
      </View>
      <View style={styles.panelTitleContainer}>
        <Text style={styles.header}>{props.title}</Text>
        <Pressable onPress={props.onPressClose}>
          <IonIcons name="close" size={20} color={Colors.filterIconColor} />
        </Pressable>
      </View>
    </View>
  );
};

export const listItemSeparator = () => {
  return <View style={{height: 0.5, backgroundColor: Colors.darkGrey}} />;
};

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
    />
  );
};

export const ResponsesIcon = ({size = 12}) => (
  <Image
    // source={require('./../../../assets/images/responses_icon.png')}
    source={require('./../../assets/images/responses_icon.png')}
    style={{width: size, height: size}}
  />
);
export const RenderStatusIcon = ({size, title, style}) => {
  return (
    <View
      style={[
        {
          borderRadius: 50,
          borderWidth: 1,
          borderColor: getStatusBorderColor(title.toLowerCase()),
          backgroundColor: getStatusFillerColor(title.toLowerCase()),
          height: size ?? 14,
          width: size ?? 14,
        },
        style,
      ]}
    />
  );
};

export const StatusUI = ({status}) => {
  return (
    <View style={styles.statusContainer}>
      <RenderStatusIcon size={16} title={getStatusById(status)} />

      {/* <StatusIcon borderColor={borderColor} fillerColor={fillerColor} /> */}
      <Text style={textStyles.secondaryText}>{getStatusById(status)}</Text>
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
    />
  );
};

export const PriorityUI = ({priority}) => {
  const priorityColor = getPriorityBorderColorbyId(priority);
  const priorityText = getPriorityById(priority);
  return (
    <View style={styles.statusContainer}>
      <IonIcons name="flag" size={20} color={priorityColor} />
      <Text style={[{marginStart: 4}, textStyles.secondaryText]}>
        {priorityText}
      </Text>
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
        }}>
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

export const SaveDashboardDate = props => {
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: 1.5 * MarginConstants.tab1},
      ]}>
      <Pressable
        onPress={() => {
          props.route.params.saveRange();
        }}>
        <Text style={styles.saveText}> {translate('date_filter.save')} </Text>
      </Pressable>
    </View>
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
      borderColor: data.borderColor ?? Colors.transparent,
      backgroundColor: data.color ?? Colors.transparent,
    },
    image: {
      height: _size,
      width: _size,
      borderRadius: 50,
      alignSelf: 'center',
    },
  });

  return data.hasOwnProperty('color') ? (
    <View style={viewStyles.color} />
  ) : (
    <Image
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

export const RenderSpinner = () => {
  return (
    <View style={dashboardStyles.loading}>
      <QPSpinner />
    </View>
  );
};
export const CheckBoxItem = ({item, title, index, onPress, textStyle}) => {
  const _textStyle = textStyle ?? styles.checkBoxText;
  return (
    <Pressable onPress={() => onPress(item, index)}>
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
        <CheckBox isChecked={item.isChecked} />
        <Text style={_textStyle}>{item.title ? item.title : title}</Text>
      </View>
    </Pressable>
  );
};

export const CheckBox = ({isChecked, checkedColor, uncheckedColor}) => {
  return (
    <IonIcons
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
export const CheckRadioButtonItem = ({item, index, onPress, textStyle}) => {
  const _textStyle = textStyle ?? styles.checkBoxText;
  return (
    <Pressable onPress={() => onPress(index)}>
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
        <IonIcons
          name={item.isChecked ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color={item.isChecked ? Colors.accentLight : Colors.checkboxColor}
          style={{marginHorizontal: MarginConstants.halfTab}}
        />
        <Text style={_textStyle}>{item.title}</Text>
      </View>
    </Pressable>
  );
};

export const EditTicket = () => {
  let navigation = useNavigation();
  const state = useNavigationState(state => state);
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: 1.5 * MarginConstants.tab1},
      ]}>
      <Pressable
        onPress={() => {
          navigation.navigate(translate('close_loop.update_ticket'), {
            parentRoute: state.routeNames[0],
          });
        }}>
        <MaterialIcon
          name={'edit'}
          size={Sizes.filterIcon}
          color={Colors.white}
        />
      </Pressable>
    </View>
  );
};

export const FilterDateBox = ({range, onDateRangeChangeHandler}) => {
  const navigation = useNavigation();

  const DateIcon = () => {
    return (
      <IonIcons
        style={{margin: MarginConstants.halfTab}}
        name="calendar"
        size={20}
        color={Colors.lightBlack}
      />
    );
  };

  const GetDateText = ({dateRange}) => {
    const sDate = moment(dateRange.startDate, DMYFORMAT).format(
      HalfMonthDateYearFormat,
    );
    const eDate = moment(dateRange.endDate, DMYFORMAT).format(
      HalfMonthDateYearFormat,
    );
    return (
      <Text style={{margin: MarginConstants.halfTab, color: Colors.lightBlack}}>
        {`${sDate} - ${eDate}`}
      </Text>
    );
  };

  let filterAction = (range_, callBackHandler) => {
    const pushAction = StackActions.push(translate('date_filter.date_range'), {
      range: range_,
      setRange: callBackHandler,
    });
    navigation.dispatch(pushAction);
  };

  return (
    <Pressable onPress={() => filterAction(range, onDateRangeChangeHandler)}>
      <View style={styles.filterBox}>
        <GetDateText dateRange={range} />
        <DateIcon />
      </View>
    </Pressable>
  );
};

export const Avatar = ({title, style}) => {
  return (
    <View style={[styles.avatarView, {...style}]}>
      <Text style={styles.avatarText}>{getNameInitials(title ?? 'NA')}</Text>
    </View>
  );
};

export const FilterIcon = ({onPressFilter}) => {
  return (
    <Pressable onPress={onPressFilter}>
      <IonIcons name="funnel" size={20} color={Colors.lightBlack} />
    </Pressable>
  );
};
export const SortIcon = ({onPressFilter}) => {
  return (
    <Pressable onPress={onPressFilter}>
      <MaterialIcon name="sort" size={24} color={Colors.lightBlack} />
    </Pressable>
  );
};

export const HeaderFilter = ({
  hasFilterIcon = true,
  hasSortIcon = false,
  dateRange,
  onPressFilter,
  onPressDateRange,
  endComponent,
}) => {
  return (
    <View style={styles.filterAndSearchBox}>
      {hasFilterIcon && <FilterIcon onPressFilter={onPressFilter} />}
      {hasSortIcon && <SortIcon onPressFilter={onPressFilter} />}

      <FilterDateBox
        range={dateRange}
        onDateRangeChangeHandler={onPressDateRange}
      />
      {endComponent}
      {/* <View
        style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
        {getSearchIcon()}
      </View> */}
    </View>
  );
};
const SegmentSelector = ({segmentName, segmentList, onPressHandle}) => {
  const segmentSelectorStyles = StyleSheet.create({
    container: {flex: 1},
    appbarTitle: {fontSize: TextSizes.primary, color: Colors.white},
    innerContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
  return segmentList && segmentList.length ? (
    <View style={segmentSelectorStyles.container}>
      <Pressable
        // onPress={() => {
        //   dispatch(setSegmentSelectorOpen(true));
        // }}
        onPress={onPressHandle}>
        <View style={segmentSelectorStyles.innerContainer}>
          <Text style={segmentSelectorStyles.appbarTitle}>{segmentName}</Text>

          <SimpleLineIcon
            name={'arrow-down'}
            size={15}
            color={Colors.darkGrey}
          />
        </View>
      </Pressable>
      {/* <MainDropDown
    options={segmentOptions.map((item) => item.segmentName)}
    defaultText={selectedSegment.segmentName}
    onSelection={(index) => {
      console.log(
        `Selected : ${JSON.stringify(segmentOptions[index])}`,
      );
      //////
      dispatch(setSegment(segmentOptions[index]));

      // dispatch({
      //   type: SEGMENT_SELECTED,
      //   payload: segmentOptions[index],
      // });

      // updateSegment(`${segmentOptions[index]}`);
      //////
    }}
  />*/}
    </View>
  ) : (
    <Text style={segmentSelectorStyles.appbarTitle}>{segmentName}</Text>
  );
};

export const RenderExitAlert = props => {
  return Alert.alert(
    translate('exit_app'),
    translate('exit_message'),
    [
      {
        text: translate('yes'),
        onPress: () => {
          props.showExitAlert(false);
          BackHandler.exitApp();
        },
      },
      {
        text: translate('no'),
        onPress: () => {
          props.showExitAlert(false);
        },
      },
    ],
    {cancelable: false},
  );
};

export const CloseLoopTicketsTabs = props => (
  <CloseLoopTicketsTab.Navigator
    tabBarOptions={{
      labelStyle: {width: width / 3, fontSize: TextSizes.secondary},
      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: Dimensions.get('window').width},
      tabStyle: {height: 1.5 * PaddingConstants.tab4},
      activeTintColor: Colors.accent,
      inactiveTintColor: Colors.primary,
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.new')}
      component={DetractorScenes}
      initialParams={{dataCount: 0}}
    />
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.open')}
      component={DetractorScenes}
      initialParams={{dataCount: 1}}
    />
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.escalated')}
      component={DetractorScenes}
      initialParams={{dataCount: 3}}
    />
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.resolved')}
      component={DetractorScenes}
      initialParams={{dataCount: 2}}
    />
  </CloseLoopTicketsTab.Navigator>
);

export const DateRangeTabStack = props => (
  <DateRangeTab.Navigator
    tabBarOptions={{
      labelStyle: {
        color: Colors.primary,
        width: width / 2,
        fontSize: TextSizes.secondary,
      },
      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: Dimensions.get('window').width},
      tabStyle: {height: 1.3 * PaddingConstants.tab4},
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <DateRangeTab.Screen
      name={translate('date_filter.month')}
      component={DashboardDateFilter}
      initialParams={{
        range: props.route.params.range,
        setRange: props.route.params.setRange,
      }}
    />
    <DateRangeTab.Screen
      name={translate('date_filter.custom')}
      component={DashboardDateFilter}
      initialParams={{
        range: props.route.params.range,
        setRange: props.route.params.setRange,
      }}
    />
  </DateRangeTab.Navigator>
);

export const TicketLogTabStack = props => (
  <TicketLogTab.Navigator
    tabBarOptions={{
      labelStyle: {width: width / 3, fontSize: TextSizes.semiSecondary},
      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: Dimensions.get('window').width},
      tabStyle: {height: 1.5 * PaddingConstants.tab4},
      activeTintColor: Colors.accent,
      inactiveTintColor: Colors.primary,
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <TicketLogTab.Screen
      name={translate('close_loop.overview')}
      component={TicketOverview}
      initialParams={{
        ticketID: props.route.params.ticketID,
        parentRoute: props.route.params.parentRoute,
      }}
    />
    <TicketLogTab.Screen
      name={translate('close_loop.comments')}
      component={TicketComments}
      initialParams={{
        ticketID: props.route.params.ticketID,
        parentRoute: props.route.params.parentRoute,
      }}
    />
    <TicketLogTab.Screen
      name={translate('close_loop.logs')}
      component={TicketComments}
      initialParams={{
        ticketID: props.route.params.ticketID,
        parentRoute: props.route.params.parentRoute,
      }}
    />
  </TicketLogTab.Navigator>
);

const CommonScreens = RootStack => {
  return [
    <RootStack.Screen
      key={'Date Range'}
      name={translate('date_filter.date_range')}
      component={DateRangeTabStack}
      options={({navigation, route}) => ({
        headerLeft: props => <HeaderBackLeft />,
        headerRight: props => <SaveDashboardDate {...props} route={route} />,
      })}
    />,
    <RootStack.Screen
      key={'Ticket Details'}
      name={translate('close_loop.ticket_details')}
      component={TicketLogTabStack}
      options={({navigation, route}) => ({
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        headerRight: props =>
          route.state && route.state.index !== 0 ? <View /> : <EditTicket />,
      })}
    />,
    <RootStack.Screen
      name={translate('responses.feedback_details')}
      key={'Feedback Details'}
      component={FeedbackDetails}
      options={({navigation, route}) => ({
        title: translate('close_loop.view_response'),
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
      })}
    />,
    <RootStack.Screen
      key={'Update Ticket'}
      name={translate('close_loop.update_ticket')}
      component={UpdateTicket}
      options={({navigation, route}) => ({
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
      })}
    />,

    <RootStack.Screen
      key={translate('dashboard.segment')}
      name={translate('dashboard.segment')}
      component={SelectSegmentScreen}
      options={({navigation, route}) => ({
        headerShown: false,
        // headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
      })}
    />,
    <RootStack.Screen
      key={translate('responses.new_ticket')}
      name={translate('responses.new_ticket')}
      component={CreateTicket}
      options={({navigation, route}) => ({
        // headerLeft: (props) => <View />,
        // headerRight: (props) => <CloseButton />,
        headerShown: false,
        // gestureDirection: 'vertical',
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
        // transitionSpec: {
        //   open: TransitionSpecs.FadeInFromBottomAndroidSpec,
        //   close: TransitionSpecs.TransitionIOSSpec,
        // },
      })}
    />,
  ];
};

export default CommonScreens;

const styles = StyleSheet.create({
  leftHeaderButton: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  rightHeaderButton: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    textAlignVertical: 'center',
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.regular,
    paddingTop: 5,
    paddingLeft: 5,
  },
  panelHeaderContainer: {
    flex: 1,

    padding: MarginConstants.tab1,
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  panelHandleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  panelHandle: {
    height: 4,
    width: width / 5,
    backgroundColor: Colors.darkGrey,
  },
  header: {
    marginHorizontal: MarginConstants.tab2,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
    marginVertical: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  checkBoxRow: {
    flexDirection: 'row',
    padding: PaddingConstants.halfTab,
    alignItems: 'center',
  },
  checkBoxText: {
    color: Colors.filterIconColor,
    textAlignVertical: 'center',
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
  },
  filterBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  filterAndSearchBox: {
    flexDirection: 'row',

    alignItems: 'center',
    paddingVertical: PaddingConstants.halfTab,
    paddingHorizontal: PaddingConstants.tab1,

    backgroundColor: Colors.white,
  },

  avatarView: {
    borderRadius: 50,
    height: MarginConstants.tab3,
    width: MarginConstants.tab3,
    backgroundColor: Colors.borderColor,
    marginHorizontal: MarginConstants.halfTab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._600,
    fontSize: TextSizes.secondary,
  },
});
