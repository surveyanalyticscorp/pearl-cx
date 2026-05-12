import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

const useSelectSegment = ({setSegmentSelection, refresh}) => {
  const navigation = useNavigation();

  const handleSegmentSelectionAction = useCallback(
    item => {
      refresh();
      setSegmentSelection(item);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
    [refresh, setSegmentSelection, navigation],
  );

  const clearSearchHandler = useCallback(() => {
    refresh();
  }, [refresh]);

  return {handleSegmentSelectionAction, clearSearchHandler};
};

export {useSelectSegment};
