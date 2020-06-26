import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  info: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-around'
  },
  desc: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 0.8,
    paddingLeft: 10
  },
  badgeCount: {
    flex: 0,
    width: 36,
    height: 36,
    borderWidth: 2,
    borderRadius: 18,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeCountTxt: {
    fontSize: 12
  },
  praiseDescTxt: {
    flex: 1,
    fontSize: 12,
    paddingTop: 5,
    flexWrap: 'wrap'
  },
  image: {
    flex: 0.2
  },
  imageIcon: {
    width: 50,
    height: 50
  },
  headerContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 48,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  headerLeft: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerCenter: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerRight: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default styles;
