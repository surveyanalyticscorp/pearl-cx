import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {dashboardStyles} from '../dashboard/dashboard.style';
import FeedbackCell from './FeedbackCells';
import {useNavigation} from '@react-navigation/native';
import {translate} from '../../Utils/MultilinguaUtils';
import {PaddingConstants} from '../../styles/padding.constants';
import {MarginConstants} from '../../styles/margin.constants';
import NoResponsesFound from './NoResponsesFound';

const Responses = ({onRefresh, onEndReached}) => {
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

  return (
    <View style={dashboardStyles.container}>
      <FlatList
        data={allResponses}
        renderItem={rowItem}
        keyExtractor={item => item.responseSetID + ''}
        onEndReachedThreshold={0.25}
        onEndReached={onEndReached}
        refreshing={false}
        ListEmptyComponent={<NoResponsesFound />}
        onRefresh={onRefresh}
        extraData={[allResponses]}
        contentContainerStyle={styles.container}
        ListFooterComponent={() => (
          <View style={{paddingBottom: PaddingConstants.tab2}} />
        )}
        // ListHeaderComponent={renderResponseFilterView}
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
