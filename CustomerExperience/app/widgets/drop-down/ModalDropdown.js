'use strict';

import React, {
    Component,
} from 'react';

import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableHighlight,
    Modal,
    ActivityIndicator
} from 'react-native';
import ListView from "deprecated-react-native-listview";


import PropTypes from 'prop-types';
import {styles} from './DropdownStyle';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';

const TOUCHABLE_ELEMENTS = [
    'TouchableHighlight',
    'TouchableOpacity',
    'TouchableWithoutFeedback',
    'TouchableNativeFeedback'
];
let dropDownWidth = 100;
let noOfElementToBeDisplayed=5;
export default class ModalDropdown extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        scrollEnabled: PropTypes.bool,
        defaultIndex: PropTypes.number,
        defaultValue: PropTypes.string,
        options: PropTypes.array,

        accessible: PropTypes.bool,
        animated: PropTypes.bool,
        showsVerticalScrollIndicator: PropTypes.bool,
        keyboardShouldPersistTaps: PropTypes.string,

        style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        dropdownTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        dropdownTextHighlightStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

        adjustFrame: PropTypes.func,
        renderRow: PropTypes.func,
        renderSeparator: PropTypes.func,
        renderButtonText: PropTypes.func,

        onDropdownWillShow: PropTypes.func,
        onDropdownWillHide: PropTypes.func,
        onSelect: PropTypes.func
    };

    static defaultProps = {
        disabled: false,
        scrollEnabled: true,
        defaultIndex: -1,
        defaultValue: 'Please select...',
        options: null,
        animated: true,
        dropDownTag: 0,
        showsVerticalScrollIndicator: true,
        keyboardShouldPersistTaps: 'never'
    };

    constructor(props) {
        super(props);

        this._button = null;
        this._buttonFrame = null;
        this._nextValue = null;
        this._nextIndex = null;

        this.state = {
            accessible: !!props.accessible,
            loading: !props.options,
            showDropdown: false,
            buttonText: props.defaultValue,
            selectedIndex: props.defaultIndex
        };
    }

    componentDidUpdate(prevProps) {
        let {buttonText, selectedIndex} = this.state;
        const {defaultIndex, defaultValue, options} = this.props;

        if(prevProps.selectedIndex !== this.props.selectedIndex) {
            buttonText = this._nextValue == null ? buttonText : this._nextValue;
            selectedIndex = this._nextIndex == null ? selectedIndex : this._nextIndex;
            if (selectedIndex < 0) {
                selectedIndex = defaultIndex;
                if (selectedIndex < 0) {
                    buttonText = defaultValue;
                }
            }
            this._nextValue = null;
            this._nextIndex = null;

            this.setState({
                loading: !options,
                buttonText,
                selectedIndex
            });
        }
    }

    render() {
        return (
            <View  {...this.props} >
                {this._renderButton()}
                {this._renderModal()}
            </View>
        );
    }

    _updatePosition(callback) {
        if (this._button && this._button.measure) {
            this._button.measure((fx, fy, width, height, px, py) => {
                this._buttonFrame = {x: px, y: py, w: width, h: height};
                callback && callback();
            });
        }
    }

    show() {
        this._updatePosition(() => {
            this.setState({
                showDropdown: true
            });
        });
    }

    hide() {
        this.setState({
            showDropdown: false
        });
    }

    select(idx) {
        const {defaultValue, options, defaultIndex, renderButtonText} = this.props;

        let value = defaultValue;
        if (idx == null || !options || idx >= options.length) {
            idx = defaultIndex;
        }

        if (idx >= 0) {
            value = renderButtonText ? renderButtonText(options[idx]) : options[idx].toString();
        }

        this._nextValue = value;
        this._nextIndex = idx;

        this.setState({
            buttonText: value,
            selectedIndex: idx
        });
    }

    _renderButton() {
        const {disabled, accessible, children, textStyle,arrowIconColor, isRTL} = this.props;
        const {buttonText,showDropdown} = this.state;
        const arrowIcon=showDropdown ?'arrow-up':'arrow-down';
        const arrowColor  = arrowIconColor || Colors.accent;
        const alignContentForText = isRTL ? 'flex-end' :'flex-start';
        const alignContentForIcon = isRTL ? 'flex-start' : 'flex-end';
        return (
            <TouchableOpacity ref={button => this._button = button}
                              disabled={disabled}
                              accessible={accessible}
                              onPress={this._onButtonPress}
                              onLayout={this.onLayout}>
                {
                    children ||
                    (
                        <View style={[styles.mainView, {flexDirection: isRTL? 'row-reverse': 'row'}]}>
                            <View style={[isRTL ? {paddingStart: MarginConstants.tab1} : {paddingEnd: MarginConstants.tab1},{justifyContent: alignContentForText ,alignItems: alignContentForText, flex: .9}]}>
                                <Text numberOfLines={1}
                                      style={[styles.buttonText,textStyle, {textAlign: isRTL ? 'right' : 'left'}]}
                                >{buttonText}
                                </Text>
                            </View>
                            <View style={[isRTL ? styles.dropdownLeftArrow : styles.dropdownArrow, {justifyContent: 'center',alignItems: alignContentForIcon, flex: .1}]}>
                                <Icon name= {arrowIcon} size={15} color={arrowColor}/>
                            </View>
                        </View>
                    )
                }
            </TouchableOpacity>
        );
    }

    _onButtonPress = () => {
        const {onDropdownWillShow} = this.props;
        if (!onDropdownWillShow ||
            onDropdownWillShow() !== false) {
            this.show();
        }
    };

    onLayout=(event) => {
        dropDownWidth = event.nativeEvent.layout.width;
    }

    _renderModal() {
        const {animated, accessible, dropdownStyle} = this.props;
        const {showDropdown, loading} = this.state;
        if (showDropdown && this._buttonFrame) {
            const frameStyle = this._calcPosition();
            const animationType = animated ? 'fade' : 'none';
            return (
                <Modal animationType={animationType}
                       visible={true}
                       transparent={true}
                       onRequestClose={this._onRequestClose}
                       supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
                     <TouchableWithoutFeedback accessible={accessible}
                                               disabled={!showDropdown}
                                               onPress={this._onModalPress}>
                        <View style={styles.modal}>
                            <View style={[styles.dropdown,{width:dropDownWidth, borderColor: Colors.darkGrey,backgroundColor: Colors.white},dropdownStyle, frameStyle]}>
                                {loading ? this._renderLoading() : this._renderDropdown()}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            );
        }
    }

    _calcPosition() {
        const {dropdownStyle, style, adjustFrame, options} = this.props;

        const dimensions = Dimensions.get('window');
        const windowWidth = dimensions.width;
        const windowHeight = dimensions.height;

        /*const dropdownHeight = (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
            StyleSheet.flatten(styles.dropdown).height;*/
        let dropdownHeight=null;
        if(options.length < 5)
            dropdownHeight =(MarginConstants.tab4 + StyleSheet.hairlineWidth) * options.length;
        else
            dropdownHeight =(MarginConstants.tab4 + StyleSheet.hairlineWidth) * 5;

        const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
        const rightSpace = windowWidth - this._buttonFrame.x;
        const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
        const showInLeft = rightSpace >= this._buttonFrame.x;

        const positionStyle = {
            height: dropdownHeight,
            top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
        };

        if (showInLeft) {
            positionStyle.left = this._buttonFrame.x;
        } else {
            const dropdownWidth = (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
                (style && StyleSheet.flatten(style).width) || -1;
            if (dropdownWidth !== -1) {
                positionStyle.width = dropdownWidth;
            }
            positionStyle.right = rightSpace - this._buttonFrame.w;
        }

        return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
    }

    _onRequestClose = () => {
        const {onDropdownWillHide} = this.props;
        if (!onDropdownWillHide ||
            onDropdownWillHide() !== false) {
            this.hide();
        }
    };

    _onModalPress = () => {
        const {onDropdownWillHide} = this.props;
        if (!onDropdownWillHide ||
            onDropdownWillHide() !== false) {
            this.hide();
        }
    };

    _renderLoading() {
        return (
            <ActivityIndicator size='small'/>
        );
    }

    _renderDropdown() {
        const {scrollEnabled, renderSeparator, showsVerticalScrollIndicator, keyboardShouldPersistTaps} = this.props;
        let yPosition=0;
        const {selectedIndex} = this.state;
        if(selectedIndex > 4)
            yPosition=((selectedIndex - 2)  * MarginConstants.tab3);

        return (
            <ListView scrollEnabled={scrollEnabled}
                      style={styles.list}
                      ref = {(ref)=> {this.listView = ref}}
                      dataSource={this._dataSource}
                      renderRow={this._renderRow}
                      renderSeparator={renderSeparator || this._renderSeparator}
                      onLayout={(event) => {this.listView.scrollTo({x: 0, y: yPosition, animated: false})}}
                      automaticallyAdjustContentInsets={false}
                      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            />
        );
    }

    get _dataSource() {
        const {options} = this.props;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        return ds.cloneWithRows(options);
    }

    _renderRow = (rowData, sectionID, rowID, highlightRow) => {
        const {renderRow, dropdownTextStyle, dropdownTextHighlightStyle, accessible} = this.props;
        const {selectedIndex} = this.state;
        const key = `row_${rowID}`;
        const highlighted = rowID == selectedIndex;
        const row = !renderRow ?
            (<Text style={[
                {color: Colors.darkGrey, backgroundColor: Colors.white},
                styles.rowText,
                dropdownTextStyle,
                highlighted && {color: Colors.black},
                highlighted && dropdownTextHighlightStyle
            ]}
            >
                {rowData}
            </Text>) :
            renderRow(rowData, rowID, highlighted);
        const preservedProps = {
            key,
            accessible,
            onPress: () => this._onRowPress(rowData, sectionID, rowID, highlightRow),
        };
        if (TOUCHABLE_ELEMENTS.find(name => name == row.type.displayName)) {
            const props = {...row.props};
            props.key = preservedProps.key;
            props.onPress = preservedProps.onPress;
            const {children} = row.props;
            switch (row.type.displayName) {
                case 'TouchableHighlight': {
                    return (
                        <TouchableHighlight {...props}>
                            {children}
                        </TouchableHighlight>
                    );
                }
                case 'TouchableOpacity': {
                    return (
                        <TouchableOpacity {...props}>
                            {children}
                        </TouchableOpacity>
                    );
                }
                case 'TouchableWithoutFeedback': {
                    return (
                        <TouchableWithoutFeedback {...props}>
                            {children}
                        </TouchableWithoutFeedback>
                    );
                }
                case 'TouchableNativeFeedback': {
                    return (
                        <TouchableNativeFeedback {...props}>
                            {children}
                        </TouchableNativeFeedback>
                    );
                }
                default:
                    break;
            }
        }
        return (
            <TouchableHighlight {...preservedProps}>
                {row}
            </TouchableHighlight>
        );
    };

    _onRowPress(rowData, sectionID, rowID, highlightRow) {
        const {onSelect, renderButtonText, onDropdownWillHide, dropDownTag} = this.props;
        if (!onSelect || onSelect(rowID, rowData, dropDownTag) !== false) {
            highlightRow(sectionID, rowID);
            const value = renderButtonText && renderButtonText(rowData) || rowData.toString();
            this._nextValue = value;
            this._nextIndex = rowID;
            this.setState({
                buttonText: value,
                selectedIndex: rowID
            });
        }
        if (!onDropdownWillHide || onDropdownWillHide() !== false) {
            this.setState({
                showDropdown: false
            });
        }
    }

    _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
        const key = `spr_${rowID}`;
        return (
            <View style={[styles.separator, {backgroundColor: Colors.darkerGrey}]}
                  key={key}
            />
        );
    };
}




