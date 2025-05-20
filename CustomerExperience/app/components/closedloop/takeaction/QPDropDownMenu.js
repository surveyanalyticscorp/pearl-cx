import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
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
              bottom: anchorPosition.y + MarginConstants.tab1_8x, // Add some padding from the button
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: PaddingConstants.halfTab,
    minWidth: 150,
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
    borderRadius: 4,
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
