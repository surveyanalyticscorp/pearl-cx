import React, {useEffect, useState} from 'react';
import {Colors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {StyleSheet, View, Text, ScrollView, TouchableWithoutFeedback} from 'react-native';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import moment from 'moment';
import {DMYFORMAT, HalfMonthDateYearFormat} from '../../../Utils/AppConstants';
import SafeAreaView from 'react-native-safe-area-view';
import {PaddingConstants} from '../../../styles/padding.constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {DASHBOARD_RANGE} from '../../../redux/actions/dashboard.actions';
import AsyncStorage from '@react-native-community/async-storage';

export default function DashboardDateFilter(props){

    let routeName = props.route.name;
    let [selectedRange, setSelectedRange] = useState({startDate:'',endDate:''});
    let [selectedType, setSelectedType] = useState(props.route.params.range.type || 1);
    let [startDateSelected, setStartDateSelected] = useState(false);

    let saveRange = () => {

        let dashboardRange = {type: selectedType, ...selectedRange};
        props.route.params.setRange(dashboardRange);
        AsyncStorage.setItem(DASHBOARD_RANGE, JSON.stringify(dashboardRange));
        props.navigation.navigate("Dashboard");
    };

    useEffect(() => {
        props.navigation.dangerouslyGetParent().setParams({'saveRange': saveRange});
    }, [selectedType]);

    let getFilterText = (type) => {
        switch (type) {
            case 1:
                return 'Last 30 days';
            case 2:
                return 'This month';
            case 3:
                return 'Last month';
            case 4:
                return 'Last 3 months';
            case 5:
                return 'Last 6 months';
        }
    };

    let getSelectedRange = (type) => {
        let today = new Date();
        let month = today.getMonth() + 1;
        let tempEndDate = today.getDate()+"/"+month+"/"+today.getFullYear();
        switch (type) {
            case 1:
                /** Last 30 days*/
                let tempStartDate = moment(tempEndDate, DMYFORMAT).subtract(30,'days').format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 2:
                /** This month*/
                let firstDate = 1+"/"+month+"/"+today.getFullYear();
                tempStartDate = moment(firstDate, DMYFORMAT).format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 3:
                /** Last month*/
                 firstDate = 1+"/"+today.getMonth()+"/"+today.getFullYear();
                tempStartDate = moment(firstDate, DMYFORMAT).format(DMYFORMAT);
                let lastDate = new Date(today.getFullYear(), today.getMonth(), 0);
                 month = lastDate.getMonth() + 1;
                tempEndDate = lastDate.getDate()+"/"+month+"/"+lastDate.getFullYear();
                tempEndDate = moment(tempEndDate, DMYFORMAT).format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 4:
                /** Last 3 months*/
                tempStartDate = moment(tempEndDate, DMYFORMAT).subtract(3,'months').format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 5:
                /** Last 6 months */
                tempStartDate = moment(tempEndDate, DMYFORMAT).subtract(6,'months').format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            default:
                break;
        }
    };

    let getRange = (type) => {
        switch (type) {
            case 1:
            case 4:
            case 5:
                let range = getSelectedRange(type);
                return range.startDate+ ' - ' +range.endDate;
            case 2:
                let date1 = new Date();
                return date1.toLocaleString('default', { month: 'long' });
            case 3:
                let date2 = new Date();
                let date = new Date(date2.getFullYear(), date2.getMonth() - 1, date2.getDate()); //last month date
                return date.toLocaleString('default', { month: 'long' });
        }
    };

    let renderMonthRow = (type) => {
        let title = getFilterText(type);
        let range = getRange(type);
        return (
            <View style={{marginBottom: .5}}>
                <TouchableWithoutFeedback onPress={() => {
                    let rangeSelected = getSelectedRange(type);
                    setSelectedType(type);
                    setSelectedRange(rangeSelected)
                }}>
                    <View style={styles.monthRow}>
                        <View>
                            <Text style={styles.dateTitle}>{title}</Text>
                            <Text style={styles.rangeTitle}>{range}</Text>
                        </View>
                        { selectedType === type && <View  style={styles.checkIcon}>
                        <MaterialIcon name={'check'} size={25} color={Colors.secondaryAccent}/>
                        </View>
                        }
                    </View>
                </TouchableWithoutFeedback>
                { type !== 5 && <View style={styles.separator}/>}
            </View>
        )
    };

    let renderMonthView = () => {
        return (
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.container}>
                        {renderMonthRow(1)}
                        {renderMonthRow(2)}
                        {renderMonthRow(3)}
                        {renderMonthRow(4)}
                        {renderMonthRow(5)}
                    </View>
                </ScrollView>
        )
    };

    let renderStartDateRow = (isStartDate, displayDate) => {
        let title = isStartDate ? 'Start date' : 'End date';
        let date = moment(displayDate, 'DD-MM-YYYY').format(HalfMonthDateYearFormat);
      return (
          <View style={{marginBottom: .5}}>
              <TouchableWithoutFeedback onPress={() => {

              }}>
                  <View style={styles.customRow}>
                          <Text style={styles.dateTitle}>{title}</Text>
                           <Text style={styles.rangeTitle}>{date}</Text>
                  </View>
              </TouchableWithoutFeedback>
              { isStartDate && <View style={styles.separator}/>}
          </View>
      )
    };

    let renderCustomView = () => {
        return (
            <View style={styles.container}>
                        {renderStartDateRow(true, props.route.params.range.startDate)}
                        {renderStartDateRow(false, props.route.params.range.endDate)}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {routeName === 'Month' ? renderMonthView() : renderCustomView()}
        </SafeAreaView>
    );
};




const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: Colors.white
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Colors.white
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: PaddingConstants.halfTab
    },
    dateTitle: {
        color: Colors.primary,
        fontSize: TextSizes.primary,
        fontFamily: FontFamily.regular,
    },
    rangeTitle: {
        color: Colors.secondary,
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.secondary,
        marginVertical: MarginConstants.halfTab
    },
    separator: {
        backgroundColor: Colors.borderColor,
        height: .5,
        marginHorizontal: MarginConstants.tab2
    },
    monthRow: {
        marginHorizontal: MarginConstants.tab2,
        marginVertical: 1.5*MarginConstants.tab1,
        flexDirection: 'row',
    },
    checkIcon: {
        alignItems:'flex-end',
        justifyContent: 'center',
        flex:1,
        marginRight: MarginConstants.tab1
    },
    customRow: {
        marginHorizontal: MarginConstants.tab2,
        marginVertical: 1.5*MarginConstants.tab1,
    }

});
