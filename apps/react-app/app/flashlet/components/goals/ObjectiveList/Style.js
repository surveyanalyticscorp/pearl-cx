import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  item: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  number: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0.3,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightIcon: {
    right: 8,
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#003366',
    borderRadius: 2
  },
  title: {
    flex: 1,
    paddingLeft: 12
  },
  headerContainer: {
    height: 48,
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
  headerArchive: {
    fontSize: 8,
    color: 'gray'
  },
  headerRight: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    flex: 1,
    // width: width,
    // height: 300,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    padding: 6,
    borderRadius: 4,
    color: '#003366'
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
  addGoal: {
    width: width,
    height: 40,
    top: height - 100,
    position: 'absolute'
  },
  actionButtonIcon: {
    height: 22,
    fontSize: 20,
    color: 'white'
  },
  archiveButtonContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  extraView: {
    height: 5
  },
  archiveButtonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  archiveButtonContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  archiveButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 8
  },
  customAddIcon: {
    position: 'absolute',
    left: width - 85,
    top: height - 150,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgb(4, 52, 100)',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default styles;
