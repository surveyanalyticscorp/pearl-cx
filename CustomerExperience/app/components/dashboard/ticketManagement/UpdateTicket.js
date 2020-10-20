import React, {useState, useRef, useEffect} from 'react';
import SafeAreaView from "react-native-safe-area-view";
import {View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableWithoutFeedback} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import ModalDropdown from '../../../widgets/drop-down/ModalDropdown';
import {connect} from 'react-redux';
import {getClosedLoopOwnerDetails, getClosedLoopSegmentDetails} from '../../../redux/actions/dashboard.actions';
import ArrayUtils from '../../../Utils/ArrayUtils';
import StringUtils from '../../../Utils/StringUtils';

function UpdateTicket(props) {
    let priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
    let statusOptions = ['New', 'Open', 'Resolved', 'Escalated'];

    let [comment, setComment] = useState('');
    let [priority, setPriority] = useState('');
    let [status, setStatus] = useState(props.ticket.status);
    let [segmentOptions, setSegmentOptions] = useState([]);
    let [segment, setSegment] = useState('');
    let [ownerOptions, setOwnerOptions] = useState([]);
    let [owner, setOwner] = useState('');

    let ref = useRef(null);

    let fetchClosedLoopSegments = () => {
        let params = {
            "statusID": 0,
            "originSegmentID": props.ticket.originSegmentID
        };
        props.getClosedLoopSegments(props.authToken, params)
    };

    let fetchTicketOwners = () => {
        if (StringUtils.isNotEmpty(segment)) {
            let selectedSegment = segmentOptions.find(item => item.segmentName === segment);
            let params = {
                "segmentID": selectedSegment.segmentID
            };
            props.getClosedLoopOwners(props.authToken, params)
        }
    };

    useEffect(() => {
        fetchClosedLoopSegments();
    }, []);

    useEffect(() => {
        setSegmentOptions(props.segments);
    },[props.segments]);

    useEffect(() => {
        fetchTicketOwners()
    },[segment]);

    useEffect(() => {
        setOwnerOptions(props.owners);
    },[props.owners]);

    let setDataOnSelection = (header, options, selectedIndex) => {

        switch (header) {
            case 'Priority':
                setPriority(options[selectedIndex]);
                break;
            case 'Status':
                setStatus(options[selectedIndex]);
                break;
            case 'Segment':
                setSegment(options[selectedIndex]);
                break;
            case 'Owner':
                setOwner(options[selectedIndex]);
                break;
        }
    };

    let renderDropDown = (header, options) => {
        return (
            <View>
                <ModalDropdown
                    ref={ref}
                    style={styles.modelDropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownStyle}
                    dropdownTextStyle={styles.dropdownText}
                    arrowIconColor={Colors.secondary}
                    options={options}
                    defaultValue={'Select'}
                    renderRow={dropdownRenderRow}
                    onSelect={(i) => {
                        setDataOnSelection(header, options, i)
                    }}
                />
            </View>
        )
    };

    let renderField = (header, options) => {
        return (
            <View style={styles.row}>
                <Text style={styles.rowText}> {header} </Text>
                <View style={{position:'absolute', justifyContent: 'center', alignItems: 'center', right:10}}>
                    {renderDropDown(header, options)}
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
    }

    let renderContainer = () => {
        return (
            <View style={styles.fieldContainer}>
                {renderField('Priority', priorityOptions)}
                {renderField('Status', statusOptions)}
                {renderField('Segment', getSegmentArray())}
                {renderField('Owner', getOwners())}
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
                        setComment(text);
                    }}
                />
            </View>
        )
    };

    let renderUpdateButton = () => {
        return (
            <View style={styles.updateButton}>
                <TouchableWithoutFeedback onPress={() => {

                }}>
                    <Text style={styles.updateText}> Update </Text>
                </TouchableWithoutFeedback>
            </View>
        )
    };

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={'handled'}
            >
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
        owners:  state.dashboard.ownerDetails.owners
    };
};

const mapDispatchToProps = dispatch => ({
    getClosedLoopSegments: (token,params) => {
        dispatch(getClosedLoopSegmentDetails(token,params))
    },
    getClosedLoopOwners: (token,params) => {
        dispatch(getClosedLoopOwnerDetails(token,params))
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
        marginBottom: 36
    },
    fieldContainer: {
        margin: MarginConstants.tab1,
        marginTop: MarginConstants.tab2,
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
        fontSize: TextSizes.semiMediumText,
        height: 150,
        textAlignVertical: 'top',
        backgroundColor: Colors.grey,
        padding: PaddingConstants.tab1,
        margin: MarginConstants.tab1
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
        paddingHorizontal: PaddingConstants.tab3,
        fontFamily: FontFamily.semiBold,
    },
});
