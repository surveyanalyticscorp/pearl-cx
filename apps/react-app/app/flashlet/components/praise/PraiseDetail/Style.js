import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE'
  },
  image: {
    width: 50,
    height: 50
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,
    marginBottom: 2
  },
  headerAndroid: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8
  },
  headerDesc: {
    fontSize: 12,
    textAlign: 'center'
  },
  badgeUsers: {
    flex: 0.75,
    backgroundColor: '#EEEEEE',
    marginTop: 1
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 16,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  employeeImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0.8,
    borderColor: '#EEEEEE'
  },
  desc: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between'
  },
  userBadgeCount: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0
  },
  text: {
    fontSize: 12,
    color: '#545E6B'
  },
  bottomView: {
    height: 0.5,
    backgroundColor: '#979797'
  },
  addBadge: {
    width: width,
    height: 40,
    top: height - 100,
    position: 'absolute'
  },
  info: {
    flex: 1,
    width: width,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    padding: 6,
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
  customAddIcon: {
    position: 'absolute',
    left: width - 85,
    top: height - 145,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgb(4, 52, 100)',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default styles;
