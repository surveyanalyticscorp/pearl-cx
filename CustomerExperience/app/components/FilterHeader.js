import {DMYFORMAT, HalfMonthDateYearFormat} from '../Utils/AppConstants';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import {connect} from 'react-redux';
import React from 'react';
import {setDashboardRangeFilter} from '../redux/actions/dashboard.actions';
import {StackActions} from '@react-navigation/native';
import {PaddingConstants} from '../styles/padding.constants';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';

const FilterHeader = (props) => {
    let startDate = moment(props.range.startDate, DMYFORMAT).format(HalfMonthDateYearFormat);
    let endDate = moment(props.range.endDate, DMYFORMAT).format(HalfMonthDateYearFormat);

    let getDataOnNewRange = (range) => {
        props.setRange(range);
        props.callDataAPI();
    };

    let filterAction = () => {
        const pushAction = StackActions.push('Date Range', {
            range: props.range,
            setRange: getDataOnNewRange,
        });
        props.navigation.dispatch(pushAction);
    };

    let addRange = () => {
        let startDate = props.range.startDate;
        let endDate = props.range.endDate;
        let startComponents = startDate.split('/');
        let endComponents = endDate.split('/');
        let startMonth = parseInt(startComponents[1]) - 1;
        let tempStart = moment([startComponents[2], startMonth+'', startComponents[0]]);
        let endMonth = parseInt(endComponents[1]) - 1;
        let tempEnd = moment([endComponents[2], endMonth+'', endComponents[0]]);
        let days = tempEnd.diff(tempStart,'days');
        let nextDay = moment(endDate, DMYFORMAT).add(1,'days').format(DMYFORMAT);
        let endDay = moment(nextDay, DMYFORMAT).add(days,'days').format(DMYFORMAT);
        let tempRange = {...props.range, startDate: nextDay, endDate: endDay};
        props.setRange(tempRange);
        props.actionOnArrowClick()
    };

    let reduceRange = () => {
        let startDate = props.range.startDate;
        let endDate = props.range.endDate;
        let startComponents = startDate.split('/');
        let endComponents = endDate.split('/');
        let startMonth = parseInt(startComponents[1]) - 1;
        let tempStart = moment([startComponents[2], startMonth+'', startComponents[0]]);
        let endMonth = parseInt(endComponents[1]) - 1;
        let tempEnd = moment([endComponents[2], endMonth+'', endComponents[0]]);
        let days = tempEnd.diff(tempStart,'days');
        let endDay = moment(startDate, DMYFORMAT).subtract(1,'days').format(DMYFORMAT);
        let startDay = moment(endDay, DMYFORMAT).subtract(days,'days').format(DMYFORMAT);
        let tempRange = {...props.range, startDate: startDay, endDate: endDay};
        props.setRange(tempRange);
        props.actionOnArrowClick()
    };

    return (
        <View style={styles.filterHeader}>
            <TouchableWithoutFeedback onPress={filterAction}>
                <View style={styles.filterLeftView}>
                    <LineIcon name={'calendar'} size={15} color={Colors.white}/>
                    <View style={styles.filterCalendarView}>
                        <Text style={styles.dateText}>{startDate} - </Text>
                        <Text style={styles.dateText}>{endDate}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.filterArrowIconView}>
                <TouchableWithoutFeedback hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={reduceRange}>
                    <LineIcon name='arrow-left' size={15} color= {Colors.white} style={{marginRight: MarginConstants.tab2}}/>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={addRange}>
                    <LineIcon name='arrow-right' size={15} color= {Colors.white}/>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
};

const mapStateToProps = state => {
    return {
        range: state.dashboard.range
    };
};

const mapDispatchToProps = dispatch => ({
    setRange: (range) => {
        dispatch(setDashboardRangeFilter(range))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterHeader);

export const styles = StyleSheet.create({
    filterHeader: {
        flexDirection:'row',
        height: 1.3*MarginConstants.tab4,
        paddingLeft: 1.4*PaddingConstants.tab2,
        alignItems:'center',
        backgroundColor: Colors.accent,
        justifyContent: 'space-between'
    },
    filterCalendarView: {
        flexDirection:'row',
        marginHorizontal: MarginConstants.tab2,
    },
    filterLeftView: {
        flexDirection:'row',
        marginRight: MarginConstants.tab1,
    },
    filterArrowIconView: {
        flexDirection:'row',
        marginRight: MarginConstants.tab1,
        alignItems:'center',
        justifyContent: 'space-around',
        paddingHorizontal: PaddingConstants.tab2
    },
    dateText: {
        color: Colors.white,
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.secondary,
    }
});
