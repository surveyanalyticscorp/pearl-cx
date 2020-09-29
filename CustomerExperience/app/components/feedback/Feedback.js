import React, {useState, useEffect} from 'react';
import {Text, View, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import FeedbackCell from './FeedbackCells';
import {MarginConstants} from '../../styles/margin.constants';
import {StackActions} from '@react-navigation/native';
import {Colors} from '../../styles/color.constants';
import {clearError, showLoading} from '../../redux/actions';
import {getFeedbackList, setFeedbackRangeFilter} from '../../redux/actions/feedback.actions';
import {connect} from 'react-redux';
import moment from 'moment';
import QPSpinner from '../../widgets/QPSpinner';
import {showMessage} from 'react-native-flash-message';
import CalendarScreen from '../view/calendarScreen';
import {isObjectEmpty} from '../../Utils/Utility';
import ArrayUtils from '../../Utils/ArrayUtils';

function Feedback(props){

    let month = props.feedbackRange.month ? props.feedbackRange.month : moment().month() + 1; //Need to check as it returns month number starting 0
    let year = props.feedbackRange.year ? props.feedbackRange.year : moment().year();

    const [selectedRowID, setSelectedRowID] = useState(0);
    const [calendar, setCalendar] = useState(false);
    const [selectedYear, setSelectedYear] = useState({month: month, year: year});
    let [feedbackData, setFeedbackData] = useState([]);

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

    let openFeedbackCalendar = () => {
        setCalendar(true)
    };

    useEffect(() => {
        props.navigation.dangerouslyGetParent().setParams({'openCalendar': openFeedbackCalendar});
    }, []);

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

    const _onPressRow = (data) => {
        const pushAction = StackActions.push('Feedback Details', {
            data: data,
            ticketStatus: props.feedback.cxTicketStatusValues,
            token: props.authToken
        });
        props.navigation.dispatch(pushAction);
    };

    const _renderRow = ({item}) => {
        const selected = selectedRowID === item.responseSetID;
        let ticketStatuses = props.feedback.cxTicketStatusValues;
        return (
            <FeedbackCell
                item={item}
                onSelect={() => _onPressRow(item)}
                origin="List"
                ticketStatuses={ticketStatuses}
                selected={selected}
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

    let renderCalendarView = () => {
        return <CalendarScreen
            showCalendar={calendar}
            closeCalendar={() => {
                setCalendar(false);
            }}
            selectedDate={selectedYear}
            onSubmit={(selectedYear) => {
                // setFeedbackAPI(true);
                setSelectedYear(selectedYear);
                setCalendar(false);
                props.setRange(selectedYear);
            }}
        />
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
                <SafeAreaView style={styles.container}>
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
                    />
                </SafeAreaView>
            );
        }
        return <View/>
    };

    const renderFeedbackStatus = () => {

        return props.isLoading ? renderSpinner() : renderFeedbackList()
    };

    return calendar ? renderCalendarView() : renderFeedbackStatus();
}

const mapStateToProps = state => {
    return {
        feedback: state.feedback.response,
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        authToken: state.global.authToken,
        feedbackRange: state.feedback.range
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

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: MarginConstants.tab1,
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
