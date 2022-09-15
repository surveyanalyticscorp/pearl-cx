import React, {useContext, useEffect, useState} from 'react';
import {
  // Alert,
  // BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import FeedbackCell from './FeedbackCells';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {clearError, setError, setRangeFilter} from '../../redux/actions';
import {connect} from 'react-redux';
import QPSpinner from '../../widgets/QPSpinner';
import {showErrorFlashMessage, usePrevious} from '../../Utils/Utility';
import ArrayUtils from '../../Utils/ArrayUtils';
import {TextSizes} from '../../styles/textsize.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import FilterHeader from '../FilterHeader';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import SafeAreaView from 'react-native-safe-area-view';
import {apiHandler} from '../../api/ApiHandler';
import {FontFamily} from '../../styles/font.constants';
import {Sizes} from '../../styles/Size.constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {dashboardStyles} from '../dashboard/dashboard.style';
import {translate} from '../../Utils/MultilinguaUtils';
// import MainDropDown from '../../widgets/drop-down/MainDropDown';
import {FabAddButton} from '../../routes/CommonScreen';
const FeedbackTab = createMaterialTopTabNavigator();
const FormContext = React.createContext();

function Feedback(props) {
  let [feedbackData, setFeedbackData] = useState([]);
  let [ticketStatus, setTicketStatus] = useState([]);
  let [pageOffset, setPageOffset] = useState(0);
  let [pagination, setPagination] = useState(false);
  let [showLoader, setShowLoader] = useState(false);
  let [sortingText, setSortingText] = useState({label: 'Date', index: 0});
  let prevRangeRef = usePrevious(props.range);
  let sortingAttribute = ['Date', 'Score', 'Segment', 'Email'];

  let getFeedbackData = () => {
    /**
     * To avoid multiple API calls for each tab
     * */
    if (showLoader || pagination) {
      const data = {
        pageOffset: pageOffset,
        sentiment: 'All',
        startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
        endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT),
        filterText: sortingAttribute[sortingText.index].toLowerCase(),
      };
      apiHandler.getFeedbackResponseList(
        props.authToken,
        data,
        (response) => {
          let data = pageOffset === 0 ? [] : [...feedbackData];
          data = [...data, ...response.body.allResponses];
          data = [...new Set(data)];
          setTicketStatus(response.body.cxTicketStatusValues);
          setFeedbackData(data);
          console.log('pageOffset data count ' + data.length);
          showLoader && setShowLoader(false);
          pagination && setPagination(false);
        },
        (error) => {
          setShowLoader(false);
          props.setError(error);
          showErrorFlashMessage(error.message);
        },
      );
    }
  };

  useEffect(() => {
    setShowLoader(true);
  }, []);

  useEffect(() => {
    if (pageOffset === 0) {
      ArrayUtils.isNotEmpty(feedbackData) && setFeedbackData([]);
    } else {
      getFeedbackData();
    }
  }, [pageOffset]);

  useEffect(() => {
    showLoader && getFeedbackData();
  }, [showLoader]);

  useEffect(() => {
    if (prevRangeRef && prevRangeRef !== props.range) {
      if (pageOffset === 0) {
        setFeedbackData([]);
        setShowLoader(true);
      } else {
        setPageOffset(0);
        setShowLoader(true);
      }
    }
  }, [props.range]);

  useEffect(() => {
    pagination && setPageOffset(pageOffset + 1);
  }, [pagination]);

  let onEndReached = () => {
    !pagination && setPagination(true);
  };

  let onRefresh = () => {
    if (pageOffset === 0) {
      setFeedbackData([]);
      setShowLoader(true);
    } else {
      setPageOffset(0);
      setShowLoader(true);
    }
  };

  let setSortText = (text, index) => {
    setSortingText({label: text, index: index});
  };

  let renderSpinner = () => {
    return (
      <View style={styles.loading}>
        <QPSpinner />
      </View>
    );
  };

  const renderFeedbackView = () => {
    const segmentOptions = ['Main Segment', 'Child Segment'];

    return (
      <SafeAreaView
        forceInset={{top: 'never', bottom: 'never'}}
        style={styles.safeAreaView}>
        {/* <FilterHeader
          actionOnArrowClick={() => {
            setFeedbackData([]);
            setPageOffset(0);
            setShowLoader(true);
          }}
          callDataAPI={() => {
            setFeedbackData([]);
            setPageOffset(0);
            setShowLoader(true);
          }}
          {...props}
        /> */}

        <View
          style={{
            marginHorizontal: '0%',
            marginVertical: '0%',
            backgroundColor: Colors.fullTransparent,
          }}>
          {/* <MainDropDown
            header={''}
            options={segmentOptions}
            defaultText={segmentOptions[0]}
            onSelection={(index) => {
              console.log(`Selected : ${segmentOptions[index]}`);
            }}
          /> */}
        </View>
        <FormContext.Provider
          value={{
            ticketStatus: ticketStatus,
            feedbackData: feedbackData,
            onFeedbackEndReached: onEndReached,
            onRefresh: onRefresh,
            range: props.range,
            token: props.authToken,
            sortingText: sortingText.label,
            setSortingText: setSortText,
          }}>
          <FeedbackTabStack />
        </FormContext.Provider>
        {showLoader && renderSpinner()}
      </SafeAreaView>
    );
  };
  return renderFeedbackView();
}

const FeedbackTabStack = () => (
  <FeedbackTab.Navigator
    tabBarOptions={{
      scrollEnabled: true,
      labelStyle: {
        width: useWindowDimensions().width / 4,
        fontSize: TextSizes.secondary,
      },
      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: useWindowDimensions().width},
      tabStyle: {height: 1.7 * PaddingConstants.tab4},
      activeTintColor: Colors.accent,
      inactiveTintColor: Colors.primary,
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <FeedbackTab.Screen
      name={translate('close_loop.all')}
      component={renderFeedbackScene}
      initialParams={{screenName: 'All'}}
    />
    <FeedbackTab.Screen
      name={translate('responses.detractor')}
      component={renderFeedbackScene}
      initialParams={{screenName: 'Detractor'}}
      options={{tabBarLabel: 'Dummy 1'}}
    />
    <FeedbackTab.Screen
      name={translate('responses.passive')}
      component={renderFeedbackScene}
      initialParams={{screenName: 'Passive'}}
      options={{tabBarLabel: 'Dummy 2'}}
    />
    <FeedbackTab.Screen
      name={translate('responses.promoter')}
      component={renderFeedbackScene}
      initialParams={{screenName: 'Promoter'}}
      options={{tabBarLabel: 'Dummy 3', title: 'Dummy 3'}}
    />
  </FeedbackTab.Navigator>
);

const renderFeedbackScene = (props) => {
  const feedbackForm = useContext(FormContext);
  let [list, setList] = useState(feedbackForm.feedbackData);
  let prevFeedbackRef = usePrevious(feedbackForm.feedbackData);
  let prevSortRef = usePrevious(feedbackForm.sortingText);
  //let [exitAlert, showExitAlert] = useState(false);

  useEffect(() => {
    if (prevFeedbackRef !== feedbackForm.feedbackData) {
      getData();
    }
  }, [feedbackForm.feedbackData]);

  useEffect(() => {
    if (prevSortRef !== feedbackForm.sortingText) {
      feedbackForm.onRefresh();
    }
  }, [feedbackForm.sortingText]);

  /*useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackPress);
        return function cleanup() {
            BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
        };
    },[]);

    let handleBackPress = () => {
        if(props.navigation.canGoBack()) {
            props.navigation.goBack();
        }else{
            showExitAlert(true);
        }
        return true
    };*/

  const _onPressRow = (data) => {
    props.navigation.navigate(translate('responses.feedback_details'), {
      data: data,
      ticketStatus: feedbackForm.ticketStatus,
      token: feedbackForm.token,
      parentRoute: translate('responses.responses'),
    });
  };

  let setResponseSorter = (value, index) => {
    feedbackForm.setSortingText(value, index);
  };

  let renderResponseFilterView = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          props.navigation.navigate(translate('responses.sort_by'), {
            setSorter: setResponseSorter,
            selectedSorter: feedbackForm.sortingText,
          });
        }}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <View style={styles.filterView}>
          <Icon
            name={'swap-vertical'}
            size={1.2 * Sizes.filterIcon}
            color={Colors.primary}
          />
          <Text style={styles.filterText}>{feedbackForm.sortingText}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const _renderRow = ({item}) => {
    console.log(`Feed back item: ${JSON.stringify(item)}`);

    return (
      <FeedbackCell
        item={item}
        onSelect={() => _onPressRow(item)}
        origin="List"
        ticketStatuses={feedbackForm.ticketStatus}
        {...props}
      />
    );
  };

  const renderNoDataFound = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>
          {translate('responses.no_feedback_received')}
        </Text>
      </View>
    );
  };

  let getData = () => {
    if (props.route.params.screenName === 'All') {
      let data = [...feedbackForm.feedbackData];
      setList(data);
    } else {
      let data = [
        ...feedbackForm.feedbackData.filter(
          (res) => res.sentiment === props.route.params.screenName,
        ),
      ];
      setList(data);
    }
  };

  const onFabHandler = () => {
    props.navigation.navigate(translate('responses.new_ticket'));
  };

  let renderFeedbackList = () => {
    return (
      <View style={dashboardStyles.container}>
        <FlatList
          data={list}
          renderItem={_renderRow}
          keyExtractor={(item) => item.responseSetID + ''}
          onEndReachedThreshold={0}
          onEndReached={feedbackForm.onFeedbackEndReached}
          refreshing={false}
          ListEmptyComponent={renderNoDataFound}
          onRefresh={feedbackForm.onRefresh}
          extraData={[list]}
          contentContainerStyle={styles.container}
          ListFooterComponent={() => (
            <View style={{paddingBottom: PaddingConstants.tab2}} />
          )}
          // ListHeaderComponent={renderResponseFilterView}
        />
        <FabAddButton onPress={onFabHandler} />
      </View>
    );
  };

  return renderFeedbackList();
};

const mapStateToProps = (state) => {
  return {
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
    authToken: state.global.authToken,
    range: state.global.range,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setError: (error) => {
    dispatch(setError(error));
  },
  clearError: () => {
    dispatch(clearError(false));
  },
  setRange: (range) => {
    dispatch(setRangeFilter(range));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    marginTop: MarginConstants.tab1,
  },
  emptyView: {
    flex: 1,
    marginTop: MarginConstants.tab3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    color: Colors.primary,
    fontSize: TextSizes.primary,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterView: {
    marginVertical: MarginConstants.halfTab,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    flexDirection: 'row',
  },
  filterText: {
    color: Colors.accent,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    textAlign: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
  },
});
