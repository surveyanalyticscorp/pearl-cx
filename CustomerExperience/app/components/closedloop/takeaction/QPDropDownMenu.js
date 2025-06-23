import React from 'react';
import {FlatList, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';

const QPDropDownMenu = ({
  visible,
  onClose,
  anchorPosition,
  items,
  onSelectItem,
  selectedItem,
}) => {
  const renderItem = ({item}) => (
    <Pressable
      style={[
        styles.menuItem,
        selectedItem === item && styles.selectedMenuItem,
      ]}
      onPress={() => {
        onSelectItem(item);
        onClose();
      }}>
      <Text
        style={[
          styles.menuItemText,
          selectedItem === item && styles.selectedMenuItemText,
        ]}>
        {item}
      </Text>
    </Pressable>
  );

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.menuContainer,
            {
              bottom: anchorPosition.y,
              left: anchorPosition.x,
            },
          ]}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: PaddingConstants.halfTab,
    minWidth: MarginConstants.tab1_16x + MarginConstants.tab1_4x,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: PaddingConstants.tab1,
  },
  selectedMenuItem: {
    backgroundColor: Colors.accentLight,
  },
  menuItemText: {
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    color: Colors.filterIconColor,
  },
  selectedMenuItemText: {
    color: Colors.white,
  },
});

export default QPDropDownMenu;
