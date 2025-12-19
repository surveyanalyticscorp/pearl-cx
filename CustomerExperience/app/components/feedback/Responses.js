import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {dashboardStyles} from '../dashboard/dashboard.style';
import FeedbackCell from './feedbackCell/FeedbackCells';
import {useNavigation} from '@react-navigation/native';
import {translate} from '../../Utils/MultilinguaUtils';
import {PaddingConstants} from '../../styles/padding.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {EmptyView} from '../closedloop/EmptyComment';

const Responses = ({
  onRefresh,
  onEndReached,
  isLoading,
  testID,
  isPagination,
}) => {
  const navigation = useNavigation();
  const allResponses = useSelector(state => state.response.allResponses);
  const authToken = useSelector(state => state.global.authToken);
  const onPressRow = data => {
    navigation.navigate(translate('responses.feedback_details'), {
      data: data,
      isFromFeedback: true,
      token: authToken,
      parentRoute: translate('responses.responses'),
    });
  };
  const rowItem = ({item, index}) => {
    return (
      <FeedbackCell
        item={item}
        index={index}
        onSelect={() => onPressRow(item)}
        origin="List"
      />
    );
  };

  if (allResponses.length === 0) {
    return (
      <EmptyView
        title={isLoading ? 'Loading responses' : 'No responses to display'}
        subTitle={'Check back later'}
      />
    );
  }

  return (
    <View
      testID={testID ?? 'responses-component'}
      style={dashboardStyles.container}>
      <FlatList
        testID={'flatlist-feedback'}
        data={allResponses}
        renderItem={rowItem}
        keyExtractor={item => item.responseSetID + ''}
        onEndReachedThreshold={0.25}
        onEndReached={onEndReached}
        refreshing={false}
        onRefresh={onRefresh}
        extraData={[allResponses]}
        contentContainerStyle={styles.container}
        ListFooterComponent={() => (
          <View style={{paddingBottom: PaddingConstants.tab2}} />
        )}
      />
    </View>
  );
};

export default Responses;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    marginTop: MarginConstants.tab1,
  },
});
