import React, {useEffect,useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Picker from 'react-native-wheel-picker'
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import StringUtils from '../Utils/StringUtils';
import {fontFamily} from '../styles/font.constants';
let PickerItem = Picker.Item;

export default function DatePicker(props) {
    /* This is done for supporting different languages in future */
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

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

    let setYear = () => {
        const {savedDate, dateFormat} = props;
        if(savedDate !== dateFormat) {
            let components = savedDate.split('/');
            return components[2];

        } else {
            let today = new Date();
            return StringUtils.getStringFromNumber(today.getFullYear());
        }
    };

    let setMonth = () => {
        const {savedDate, dateFormat} = props;
        if(savedDate !== dateFormat) {
            let components = savedDate.split('/');
            return components[1];
        } else {
            let today = new Date();
            return StringUtils.getStringFromNumber(parseInt(today.getMonth()+1));
        }
    };

    let [selectedYear, setSelectedYear] = useState(setYear());
    let [selectedMonth, setSelectedMonth] = useState(setMonth());

    useEffect(() => {
        saveDate()
    },[selectedYear,selectedMonth]);


    let saveDate = () => {
        props.onSubmit(selectedYear, selectedMonth, '01')

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
                        // saveDate()
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
                        // saveDate()
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

    return (
        <View style={styles.container}>
            {renderMonthPicker()}
            {renderYearPicker()}
        </View>
    );
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
        borderRadius:15,
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
        fontFamily: fontFamily.Regular,
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
