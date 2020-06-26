import { StyleSheet } from 'react-native';
import { responsiveFontSize } from '../../../common/font';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: 'white'
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    cell: {
        padding: 5,
        marginLeft: 3,
        marginRight: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: responsiveFontSize(2),
        color: '#9B9B9B',
    },
    underLine: {
        height: 1,
    },
    bottomContainerLight: {
        position: 'absolute',
        bottom: 92,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.63)'
    },
    bottomContainerDark: {
        position: 'absolute',
        bottom: 52,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.88)'
    },
    bottomContainerFixed: {
        height: 52,
        backgroundColor: 'white',
    },
    dragIcon: {
        color: '#9B9B9B',
        fontSize: 11,
        marginRight: 5,
        marginTop: 2

    }
});

export default styles;
