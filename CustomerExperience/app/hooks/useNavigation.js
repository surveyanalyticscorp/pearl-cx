import {useNavigation as useReactNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const useActionNavigation = () => {
  const navigation = useReactNavigation();
  const panelMember = useSelector(state => state.dashboard.ticket.panelMember);
  const ticketId = useSelector(state => state.dashboard.ticket.id);

  const navigateToSendEmail = () => {
    navigation.navigate('sendEmail', {
      toEmail: panelMember?.email ?? '',
      ticketId,
    });
  };

  // Generic navigation method
  const navigateTo = (screenName, params = {}) => {
    navigation.navigate(screenName, params);
  };

  // Common navigation methods
  const goBack = () => {
    navigation.goBack();
  };

  const replace = (screenName, params = {}) => {
    navigation.replace(screenName, params);
  };

  const reset = routeConfig => {
    navigation.reset(routeConfig);
  };

  const push = (screenName, params = {}) => {
    navigation.push(screenName, params);
  };

  const pop = (count = 1) => {
    navigation.pop(count);
  };

  return {
    navigateToSendEmail,
    navigateTo,
    goBack,
    replace,
    reset,
    push,
    pop,
    // Expose the raw navigation object for advanced use cases
    navigation,
  };
};

export default useActionNavigation;
