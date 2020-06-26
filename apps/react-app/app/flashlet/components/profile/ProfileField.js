import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Navigator,
    ScrollView,
    ListView,
    DeviceEventEmitter,
    NativeEventEmitter,
    Dimensions,
    Animated,
    Image,
    RefreshControl,
    TouchableHighlight,
    TouchableOpacity,
    NativeModules,
    Platform
} from 'react-native';
import CustomText from '../../../global/ui/CustomText';
import Button from 'react-native-button';
import ModalDropdown from '../../../global/widgets/ModalDropdown';
import renderIf from '../../../global/renderIf';

export default class ProfileField1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedChoiceId: props.selectedChoiceId,
            selectedChoice: props.selectedChoice
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <CustomText numberOfLines={1} style={{ color: 'black', fontFamily: global.boldText }}>{this.props.title}</CustomText>
                <View style={{ width: undefined, alignSelf: 'stretch', marginTop: 5 }}>
                    {this.getTextComponent()}
                </View>
                {
                    renderIf(!this.props.editMode)
                        (
                        this.renderSeparator()
                        )
                }
            </View>
        );

    }
    getDropdownImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/dropdown.png');
        }
        return { uri: 'dropdown.png' };
    }
    getTextComponent() {

        if (this.props.editMode) {
            return this.getModal();
        } else {
            return (
                <View style={{flexDirection:'row', alignSelf:'stretch', alignItems:'center'}}>
                    <CustomText style={[styles.itemText,{flex:0.8}]} numberOfLines={1}>{this.props.selectedChoice}</CustomText>
                    <CustomText style={[styles.countText,{flex:0.2}]} numberOfLines={1}>{this.props.selectedChoiceMemberCount}</CustomText>
                </View>
            );
        }
    }

    getModal() {
        return (
            <ModalDropdown style={styles.dropdown_2}
                textStyle={styles.dropdown_2_text}
                defaultValue={this.state.selectedChoice}
                dropdownStyle={styles.dropdown_2_dropdown}
                accessible={true}
                options={this.props.data}
                renderRow={this.renderOptionsRow.bind(this)}
                adjustFrame={style => this._dropdown_3_adjustFrame(style)}
                onSelect={(rowId, rowData) => { this.setState({ selectedChoice: rowData.name }); this.props.updateChoiceListener(this.props.fieldId, rowData.ID, rowData.name); }}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => {
                    console.log('Row Id ->' + rowID + " and length - " + this.props.data.length);
                    if (rowID < this.props.data.length - 1) {
                        return this.renderSeparator(sectionID, rowID, adjacentRowHighlighted);
                    }
                    else {
                        return null;
                    }
                }}
            >
                <View style={{ ...border, paddingVertical: 5, paddingHorizontal: 5, height: 40, alignItems: 'center', flexDirection: 'row', alignSelf: 'stretch' }}>
                    <CustomText numberOfLines={1} style={[styles.itemText, { flex: 1 }]}>{this.state.selectedChoice}</CustomText>
                    <Image source={this.getDropdownImage()} style={{ height: 10, width: 10 }} />
                </View>
            </ModalDropdown >
        );
    }
    _dropdown_3_adjustFrame(style) {
        console.log(`frameStyle={width:${style.width}, height:${style.height}, top:${style.top}, left:${style.left}}`);
        style.top += Platform.OS != 'ios' ? 56 : 64;
        return style;
    }
    renderOptionsRow(rowData, rowID, highlighted) {


        return (
            <TouchableHighlight key={rowID} activeOpacity={0.7} underlayColor='rgba(255,255,255,0.8)'>
                <View style={[styles.dropdown_2_row]}>

                    <CustomText style={styles.itemText}>
                        {`${rowData.name}`}
                    </CustomText>
                </View>
            </TouchableHighlight>
        );
    }
    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (<View key={rowID} style={{ flexDirection: 'row', zIndex: -1 }}>
            <View style={styles.lineViewContainer} />
        </View>);
    }
}
const border = {
    borderColor: '#b9b9b9',
    borderRadius: 1,
    borderWidth: 1
};
const styles = StyleSheet.create({

    dropdown_2: {
        alignSelf: 'stretch',
        backgroundColor: 'white',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: global.h4FontSize,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        alignSelf: 'stretch',
        ...border,
    },
    lineViewContainer: {
        height: 1,
        marginTop: 10,
        flex: 1,
        backgroundColor: '#E5E8E9'
    },
    dropdown_2_row: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        height: 30,
        padding: 5,
        alignItems: 'center',
    },
    dropdown_2_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'navy',
        textAlignVertical: 'center',
    },
    dropdown_2_separator: {
        height: 1,
        backgroundColor: '#E5E8E9',
    },
    itemText: {
        color: 'black',
        fontFamily: global.primaryText,
        fontSize: global.h2FontSize,
        textAlign:'left'

    },
    countText: {
        color: '#999999',
        fontFamily: global.primaryText,
        fontSize: global.h2FontSize,
        textAlign:'right'

    },

});