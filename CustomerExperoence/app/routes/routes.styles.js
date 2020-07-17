import {StyleSheet} from 'react-native';
import {Colors} from '../styles/color.constants';

export const routesStyles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.transparent,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  userEmail: {
    marginTop: 20,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  navDrawerHeaderImageContainer: {
    flex: 0.3,
    justifyContent: 'center',
    backgroundColor: Colors.transparent,
  },
  navDrawerHeaderImage: {
    height: 40,
    width: undefined,
    marginTop: 50,
  },
});
