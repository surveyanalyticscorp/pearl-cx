import React, {useState,useRef} from 'react';
import {
    Modal,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafeAreaView from 'react-native-safe-area-view';
import {MarginConstants} from '../styles/margin.constants';
import {Colors} from '../styles/color.constants';
import {DMYFORMAT, YMDFORMAT} from '../Utils/AppConstants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
import moment from 'moment';
import QPTextField from './TextField';
import StringUtils from '../Utils/StringUtils';

export default function RangeCalendar(props) {

    let [startDate, setStartDate] = useState(props.startDate);
    let [endDate, setEndDate] = useState(props.endDate);
    let [showCustom, setShowCustom] = useState(props.selectedType === 4);
    let [validationError, setValidationError] = useState('');
    let [selectedType, setSelectedType] = useState(props.selectedType);

    let textFieldTimer = useRef(null);

    const renderCloseButton = () => {
        return (
            <View style={styles.closeIconContainer}>
                <TouchableOpacity
                    onPress={() => {
                        props.closeCalendar && props.closeCalendar(false);
                    }}
                >
                    <Icon
                        name={'close'}
                        color={Colors.white}
                        size={25}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    let getFilterText = (type) => {
        switch (type) {
            case 1:
                return 'Last 30 days';
            case 2:
                return 'Last 3 months';
            case 3:
                return 'Last 6 months';
            default:
                return 'Custom';

        }
    };

    let renderPredefinedDateSelection = (type) => {
        let text = getFilterText(type);
        return (
            <View style={styles.preDefinedDateContainer}>
                {(type === selectedType) && <View style={styles.selectedStateView}/>}
                <TouchableWithoutFeedback onPress={() => {
                    if (type !== 4) {
                        props.onSubmit(type, '', '');
                    } else {
                        setSelectedType(type);
                        setShowCustom(true);
                        setStartDate(DMYFORMAT);
                        setEndDate(DMYFORMAT);
                    }

                }}>
                    <Text style={styles.rangeText}>{text}</Text>
                </TouchableWithoutFeedback>
            </View>
        )
    };

    let showSelectedDate = () => {
        let selectedDateString = startDate + ' - ' + endDate;
        return (
            <View style={[styles.preDefinedDateContainer, {flexDirection: 'row'}]}>
                <Text style={styles.text}>Date Selected</Text>
                <View style={styles.selectedDate}>
                    <Text style={styles.text}>{selectedDateString}</Text>
                </View>
            </View>
        )
    };

    let saveDate = () => {
        if(startDate !== DMYFORMAT && endDate !== DMYFORMAT) {
            if(!moment(startDate, DMYFORMAT).isValid()) {
                setValidationError('Invalid start date entered')
            } else if (!moment(endDate, DMYFORMAT).isValid()) {
                setValidationError('Invalid end date entered')
            } else {
                let tempEnd = moment(endDate, DMYFORMAT).format(YMDFORMAT);
                let tempStart = moment(startDate, DMYFORMAT).format(YMDFORMAT);
                if(moment(tempEnd).isAfter(tempStart)) {
                    tempEnd = moment(tempEnd, YMDFORMAT).format(DMYFORMAT);
                    tempStart = moment(tempStart, YMDFORMAT).format(DMYFORMAT);
                    props.onSubmit(4, tempStart, tempEnd)
                } else {
                    setValidationError('start date should be less than end date')
                }
            }
        } else {
            setValidationError('Please select a date')
        }
    };

    let renderPickerFooter = () => {
        return (
            <View style={styles.calendarFooter}>
                <TouchableOpacity style={styles.okButton}
                                  onPress={saveDate}
                >
                    <Text style={styles.text}>OK</Text>
                </TouchableOpacity>
            </View>
        );
    };

    let showCustomDateContainer = () => {
        return (
            <View style={styles.customDateContainer}>
                {StringUtils.isNotEmpty(validationError) && renderValidationError()}
                <View style={styles.startTextFieldContainer}>
                    <QPTextField
                        autofocus={false}
                        label={'Start Date'}
                        tintColor={Colors.primary}
                        keyboardType={Platform.select({
                            ios: 'numbers-and-punctuation',
                            android: 'phone-pad'
                        })}
                        placeholder={DMYFORMAT}
                        style={styles.dateInput}
                        onSubmit={() => {
                            if(moment(startDate, DMYFORMAT).isValid()) {
                                textFieldTimer = setTimeout(() => {
                                    Keyboard.dismiss()
                                }, 5);
                            } else {
                                setValidationError('Invalid start date entered')
                            }
                        }}
                        onChange={(text) => {
                            StringUtils.isNotEmpty(validationError) && setValidationError('');
                            setStartDate(text)
                        }}
                    />
                </View>
                <View style={styles.endTextFieldContainer}>
                    <QPTextField
                        autofocus={false}
                        label={'End Date'}
                        tintColor={Colors.primary}
                        style={styles.dateInput}
                        placeholder={DMYFORMAT}
                        keyboardType={Platform.select({
                            ios: 'numbers-and-punctuation',
                            android: 'phone-pad'
                        })}
                        onSubmit={() => {
                            if(moment(endDate, DMYFORMAT).isValid()) {
                                textFieldTimer = setTimeout(() => {
                                    Keyboard.dismiss()
                                }, 5);
                            } else {
                                setValidationError('Invalid end date entered')
                            }
                        }}
                        onChange={(text) => {
                            StringUtils.isNotEmpty(validationError) && setValidationError('');
                            setEndDate(text)
                        }}
                    />
                </View>
            </View>
        )
    };

    let renderValidationError = () => {
        return <Text style={styles.error}>{ validationError }</Text>
    };

    return (
        <Modal animationType={'fade'}
               transparent={true}
               onRequestClose={() => {
                   props.closeCalendar(false);
               }}
               visible={props.showCalendar}
               supportedOrientations={['portrait']}
        >
            <View style={[styles.modalContainer]}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView style={styles.scrollContainer}>
                        {renderCloseButton()}
                        <KeyboardAvoidingView behavior='position'
                                              style={styles.keyboardContainer}
                                              keyboardVerticalOffset={Platform.select({
                                                  ios: Platform.isPad ? -200 : -150,
                                                  android: -200
                                              })}
                                              enabled>
                            <View style={styles.modalDOBView}>
                                {showSelectedDate()}
                                {renderPredefinedDateSelection(1)}
                                {renderPredefinedDateSelection(2)}
                                {renderPredefinedDateSelection(3)}
                                {renderPredefinedDateSelection(4)}
                                {showCustom && showCustomDateContainer()}
                                {showCustom && renderPickerFooter()}
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    closeIconContainer: {
        marginRight: MarginConstants.tab2,
        alignItems:'flex-end'
    },
    calendarFooter: {
        alignItems: 'flex-end',
        paddingRight:MarginConstants.tab1,
        paddingTop: MarginConstants.tab1,
        marginTop: MarginConstants.tab1
    },
    okButton: {
        width: 2*PaddingConstants.tab4,
        height:PaddingConstants.tab3,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.accent
    },
    modalDOBView: {
        marginBottom:MarginConstants.halfTab,
        marginHorizontal: MarginConstants.tab1,
        backgroundColor: Colors.darkerGrey,
        padding: PaddingConstants.tab1
    },
    rangeText:{
        color: Colors.primary,
        fontSize: TextSizes.primary,
        fontFamily: FontFamily.regular,
        flex: 1
    },
    dateContainer: {
        minHeight: PaddingConstants.tab4,
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: MarginConstants.tab1,
        marginHorizontal: MarginConstants.halfTab,
        flexDirection: 'row'
    },
    text: {
        color: Colors.secondary,
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.secondary,
        justifyContent: 'center',
        alignItems:'center',
        paddingLeft: PaddingConstants.tab1,
        paddingBottom: PaddingConstants.halfTab
    },
    error: {
        color: Colors.error,
        textAlign: 'center',
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.light,
    },
    selectedStateView: {
        width: 5,
        position:'absolute',
        left:0,
        top:0,
        bottom:0,
        backgroundColor: Colors.accent
    },
    keyboardContainer: {
        flex: 1,
        padding: PaddingConstants.halfTab,
        marginTop: Platform.select({ios: 20, android: 0}),
    },
    preDefinedDateContainer: {
        padding: PaddingConstants.tab1,
        paddingLeft: PaddingConstants.tab2,
        margin: MarginConstants.tab1,
        backgroundColor: Colors.white,
        height: PaddingConstants.tab4,
        flexDirection:'row'
    },
    dateInput: {
        marginHorizontal: MarginConstants.tab2,
        height: MarginConstants.tab2,
        marginTop: MarginConstants.tab1,
        marginBottom: MarginConstants.tab1,
        paddingHorizontal: MarginConstants.halfTab,
    },
    selectedDate: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    customDateContainer: {
        minHeight: 4 * MarginConstants.tab4,
        backgroundColor: Colors.white,
        marginHorizontal: MarginConstants.tab1
    },
    startTextFieldContainer:{
        marginBottom: MarginConstants.tab2
    },
    endTextFieldContainer: {
        marginTop: MarginConstants.tab2
    }

});
