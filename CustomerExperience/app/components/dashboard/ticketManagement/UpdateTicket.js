import React, {useEffect, useState} from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import ModalDropdown from '../../../widgets/drop-down/ModalDropdown';
import {connect} from 'react-redux';
import {
    clearDetractorTicketDetails,
    getClosedLoopOwnerDetails,
    getClosedLoopSegmentDetails,
    getDashboardContent,
} from '../../../redux/actions/dashboard.actions';
import ArrayUtils from '../../../Utils/ArrayUtils';
import StringUtils from '../../../Utils/StringUtils';
import {updateClosedLoopTicket} from '../../../redux/sagas/ClosedLoopSaga';
import QPSpinner from '../../../widgets/QPSpinner';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../../Utils/AppConstants';
import {showErrorFlashMessage} from '../../../Utils/Utility';

function UpdateTicket(props) {
    let priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
    let statusOptions = ['New', 'Open', 'Resolved', 'Escalated'];

    let [comment, setComment] = useState('');
    let [priority, setPriority] = useState(priorityOptions[props.ticket.priority]);
    let [status, setStatus] = useState(statusOptions[props.ticket.status]);
    let [segmentOptions, setSegmentOptions] = useState([]);
    let [segment, setSegment] = useState(props.ticket.currentSegment.name);
    let [ownerOptions, setOwnerOptions] = useState([]);
    let [owner, setOwner] = useState(props.ticket.ticketOwner);
    let [validationError, setValidationError] = useState('');
    let [isLoading, setLoading] = useState(false);
    let [callOwnerAPI, setCallOwnerAPI] = useState(false);

    let fetchClosedLoopSegments = () => {
        let statusId = status === 'Escalated' ? 5 : statusOptions.findIndex(item => item === status);
        let params = {
            "statusID": statusId,
        };
        props.getClosedLoopSegments(props.authToken, params)
    };

    let fetchTicketOwners = () => {
        if (StringUtils.isNotEmpty(segment) && ArrayUtils.isNotEmpty(segmentOptions)) {
            let selectedSegment = segmentOptions.find(item => item.segmentName === segment);
            let selectedSegmentId = selectedSegment.segmentID;
            let params = {
                "segmentID": selectedSegmentId
            };
            props.getClosedLoopOwners(props.authToken, params)
        } else if (status === 'Escalated' && ArrayUtils.isEmpty(segmentOptions)) {
            setOwnerOptions([])
        }
    };

    useEffect(() => {
        fetchClosedLoopSegments()
    },[]);

    useEffect(() => {
        if(props.segments) {
            setSegmentOptions(props.segments);
        }
    },[props.segments]);

    useEffect( () => {
        fetchTicketOwners();
    }, [segmentOptions]);

    useEffect(() => {
        if(props.owners) {
            setOwnerOptions(props.owners);
        }
    },[props.owners]);

    useEffect(() => {
        fetchClosedLoopSegments()
    },[status]);

    useEffect(() => {
        if(callOwnerAPI) {
            fetchTicketOwners();
            setCallOwnerAPI(false)
        }
    },[segment]);

    let getDashboardData = () => {
        let data = {
            startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
            endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT)
        };
        props.getDashboardContent(props.authToken, data);
    };

    let setDataOnSelection = (header, options, selectedIndex) => {
        StringUtils.isNotEmpty(validationError) && setValidationError('');
        switch (header) {
            case 'Priority':
                setPriority(options[selectedIndex]);
                break;
            case 'Status':
                setSegment('');
                setOwner('');
                setStatus(options[selectedIndex]);
                break;
            case 'Segment':
                setCallOwnerAPI(true);
                setSegment(options[selectedIndex]);
                setOwner('');
                break;
            case 'Owner':
                setOwner(options[selectedIndex]);
                break;
        }
    };

    let renderDropDown = (header, options, defaultText) => {
        return (
            <View>
                <ModalDropdown
                    style={styles.modelDropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownStyle}
                    dropdownTextStyle={styles.dropdownText}
                    arrowIconColor={Colors.secondary}
                    options={options}
                    defaultValue={defaultText}
                    renderRow={dropdownRenderRow}
                    onSelect={(i) => {
                        setDataOnSelection(header, options, i)
                    }}
                />
            </View>
        )
    };

    let renderField = (header, options, defaultText) => {
        return (
            <View style={styles.row}>
                <Text style={styles.rowText}> {header} </Text>
                <View style={{position:'absolute', justifyContent: 'center', alignItems: 'center', right:10}}>
                    {renderDropDown(header, options, defaultText)}
                </View>
            </View>
        )
    };

    let getSegmentArray = () => {
        if(ArrayUtils.isNotEmpty(segmentOptions)) {
            return segmentOptions.map(item => item.segmentName)
        }
        return []
    };

    let getOwners = () => {
        if(ArrayUtils.isNotEmpty(ownerOptions)) {
            return ownerOptions.map(item => item.ownerName)
        }
        return []
    };

    let renderContainer = () => {
        let ownerDefaultText = StringUtils.isEmpty(owner) ? 'Select' : owner;
        let segmentDefaultText = StringUtils.isEmpty(segment) ? 'Select' : segment;
        return (
            <View style={styles.fieldContainer}>
                {renderField('Priority', priorityOptions, priority || 0)}
                {renderField('Status', statusOptions, status || 0)}
                {renderField('Segment', getSegmentArray(), segmentDefaultText)}
                {renderField('Owner', getOwners(), ownerDefaultText)}
            </View>
        )
    };

    let renderComment = () => {
        return (
            <View style={styles.commentContainer}>
                <TextInput
                    multiline
                    maxLength={500}
                    underlineAndroidColor={'transparent'}
                    autoFocus={false}
                    autoCorrect={false}
                    style={styles.commentText}
                    value={comment}
                    placeholder={'Additional Comment'}
                    onChangeText={text => {
                        StringUtils.isNotEmpty(validationError) && setValidationError('');
                        setComment(text);
                    }}
                />
            </View>
        )
    };

    let validationAction = (body) => {
        for (const [key, value] of Object.entries(body)) {
            if(key === 'managerComment' && StringUtils.isEmpty(value)) {
                setValidationError('Please add comment');
                return false
            }
        }
        return true
    };

    let updateAction = () => {
        let statusId = 0;
        if (status === 'Escalated') {
            statusId = 5 //To match web app
        } else if(StringUtils.isNotEmpty(status)) {
            statusId = statusOptions.findIndex(item => item === status)
        }

        let priorityId = priorityOptions.findIndex(item => item === priority);
        priorityId = priorityId === -1 ? 0 : priorityId;

        if(status === 'Escalated' && ArrayUtils.isEmpty(segmentOptions)) {
            let body = {
                "priorityID": priorityId,
                "statusID": statusId,
                "managerComment": comment,
                "ticketID": props.ticket.ticketID,
            };
            updateTicketAPIAction(body)
        } else {
            if(StringUtils.isEmpty(segment)) {
                setValidationError('Please select the segment')
            } else if(StringUtils.isEmpty(owner) || owner === 'Not Assigned') {
                setValidationError('Please select the owner')
            } else {
                let selectedSegment = segmentOptions.find(item => item.segmentName === segment);
                let selectedOwner = ownerOptions.find(item => item.ownerName === owner);

                let body = {
                    "priorityID": priorityId,
                    "statusID": statusId,
                    "managerComment": comment,
                    "ticketID": props.ticket.ticketID,
                    "segmentID": selectedSegment.segmentID,
                    "ownerID": selectedOwner.ownerID
                };
                updateTicketAPIAction(body)
            }
        }
    };

    let updateTicketAPIAction = (body) => {
        if (validationAction(body)) {
            setLoading(true);
            updateClosedLoopTicket(props.authToken, body, () => {
                setLoading(false);
                props.navigation.navigate('Dashboard');
                props.navigation.push('Tickets');
                getDashboardData();
                props.clearTicketDetails();
            }, (error) => {
                setLoading(false);
                showErrorFlashMessage(error)
            })
        }
    };


    let renderUpdateButton = () => {
        return isLoading ?
            <View style={styles.updateButton}>
                <QPSpinner spinnerColor={Colors.white}/>
            </View>
            :
            <View style={styles.updateButton}>
                <TouchableWithoutFeedback onPress={updateAction}>
                    <Text style={styles.updateText}> Update </Text>
                </TouchableWithoutFeedback>
            </View>
    };

    let renderValidationError = () => {
        return <Text style={styles.error}>{validationError}</Text>;
    };

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={'handled'}
            >
                {StringUtils.isNotEmpty(validationError) && renderValidationError()}
                <KeyboardAvoidingView behavior='position'
                                      style={styles.safeArea}
                                      keyboardVerticalOffset={Platform.select({
                                          ios: Platform.isPad ? -200 : -150,
                                          android: -200
                                      })}
                                      enabled>
                    <View style={styles.container}>
                        {renderContainer()}
                        {renderComment()}
                    </View>
                </KeyboardAvoidingView>
                <View style={styles.bottomContainer}>
                    {renderUpdateButton()}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function dropdownRenderRow (rowData, rowID, highlighted){
    return (
        <View style={[styles.dropdownRow, {backgroundColor: highlighted ? Colors.overlay : Colors.white}]}>
            <Text style={styles.dropdownText}>{rowData}</Text>
        </View>
    );
}

const mapStateToProps = state => {
    return {
        authToken: state.global.authToken,
        ticket: state.dashboard.ticketDetails,
        segments: state.dashboard.segmentDetails.segments,
        owners:  state.dashboard.ownerDetails.owners,
        range: state.global.range
    };
};

const mapDispatchToProps = dispatch => ({
    getClosedLoopSegments: (token,params) => {
        dispatch(getClosedLoopSegmentDetails(token,params))
    },
    getClosedLoopOwners: (token,params) => {
        dispatch(getClosedLoopOwnerDetails(token,params))
    },
    getDashboardContent: (token, data) => {
        dispatch(getDashboardContent(token, data));
    },
    clearTicketDetails: () => {
        dispatch(clearDetractorTicketDetails())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateTicket);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.darkerGrey
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Colors.darkerGrey
    },
    container:{
        flex:1,
        justifyContent: 'center',
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: MarginConstants.tab2
    },
    fieldContainer: {
        margin: MarginConstants.tab1,
        marginTop: MarginConstants.tab1,
        backgroundColor: Colors.darkerGrey,
    },
    row: {
        backgroundColor: Colors.white,
        height: 2*PaddingConstants.tab3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PaddingConstants.tab1,
        marginBottom: 1
    },
    rowText: {
        color: Colors.primary,
        fontSize: TextSizes.secondary,
    },
    modelDropdown: {
        minHeight: MarginConstants.tab3,
        justifyContent: 'flex-end',
        marginRight: MarginConstants.tab1,
        width: '50%',
    },
    dropdownText: {
        flex:1,
        color: Colors.secondary,
        marginVertical: MarginConstants.tab1,
        marginHorizontal: MarginConstants.halfTab,
        fontSize: Platform.isPad ? TextSizes.primary : Platform.OS === 'android' ? TextSizes.primary : TextSizes.secondary,
        textAlign: 'left',
        paddingLeft: MarginConstants.halfTab,
        paddingRight:MarginConstants.tab3,
        textAlignVertical: 'center',
        borderColor: Colors.darkerGrey,
    },
    dropdownRow: {
        flexDirection: 'row',
        minHeight: MarginConstants.tab4,
        alignItems: 'center',
        paddingHorizontal: PaddingConstants.halfTab,
        backgroundColor: Colors.accent,
    },
    commentContainer: {
        margin: MarginConstants.tab1,
        backgroundColor: Colors.white,
        paddingVertical: PaddingConstants.tab2,
        paddingHorizontal: PaddingConstants.tab1,
    },
    commentText: {
        fontSize: TextSizes.secondary,
        height: 150,
        textAlignVertical: 'top',
        backgroundColor: Colors.grey,
        padding: PaddingConstants.tab1,
        margin: MarginConstants.tab1,
        color: Colors.primary,
        fontFamily: FontFamily.regular
    },
    updateButton: {
        height: PaddingConstants.tab4,
        marginHorizontal: MarginConstants.tab2,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: Colors.accent
    },
    updateText: {
        color: Colors.white,
        fontSize: TextSizes.primary,
        textAlign: 'center',
        paddingHorizontal: PaddingConstants.tab1,
        fontFamily: FontFamily.semiBold,
        // backgroundColor:'red',
        width:'90%',
    },
    error: {
        color: Colors.error,
        textAlign: 'center',
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.light,
        marginTop: MarginConstants.tab1
    },
});
