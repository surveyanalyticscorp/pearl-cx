import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import FeedbackCell from './FeedbackCells';
import {MarginConstants} from '../../styles/margin.constants';
import {StackActions} from '@react-navigation/native';
import {Colors} from '../../styles/color.constants';
import {clearError, showLoading} from '../../redux/actions';
import {getFeedbackList, setFeedbackRangeFilter} from '../../redux/actions/feedback.actions';
import {connect} from 'react-redux';
import QPSpinner from '../../widgets/QPSpinner';
import {showMessage} from 'react-native-flash-message';
import {isObjectEmpty} from '../../Utils/Utility';
import ArrayUtils from '../../Utils/ArrayUtils';
import {TextSizes} from '../../styles/textsize.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FilterHeader from '../FilterHeader';

const FeedbackTab = createMaterialTopTabNavigator();

export default function Feedback(props){

    const renderFeedbackView = () => {
        return(
            <SafeAreaView style={styles.safeAreaView}>
                <FilterHeader actionOnArrowClick = {() => {}}
                              callDataAPI = {() => {}}
                              {...props}
                />
                <FeedbackTabStack />
            </SafeAreaView>
        )
    };
    return renderFeedbackView();
}

const FeedbackTabStack = props => (
    <FeedbackTab.Navigator tabBarOptions={{
        labelStyle: {color: Colors.primary, width: useWindowDimensions().width/4, fontSize: TextSizes.secondary},
        indicatorStyle: {backgroundColor: Colors.accent},
        style:{backgroundColor: Colors.white, width: '100%'},
        initialLayout: {width: useWindowDimensions().width},
        tabStyle:{height: 1.7*PaddingConstants.tab4}
    }}
                           keyboardDismissMode={'auto'}
    >
        <FeedbackTab.Screen name="All" component={FeedbackTabScreen} />
        <FeedbackTab.Screen name="Detractor" component={FeedbackTabScreen} />
        <FeedbackTab.Screen name="Passive" component={FeedbackTabScreen} />
        <FeedbackTab.Screen name="Promoter" component={FeedbackTabScreen} />
    </FeedbackTab.Navigator>
);

const renderFeedbackScene = (props) => {
    // let month = props.feedbackRange.month ? props.feedbackRange.month : moment().month() + 1; //Need to check as it returns month number starting 0
    // let year = props.feedbackRange.year ? props.feedbackRange.year : moment().year();
    let [feedbackData, setFeedbackData] = useState([]);
    const [selectedYear, setSelectedYear] = useState({month: '10', year: '2020'});

    let getFeedbackData = () => {
        const data = {
            pageOffset: 0,
            sentiment: 'All',
            month: selectedYear.month + '',
            year: selectedYear.year + '',
        };
        props.getFeedbackList(
            data,
            props.authToken,
        );
    };

    useEffect(() => {
        getFeedbackData()
    }, [selectedYear]);


    useEffect(() => {
        getItems()
    },[props.feedback]);

    useEffect(() => {
        if (props.isError) {
            showMessage({
                message: props.errorMessage.message,
                type: 'error',
                icon: 'auto',
            });
            let timer = setTimeout(() => {
                props.clearError();
            }, 1000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [props.isError]);

    useEffect(() => {
        if(props.feedback.allResponses){
            props.showLoading(false);
        }
    },[props.feedback.allResponses]);


    const getItems = () => {
        if(props.route) {
            if (props.route.name === 'All') {
                setFeedbackData(props.feedback.allResponses);
            } else {
                let responses = props.feedback.allResponses;
                if(ArrayUtils.isNotEmpty(responses)) {
                    setFeedbackData(responses.filter(res => res.sentiment === props.route.name));
                } else {
                    setFeedbackData([])
                }
            }
        }
    };

    const _onPressRow = (data) => {
        const pushAction = StackActions.push('Feedback Details', {
            data: data,
            ticketStatus: props.feedback.cxTicketStatusValues,
            token: props.authToken
        });
        props.navigation.dispatch(pushAction);
    };

    const _renderRow = ({item}) => {
        let ticketStatuses = props.feedback.cxTicketStatusValues;
        return (
            <FeedbackCell
                item={item}
                onSelect={() => _onPressRow(item)}
                origin="List"
                ticketStatuses={ticketStatuses}
            />
        );
    };

    const renderNoDataFound = () => {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.emptyText}>No feedbacks received.</Text>
            </View>
        );
    };

    let renderSpinner = () => {
        return (
            <View style={styles.loading}>
                <QPSpinner/>
            </View>
        )
    };

    let renderFeedbackList = () => {
        if (!isObjectEmpty(props.feedback)) {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={feedbackData}
                        keyExtractor={item => item.responseSetID+''}
                        renderItem={_renderRow}
                        // onEndReached={onEndReached}
                        onEndReachedThreshold={0.01}
                        refreshing={false}
                        ListEmptyComponent={renderNoDataFound}
                        onRefresh={() => {
                            setSelectedYear(props.feedbackRange)
                        }}
                        initialNumToRender={10}
                    />
                </View>
            );
        }
        return <View/>
    };

    return props.isLoading ? renderSpinner() : renderFeedbackList()

};


const mapStateToProps = state => {
    return {
        feedback: state.feedback.response,
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        authToken: state.global.authToken,
        feedbackRange: state.feedback.range,
        range: state.dashboard.range //nehal temp
    };
};

const mapDispatchToProps = dispatch => ({
    clearError: () => {
        dispatch(clearError(false));
    },
    getFeedbackList: (data, token) => {
        dispatch(showLoading(true));
        dispatch(getFeedbackList(data, token));
    },
    showLoading: (flag) => {
        dispatch(showLoading(flag));
    },
    setRange: (range) => {
        dispatch(setFeedbackRangeFilter(range))
    }
});

const FeedbackTabScreen = connect(mapStateToProps, mapDispatchToProps)(renderFeedbackScene);

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginTop: MarginConstants.tab1
    },
    emptyView: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    emptyText: {
        color: Colors.primary,
        fontSize: 16
    },
    counterContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterTitle: {
        fontFamily: 'System',
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
    },
    counterText: {
        fontFamily: 'System',
        fontSize: 36,
        fontWeight: '400',
        color: '#000',
    },
    buttonText: {
        fontFamily: 'System',
        fontSize: 50,
        fontWeight: '300',
        color: '#007AFF',
        marginLeft: 40,
        marginRight: 40,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});


// const onEndReached = () => {
//     // Checking if the list has responses in multiples of 10
//     // if((props.feedbacks.lastAddedCount > 0 && this.props.feedbacks.lastAddedCount % 10 === 0   ) && !this.state.isLoadingTail)
//     //   this.setState({
//     //     isLoadingTail: true
//     //   }, ()=>{
//     //     this.getFeedbackList(false);
//     //   })
// };
