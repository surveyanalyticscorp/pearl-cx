import React, {useEffect,useState, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import StringUtils from '../Utils/StringUtils';
import {FontFamily} from '../styles/font.constants';
let PickerItem = Picker.Item;

export default function DatePicker(props) {

    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let dates = '31';
    let [valueChanged, setValueChanged] = useState(false);
    const previousSavedDate = usePrevious(props.savedDate);

    useEffect(() => {
        if(previousSavedDate !== props.savedDate) {
            let tempMonth = setMonth();
            let tempDate = setDate();
            let tempYear = setYear();
            setSelectedMonth(tempMonth);
            setSelectedDate(tempDate);
            setSelectedYear(tempYear);
        }
    },[props.savedDate]);

    let getYears = (minYears, maxYears) => {
        let data = [];
        let i = minYears;
        while(i <= maxYears){
            data.push(StringUtils.getStringFromNumber(i));
            i = i+1;
        }
        return data;
    };

    let years = getYears(props.minYear, props.maxYear);

    let getDates = (days) => {
        let dates = [];
        for(let i = 1; i<=days;i++){
            if(i<10) {
                let j = '0' + StringUtils.getStringFromNumber(i);
                dates.push(j);
            } else {
                dates.push(StringUtils.getStringFromNumber(i));
            }
        }
        return dates;
    };

    let getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    let setYear = () => {
        const {savedDate, dateFormat} = props;
        if(savedDate !== dateFormat) {
            let components = savedDate.split('/');
            // setSelectedYear(components[2]);
            return components[2];

        } else {
            let today = new Date();
            // setSelectedYear(StringUtils.getStringFromNumber(today.getFullYear()));
            return StringUtils.getStringFromNumber(today.getFullYear())
        }
    };

    let setMonth = () => {
        const {savedDate, dateFormat} = props;
        if(savedDate !== dateFormat) {
            let components = savedDate.split('/');
            // setSelectedMonth(components[1]);
            return components[1]
        } else {
            let today = new Date();
            // setSelectedMonth(StringUtils.getStringFromNumber(parseInt(today.getMonth()+1)));
            return StringUtils.getStringFromNumber(parseInt(today.getMonth()+1))
        }
    };

    let setDate = () => {
        const {savedDate, dateFormat} = props;
        if(savedDate !== dateFormat ) {
            let components = savedDate.split('/');
            // setSelectedDate(components[0]);
            return components[0]
        } else {
            let today = new Date();
            // setSelectedDate(StringUtils.getStringFromNumber(today.getDate()));
            return StringUtils.getStringFromNumber(today.getDate())
        }
    };

    let [selectedYear, setSelectedYear] = useState( setYear());
    let [selectedMonth, setSelectedMonth] = useState(setMonth());
    let [selectedDate, setSelectedDate] = useState(setDate());

    useEffect(() => {
        valueChanged && saveDate()
    },[selectedYear, selectedMonth, selectedDate]);


    let saveDate = () => {
        props.onSubmit(selectedYear, selectedMonth, selectedDate)
    };

    let renderPickerTitle = (text) => {
        return (
            <View style={styles.pickerTitle}>
                <Text style={styles.pickerHeader}>{text}</Text>
            </View>
        );
    };

    let renderSeparator = () => {
        return (
            <View style={styles.separator}/>
        );
    };

    let renderMonthPickerElement = () => {
        return (
            <Picker style={styles.picker}
                    selectedValue={parseInt(selectedMonth)}
                    itemStyle={StyleSheet.flatten({
                        color: Colors.accent,
                        marginTop: MarginConstants.tab1,
                        fontSize: TextSizes.primary,
                    })}
                    onValueChange={(value) => {
                        setSelectedMonth(value);
                        setValueChanged(true)
                    }}>
                {
                    months.map((value, i) => (
                            <PickerItem label={months[i]} value={i+1} key={i} />
                        )
                    )
                }
            </Picker>
        )
    };

    let renderYearPickerElement = () => {
        return (
            <Picker style={styles.picker}
                    selectedValue={parseInt(selectedYear)}
                    itemStyle={StyleSheet.flatten({
                        color: Colors.accent,
                        marginTop: MarginConstants.tab1,
                        fontSize: TextSizes.primary,
                    })}
                    onValueChange={(value) => {
                        setSelectedYear(value);
                        setValueChanged(true)
                    }}>
                {
                    years.map((value, i) => (
                            <PickerItem label={value} value={parseInt(value)} key={i} />
                        )
                    )
                }
            </Picker>
        )
    };

    let renderDatePickerElement = () => {
        dates = getDates(getDaysInMonth(selectedMonth, selectedYear));
        if(dates.length === 0){
            dates = getDates(getDaysInMonth('01', years[0]))
        }
        return (
            <Picker style={styles.picker}
                    selectedValue={parseInt(selectedDate + "")}
                    itemStyle={StyleSheet.flatten({
                        color: Colors.accent,
                        marginTop: MarginConstants.tab1,
                        fontSize: TextSizes.primary,
                    })}
                    onValueChange={(value) => {
                        setSelectedDate(value);
                        setValueChanged(true)

                    }}>
                {
                    dates.map((value, i) => (
                            <PickerItem label={value} value={parseInt(value)} key={i}/>
                        )
                    )
                }
            </Picker>
        )
    };

    let renderMonthPicker = () => {
        return (
            <View style={styles.pickerColumn}>
                {renderPickerTitle('Month')}
                {renderSeparator()}
                {renderMonthPickerElement()}
            </View>
        );
    };

    let renderYearPicker = () => {
        return (
            <View style={styles.pickerColumn}>
                {renderPickerTitle('Year')}
                {renderSeparator()}
                {renderYearPickerElement()}
            </View>
        );
    };

    let renderDatePicker = () => {
        return (
            <View style={styles.pickerColumn}>
                {renderPickerTitle('Date')}
                {renderSeparator()}
                {renderDatePickerElement()}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderMonthPicker()}
            {renderDatePicker()}
            {renderYearPicker()}
        </View>
    );
}

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        marginTop: MarginConstants.tab1,
        backgroundColor: Colors.white
    },
    pickerColumn:{
        flex:1,
        padding: PaddingConstants.halfTab,
        marginRight: MarginConstants.halfTab,
        alignItems:'center',
        backgroundColor: Colors.grey
    },
    pickerTitle:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    pickerHeader: {
        color: Colors.secondary,
        paddingVertical:PaddingConstants.tab1,
        fontFamily: FontFamily.Regular,
        fontSize: TextSizes.secondary,
        justifyContent: 'center',
        alignItems:'center',
    },
    picker: {
        height: 180,
        width:180,
        marginBottom: MarginConstants.tab2,
        paddingHorizontal: PaddingConstants.halfTab,
    },
    separator:{
        height: 0.5,
        marginTop: MarginConstants.halfTab,
        alignSelf: 'stretch',
        backgroundColor: Colors.darkGrey
    }

});
