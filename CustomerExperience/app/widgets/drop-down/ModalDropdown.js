'use strict';

import React, {useState, useEffect, useRef, useCallback} from 'react';

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Pressable,
  TouchableHighlight,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';
import {styles} from './DropdownStyle';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';

const TOUCHABLE_ELEMENTS = [
  'TouchableHighlight',
  'Pressable',
  'TouchableWithoutFeedback',
  'TouchableNativeFeedback',
];

let dropDownWidth = 100;

const ModalDropdown = ({
  disabled = false,
  scrollEnabled = true,
  defaultIndex = -1,
  defaultValue = 'Please select...',
  options = null,
  animated = true,
  showsVerticalScrollIndicator = true,
  keyboardShouldPersistTaps = 'never',
  accessible,
  style,
  textStyle,
  dropdownStyle,
  dropdownTextStyle,
  dropdownTextHighlightStyle,
  adjustFrame,
  renderRow,
  renderSeparator,
  renderButtonText,
  onDropdownWillShow,
  onDropdownWillHide,
  onSelect,
  arrowIconColor,
  isRTL,
  children,
  ...rest
}) => {
  const buttonRef = useRef(null);
  const buttonFrameRef = useRef(null);
  const nextValueRef = useRef(null);
  const nextIndexRef = useRef(null);
  const flatListRef = useRef(null);

  const [accessibleState] = useState(!!accessible);
  const [loading, setLoading] = useState(!options);
  const [showDropdown, setShowDropdown] = useState(false);
  const [buttonText, setButtonText] = useState(defaultValue);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  useEffect(() => {
    setButtonText(defaultValue);
  }, [defaultValue]);

  const updatePosition = useCallback(callback => {
    if (buttonRef.current?.measure) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        buttonFrameRef.current = {x: px, y: py, w: width, h: height};
        callback?.();
      });
    }
  }, []);

  const show = useCallback(() => {
    updatePosition(() => setShowDropdown(true));
  }, [updatePosition]);

  const hide = useCallback(() => {
    setShowDropdown(false);
  }, []);

  const select = useCallback(
    idx => {
      let value = defaultValue;
      if (idx == null || !options || idx >= options.length) {
        idx = defaultIndex;
      }
      if (idx >= 0) {
        value = renderButtonText
          ? renderButtonText(options[idx])
          : options[idx].toString();
      }
      nextValueRef.current = value;
      nextIndexRef.current = idx;
      setButtonText(value);
      setSelectedIndex(idx);
    },
    [defaultValue, options, defaultIndex, renderButtonText],
  );

  const onLayout = useCallback(event => {
    dropDownWidth = event.nativeEvent.layout.width;
  }, []);

  const onButtonPress = useCallback(() => {
    if (!onDropdownWillShow || onDropdownWillShow() !== false) {
      show();
    }
  }, [onDropdownWillShow, show]);

  const onRequestClose = useCallback(() => {
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      hide();
    }
  }, [onDropdownWillHide, hide]);

  const onModalPress = useCallback(() => {
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      hide();
    }
  }, [onDropdownWillHide, hide]);

  const calcPosition = useCallback(() => {
    const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
    const frame = buttonFrameRef.current;

    const dropdownHeight =
      options.length < 5
        ? (MarginConstants.tab4 + StyleSheet.hairlineWidth) * options.length
        : (MarginConstants.tab4 + StyleSheet.hairlineWidth) * 5;

    const bottomSpace = windowHeight - frame.y - frame.h;
    const rightSpace = windowWidth - frame.x;
    const showInBottom =
      bottomSpace >= dropdownHeight || bottomSpace >= frame.y;
    const showInLeft = rightSpace >= frame.x;

    const positionStyle = {
      height: dropdownHeight,
      top: showInBottom
        ? frame.y + frame.h
        : Math.max(0, frame.y - dropdownHeight),
    };

    if (showInLeft) {
      positionStyle.left = frame.x;
    } else {
      const dropdownWidth =
        (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
        (style && StyleSheet.flatten(style).width) ||
        -1;
      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }
      positionStyle.right = rightSpace - frame.w;
    }

    return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
  }, [options, dropdownStyle, style, adjustFrame]);

  const onRowPress = useCallback(
    (rowData, rowID, highlightRow) => {
      if (!onSelect || onSelect(rowID, rowData) !== false) {
        highlightRow.highlight(rowID);
        const value =
          (renderButtonText && renderButtonText(rowData)) ||
          rowData.toString();
        nextValueRef.current = value;
        nextIndexRef.current = rowID;
        setButtonText(value);
        setSelectedIndex(rowID);
      }
      if (!onDropdownWillHide || onDropdownWillHide() !== false) {
        setShowDropdown(false);
      }
    },
    [onSelect, renderButtonText, onDropdownWillHide],
  );

  const renderSeparatorDefault = useCallback(
    (sectionID, rowID) => (
      <View
        style={[styles.separator, {backgroundColor: Colors.darkerGrey}]}
        key={`spr_${rowID}`}
      />
    ),
    [],
  );

  const renderItem = useCallback(
    ({item, index, separators}) => {
      const key = `row_${index}`;
      const highlighted = index === selectedIndex;
      const row = !renderRow ? (
        <Text
          style={[
            styles.rowText,
            dropdownTextStyle,
            highlighted && styles.highlightedRowText,
            highlighted && dropdownTextHighlightStyle,
          ]}>
          {item}
        </Text>
      ) : (
        renderRow(item, index, highlighted)
      );
      const preservedProps = {
        key,
        accessible: accessibleState,
        onPress: () => onRowPress(item, index, separators),
      };
      if (TOUCHABLE_ELEMENTS.find(name => name === row.type.displayName)) {
        const props = {...row.props, key: preservedProps.key, onPress: preservedProps.onPress};
        const {children: rowChildren} = row.props;
        switch (row.type.displayName) {
          case 'TouchableHighlight':
            return (
              <TouchableHighlight {...props}>{rowChildren}</TouchableHighlight>
            );
          case 'Pressable':
            return <Pressable {...props}>{rowChildren}</Pressable>;
          case 'TouchableWithoutFeedback':
            return (
              <TouchableWithoutFeedback {...props}>
                {rowChildren}
              </TouchableWithoutFeedback>
            );
          case 'TouchableNativeFeedback':
            return (
              <TouchableNativeFeedback {...props}>
                {rowChildren}
              </TouchableNativeFeedback>
            );
          default:
            break;
        }
      }
      return <TouchableHighlight {...preservedProps}>{row}</TouchableHighlight>;
    },
    [
      selectedIndex,
      renderRow,
      dropdownTextStyle,
      dropdownTextHighlightStyle,
      accessibleState,
      onRowPress,
    ],
  );

  const renderDropdownList = useCallback(() => {
    const initialIndex = options.findIndex(item => item === defaultValue);
    return (
      <FlatList
        ref={flatListRef}
        data={options}
        scrollEnabled={scrollEnabled}
        style={styles.list}
        keyExtractor={(item, i) => `key-${i}`}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator || renderSeparatorDefault}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        getItemLayout={(data, i) => ({
          length: MarginConstants.tab4,
          offset: MarginConstants.tab4 * i,
          index: i,
        })}
        initialScrollIndex={initialIndex}
        extraData={defaultValue}
      />
    );
  }, [
    options,
    scrollEnabled,
    renderItem,
    renderSeparator,
    renderSeparatorDefault,
    showsVerticalScrollIndicator,
    keyboardShouldPersistTaps,
    defaultValue,
  ]);

  const arrowIcon = showDropdown ? 'arrow-up' : 'arrow-down';
  const arrowColor = arrowIconColor || Colors.accent;
  const alignContentForText = isRTL ? 'flex-end' : 'flex-start';
  const alignContentForIcon = isRTL ? 'flex-start' : 'flex-end';

  const renderModalDropdown = () => {
    if (!showDropdown || !buttonFrameRef.current) {
      return null;
    }
    const frameStyle = calcPosition();
    const animationType = animated ? 'fade' : 'none';
    return (
      <Modal
        animationType={animationType}
        visible={true}
        transparent={true}
        onRequestClose={onRequestClose}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}>
        <TouchableWithoutFeedback
          accessible={accessibleState}
          disabled={!showDropdown}
          onPress={onModalPress}>
          <View style={styles.modal}>
            <View
              style={[
                styles.dropdown,
                {
                  width: dropDownWidth,
                  borderColor: Colors.darkGrey,
                  backgroundColor: Colors.white,
                },
                dropdownStyle,
                frameStyle,
              ]}>
              {loading ? (
                <ActivityIndicator size="small" />
              ) : (
                renderDropdownList()
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View {...rest}>
      <Pressable
        ref={buttonRef}
        disabled={disabled}
        accessible={accessibleState}
        onPress={onButtonPress}
        onLayout={onLayout}>
        {children || (
          <View
            style={[
              styles.mainView,
              {flexDirection: isRTL ? 'row-reverse' : 'row'},
            ]}>
            <View
              style={[
                isRTL
                  ? {paddingStart: MarginConstants.tab1}
                  : {paddingEnd: MarginConstants.tab1},
                {
                  justifyContent: alignContentForText,
                  alignItems: alignContentForText,
                  flex: 0.9,
                },
              ]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.buttonText,
                  textStyle,
                  {textAlign: isRTL ? 'right' : 'left'},
                ]}>
                {buttonText}
              </Text>
            </View>
            <View
              style={[
                isRTL ? styles.dropdownLeftArrow : styles.dropdownArrow,
                {
                  justifyContent: 'center',
                  alignItems: alignContentForIcon,
                  flex: 0.1,
                },
              ]}>
              <Icon name={arrowIcon} size={15} color={arrowColor} />
            </View>
          </View>
        )}
      </Pressable>
      {renderModalDropdown()}
    </View>
  );
};

ModalDropdown.propTypes = {
  disabled: PropTypes.bool,
  scrollEnabled: PropTypes.bool,
  defaultIndex: PropTypes.number,
  defaultValue: PropTypes.string,
  options: PropTypes.array,
  accessible: PropTypes.bool,
  animated: PropTypes.bool,
  showsVerticalScrollIndicator: PropTypes.bool,
  keyboardShouldPersistTaps: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  dropdownStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  dropdownTextStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  dropdownTextHighlightStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  adjustFrame: PropTypes.func,
  renderRow: PropTypes.func,
  renderSeparator: PropTypes.func,
  renderButtonText: PropTypes.func,
  onDropdownWillShow: PropTypes.func,
  onDropdownWillHide: PropTypes.func,
  onSelect: PropTypes.func,
};

export default ModalDropdown;
