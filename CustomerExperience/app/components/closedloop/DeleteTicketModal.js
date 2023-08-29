import React from 'react';
import {Platform, StyleSheet, Text, View, Modal} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';

export default function DeleteTicketModal({showModal, setShowModal, ticketId}) {
  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      onRequestClose={() => {
        setShowModal(false);
      }}
      visible={showModal}
      supportedOrientations={['portrait']}>
      <View style={{flex: 1}}>
        <Text>{ticketId}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    marginHorizontal: MarginConstants.tab1,
    marginTop:
      Platform.OS === 'ios' ? MarginConstants.tab4 : MarginConstants.tab1,
  },
});
