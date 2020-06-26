import React, {Component} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import CustomText from "../../ui/CustomText";
import Icon from 'react-native-vector-icons/MaterialIcons'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

const DELETE = 1;
const EDIT = 0;

export default class EditDeleteContextMenu extends Component {

    constructor(props) {
        super();
    }


    render() {
        return (

            <Menu onSelect={touchable => {
                if (touchable === EDIT) {
                    this.props.onEdit();
                }
                else {
                    this.props.onDelete();
                }
            }}

            >
                <MenuTrigger>
                    <Icon
                        name='more-vert'
                        size={20}
                        color={'grey'}
                    />
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={[{width: 100}, this.props.optionsContainerStyle]}>
                    <MenuOption
                        value={0}>
                        <View style={[this.props.optionStyle, styles.optionRow]}>
                            <Icon name={'edit'} size={15} color={'grey'}/>
                            <CustomText
                                style={[styles.optionText, this.props.optionTextStyle]}>{this.props.editText || "Edit"}</CustomText>
                        </View>
                    </MenuOption>
                    <MenuOption style={this.props.optionStyle || {}}
                                value={1}>
                        <View style={[this.props.optionStyle, styles.optionRow]}>
                            <Icon name={'delete'} size={15} color={'grey'}/>
                            <CustomText
                                style={[styles.optionText, this.props.optionTextStyle]}>{this.props.deleteText || "Delete"}</CustomText>
                        </View>
                    </MenuOption>
                </MenuOptions>

            </Menu>

        )
    }
}

const styles = StyleSheet.create({
    optionText: {
        fontSize: global.h3fontSize,
        color: '#7e7e7e',
        marginLeft: 5,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal:5
    }
});