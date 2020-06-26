import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontSize: 11
  },
  cell: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: 'white',
    margin: 4
  },
  score: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  rightContent: {
    flex: 1,
    flexDirection: 'column'
  },
  upperContent: {
    backgroundColor: '#cdcdcd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusImage: {
    width: 12,
    height: 12,
    marginLeft: 4
  },
  lowerContent: {
    paddingTop: 8,
    paddingLeft: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rightIcon: {
    width: 26,
    height: 26
  },
  separator: {
    height: 2,
    flex: 1,
    backgroundColor: 'gray'
  }
})

export default styles;
