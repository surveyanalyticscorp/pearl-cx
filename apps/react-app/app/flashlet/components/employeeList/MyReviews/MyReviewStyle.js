import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: 'column'
  },
  cell: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  employeeImage: {
    width: 32,
    height: 32,
    borderRadius: 16
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
  textMedium: {
    fontSize: 18
  },
  textSmall: {
    fontSize: 12
  },
  loading: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    flex: 1,
    top:20,
    bottom:20,
      height:50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightIcon: {
    right: 8,
    width: 13,
    height: 22
  }
});

export default styles;
