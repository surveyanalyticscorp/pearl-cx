import {StyleSheet, TouchableOpacity, View, TextInput, Text, FlatList} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {PaddingConstants} from '../../styles/padding.constants';
import {Colors} from '../../styles/color.constants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Sizes} from '../../styles/Size.constant';
import {connect} from 'react-redux';
import {MarginConstants} from '../../styles/margin.constants';
import QPSpinner from '../../widgets/QPSpinner';
import {StackActions} from '@react-navigation/native';
import FeedbackCell from './FeedbackCells';
import {TextSizes} from '../../styles/textsize.constants';

function SearchFeedback(props) {

    let [searchText, onChangeText] = useState('');
    let [responseData, setResponseData] = useState([]);
    let [showLoader, setShowLoader] = useState(false);
    let pageCount = useRef("-1");

    useEffect(() => {
        if(showLoader) {
            // call API
        }
    },[responseData]);

    useEffect(() => {
        if(showLoader) {
            setResponseData([])
        }
    },[showLoader]);

    const renderNoDataFound = () => {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.emptyText}>No feedbacks received</Text>
            </View>
        );
    };

    const _onPressRow = (data) => {
        const pushAction = StackActions.push('Feedback Details', {
            data: data,
            // ticketStatus: feedbackForm.ticketStatus,
            // token: feedbackForm.token
        });
        props.navigation.dispatch(pushAction);
    };

    const renderRow = (rowItem) => {
        return (
            <FeedbackCell
                item={item}
                onSelect={() => _onPressRow(item)}
                origin="List"
                // ticketStatuses={feedbackForm.ticketStatus}
                {...props}
            />
        );
    };

    let renderFeedback = () => {
        return (
            <View style={styles.container}>

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
            {showLoader ? renderSpinner() : renderFeedback()}
        </View>
    )

}

const mapStateToProps = state => {
    return {
        isLoading: state.global.isLoading,
        authToken: state.global.authToken,
        range: state.global.range
    };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFeedback);


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
        paddingTop: 1.3*PaddingConstants.tab4

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

