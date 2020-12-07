import {StyleSheet, TouchableOpacity, View, TextInput, Text, FlatList} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Sizes} from '../../../styles/Size.constant';
import {Colors} from '../../../styles/color.constants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../../Utils/AppConstants';
import {apiHandler} from '../../../api/ApiHandler';
import {connect} from 'react-redux';
import {dashboardStyles} from '../dashboard.style';
import TicketWidget from './TicketWidget';
import {TextSizes} from '../../../styles/textsize.constants';
import QPSpinner from '../../../widgets/QPSpinner';
import ActionButton from 'react-native-action-button';
import ArrayUtils from '../../../Utils/ArrayUtils';

function SearchTicket(props) {

    let [searchText, onChangeText] = useState('');
    let [responseData, setResponseData] = useState([]);
    let [showLoader, setShowLoader] = useState(false);
    let pageCount = useRef("-1");

    useEffect(() => {
        showLoader && setShowLoader(false);
    },[responseData]);

    const renderNoDataFound = () => {
        return (
            <View style={dashboardStyles.emptyView}>
                <Text style={dashboardStyles.detractorEmptyText}> No tickets</Text>
            </View>
        );
    };

    const renderRow = (rowItem) => {
        let commentText = rowItem.item.comment.replace(/\n/g, " ");
        return (
            <TicketWidget
                comment={commentText}
                item={rowItem.item}
                {...props}
            />
        );
    };

    const onEndReached = () => {
        getDetractorAPI()
    };

    const getDetractorAPI = () => {
            let count = parseInt(pageCount.current) + 1 + '';
            pageCount.current = count;
        let params = {
            pageOffset: count,
            startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
            endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT),
            searchText: searchText
        };
        apiHandler.getCXDetractorTicket(
            props.authToken,
            params,
            response => {
                showLoader && setShowLoader(false);
                if(response.body && response.body.tickets && ArrayUtils.isNotEmpty(response.body.tickets)) {
                    let data = ArrayUtils.isEmpty(responseData) ? response.body.tickets : [...responseData, ...response.body.tickets];
                    setResponseData(data);
                    pageCount.current = response.body.pageOffset
                }
            },
            error => {
                showLoader && setShowLoader(false);
            },
        );
    };

    let renderDetractorTickets = () => {
        return (
            <View style={dashboardStyles.container}>
                <FlatList
                    contentContainerStyle={{flexGrow: 1, backgroundColor: 'transparent'}}
                    data={responseData}
                    keyExtractor={item => item.ticketID+''}
                    renderItem={renderRow}
                    onEndReachedThreshold={0.01}
                    refreshing={false}
                    onEndReached={onEndReached}
                    ListEmptyComponent={renderNoDataFound}
                    ListFooterComponent={() => <View style={{paddingBottom: PaddingConstants.tab2}}/>}
                />
                <ActionButton
                    buttonColor= {Colors.accent}
                    buttonTextStyle={{fontSize: TextSizes.donutPercentText}}
                    onPress={() => {
                        props.navigation.navigate('New Ticket');
                    }}
                />
            </View>
        );
    };

    let renderSpinner = () => {
        return (
            <View style={dashboardStyles.loading}>
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
                    ArrayUtils.isNotEmpty(responseData) && setResponseData([]);
                    setShowLoader(true);
                    getDetractorAPI()
                }}
                placeholderTextColor={Colors.white}
                placeholder={'Search email or response ID'}
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
        <View style={styles.container}>
            {renderNavigationHeader()}
            {showLoader ? renderSpinner() : renderDetractorTickets()}
        </View>
    )

}

const mapStateToProps = state => {
    return {
        isLoading: state.global.isLoading,
        authToken: state.global.authToken,
        storeId: state.dashboard.dashboardData.primaryStoreId,
        range: state.global.range
    };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchTicket);


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        width:'100%',
        flexDirection: 'row',
        backgroundColor: Colors.accent,
        alignItems: "center",
        justifyContent: 'space-between',
        paddingTop: 1.5*PaddingConstants.tab4

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

    }
});
