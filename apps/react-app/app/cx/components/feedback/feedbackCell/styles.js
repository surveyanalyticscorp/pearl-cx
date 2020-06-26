import {StyleSheet,Platform} from 'react-native';

const styles = StyleSheet.create({
    cell: {
        marginBottom: 8,
        flexDirection: 'row'
    },
    score: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    rightContent: {
        flex: 1,
        flexDirection: 'column'
    },
    upperContent: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(205, 205, 205, 0.2)'
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
        paddingLeft: 8,
        paddingVertical: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(205, 205, 205, 0.4)',
    },
    rightIcon: {
        width: 32,
        height: 32
    },
    separator: {
        flex: 1,
        height: 2,
        backgroundColor: 'gray'
    },
    textSmall: {
        fontSize: 10
    },
    textMedium: {
        fontSize: 12
    },
    textLarge: {
        fontSize: 14
    },
    textExtraLarge: {
        fontSize: 22
    },
    grayText: {
        color: '#9b9b9b'
    },
    whiteText: {
        color: 'white'
    },
    boldText: {
        fontWeight: 'bold'
    },
    blueText: {
        color: 'rgb(29, 119, 186)'
    }
})

export default styles;
