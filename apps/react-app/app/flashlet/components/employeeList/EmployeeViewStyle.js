import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: 'column'
  },
  cell: {
    flex: 1,
    paddingTop: 16,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 16,
    alignItems: 'center',
    flexDirection: 'row'
  },
  employeeImage: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  employeeDetail: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between'
  },
  accessoryImage: {
    right: 8,
    width: 13,
    height: 22
  },
  text: {
    fontSize: 12,
    color: '#545E6B'
  },
  bottomView: {
    height: 0.5,
    backgroundColor: '#979797'
  },
  rightIcon: {
    right: 8,
    width: 13,
    height: 22
  },
  badgeCount: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loading: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default styles;
