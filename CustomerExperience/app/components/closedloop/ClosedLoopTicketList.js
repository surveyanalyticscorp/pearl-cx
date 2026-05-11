import React from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import TicketCard from './TicketCard';
import QPSpinner from '../../widgets/QPSpinner';
import {NoTicketFound} from './NoTicketFound';

const ClosedLoopTicketList = ({
  onPressReset,
  onRefresh,
  refreshing,
  ticketList,
  isPagination,
  isTicketLoading,
  onPressHandler,
  selectedTickets,
  showCheckBox,
  loadMoreData,
}) => {
  return (
    <FlatList
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
      style={styles.flatList}
      contentContainerStyle={{flexGrow: 1}}
      data={ticketList}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.25}
      ListFooterComponent={isPagination ? <QPSpinner /> : <View />}
      extraData={[ticketList]}
      ListEmptyComponent={
        !isTicketLoading && !isPagination ? (
          <NoTicketFound onPressReset={onPressReset} />
        ) : (
          <View />
        )
      }
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => {
        return (
          <TicketCard
            data={item}
            index={index}
            showCheckBox={showCheckBox}
            isSelected={selectedTickets.includes(item.id)}
            onPressHandler={() => onPressHandler(item, index)}
          />
        );
      }}
    />
  );
};

export default ClosedLoopTicketList;

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
});
