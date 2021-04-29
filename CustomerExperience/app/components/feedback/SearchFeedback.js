import {StyleSheet, TouchableOpacity, View, TextInput, Text, FlatList, SafeAreaView} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {PaddingConstants} from '../../styles/padding.constants';
import {Colors} from '../../styles/color.constants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Sizes} from '../../styles/Size.constant';
import {useSelector} from 'react-redux';
import {MarginConstants} from '../../styles/margin.constants';
import QPSpinner from '../../widgets/QPSpinner';
import {StackActions} from '@react-navigation/native';
import FeedbackCell from './FeedbackCells';
import {TextSizes} from '../../styles/textsize.constants';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import {apiHandler} from '../../api/ApiHandler';
import {showErrorFlashMessage} from '../../Utils/Utility';
import ArrayUtils from '../../Utils/ArrayUtils';
import {translate} from "../../Utils/MultilinguaUtils";

export default function SearchFeedback(props) {
    const authToken = useSelector(state => state.global.authToken);
    const range = useSelector(state => state.global.range);

    let [searchText, onChangeText] = useState('');
    let [responseData, setResponseData] = useState([]);
    let [showLoader, setShowLoader] = useState(false);
    let [ticketStatus, setTicketStatus] = useState([]);

    let pageCount = useRef("-1");

    useEffect(() => {
        if(showLoader) {
            getFeedbackData()
        }
    },[responseData]);

    useEffect(() => {
        if(showLoader) {
            setResponseData([])
        }
    },[showLoader]);

    let getFeedbackData = () => {
        let count = parseInt(pageCount.current) + 1 + '';
        pageCount.current = count;
        const data = {
            pageOffset: count,
            sentiment: 'All',
            startDate: moment(range.startDate, DMYFORMAT).format(YMDFORMAT),
            endDate: moment(range.endDate, DMYFORMAT).format(YMDFORMAT),
            searchText: searchText
        };
        apiHandler.getFeedbackResponseList(authToken, data, (response) => {
            showLoader && setShowLoader(false);
            if(response.body && response.body.allResponses && ArrayUtils.isNotEmpty(response.body.allResponses)) {
                let data = ArrayUtils.isEmpty(responseData) ? response.body.allResponses : [...responseData, ...response.body.allResponses];
                setTicketStatus(response.body.cxTicketStatusValues);
                setResponseData(data);
            }
        }, (error) => {
            showLoader && setShowLoader(false);
            showErrorFlashMessage(error.message)
        });
    };

    const onEndReached = () => {
        getFeedbackData()
    };

    const renderNoDataFound = () => {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.emptyText}>{translate("responses.no_feedback_received")}</Text>
            </View>
        );
    };

    const _onPressRow = (data) => {
        const pushAction = StackActions.push(translate("responses.feedback_details"), {
            data: data,
            ticketStatus: ticketStatus,
            token: authToken
        });
        props.navigation.dispatch(pushAction);
    };

    const renderRow = ({item}) => {
        return (
            <FeedbackCell
                item={item}
                onSelect={() => _onPressRow(item)}
                origin="List"
                ticketStatuses={ticketStatus}
                {...props}
            />
        );
    };

    let renderFeedback = () => {
        return (
            <View style={[styles.container,{backgroundColor: Colors.white}]}>
                <FlatList
                    data={responseData}
                    keyExtractor={item => item.responseSetID+''}
                    renderItem={renderRow}
                    onEndReachedThreshold={0.01}
                    refreshing={false}
                    onEndReached={onEndReached}
                    ListEmptyComponent={renderNoDataFound}
                    ListFooterComponent={() => <View style={{paddingBottom: PaddingConstants.tab2}}/>}
                />
            </View>
        );
    };

    let renderSpinner = () => {
        return (
            <View style={styles.loading}>
                <QPSpinner />
            </View>
        )
    };

    let renderSearchBar = () => {
        return(
            <TextInput
                style={styles.textInputContainer}
                onChangeText={text => {
                    onChangeText(text);
                }}
                onSubmitEditing={() => {
                    pageCount.current = "-1";
                    setShowLoader(true);
                }}
                placeholderTextColor={Colors.white}
                placeholder={translate("responses.search_placeholder")}
                value={searchText}
                autoFocus={false}
                autoCapitalize={'none'}
                clearButtonMode={'while-editing'}
            />
        )
    };

    let renderHeaderBackLeft = () => {
        return (
            <View style={styles.leftHeaderButton}>
                <TouchableOpacity
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={() => {
                        props.navigation.goBack()
                    }}>
                    <Icon name="arrow-left" size={Sizes.icons} color= {Colors.white}/>
                </TouchableOpacity>
            </View>
        );
    };

    let renderNavigationHeader = () => {
        return (
            <View style={styles.headerContainer}>
                {renderHeaderBackLeft()}
                {renderSearchBar()}
            </View>
        )
    };

    return (
        <SafeAreaView forceInset={{bottom: 'never', top:'never'}} style={styles.container}>
            {renderNavigationHeader()}
            {showLoader ? renderSpinner() : renderFeedback()}
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: Colors.accent,
    },
    headerContainer: {
        width:'100%',
        flexDirection: 'row',
        backgroundColor: Colors.accent,
        alignItems: "center",
        justifyContent: 'space-between',
        paddingTop: 1.3 * PaddingConstants.tab1

    },
    leftHeaderButton: {
        marginHorizontal: MarginConstants.halfTab,
        height:30,
        paddingHorizontal: PaddingConstants.tab1
    },
    textInputContainer: {
        flex:1,
        backgroundColor: 'rgba(85, 149, 224, 0.7)',
        marginRight: MarginConstants.tab2,
        paddingHorizontal: PaddingConstants.tab2,
        color: Colors.white,
        height:35,
        marginBottom: MarginConstants.tab1
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
        fontSize: TextSizes.primary
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
});

