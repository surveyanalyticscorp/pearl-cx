import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    item: {
        flex: 1,
        width: width,
        flexDirection: 'row'
    },
    content: {
        flex: 1,
        padding: 10,
        marginTop: 10,
        backgroundColor: 'rgb(248, 248, 248)'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    categoryTxt: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgb(103, 106, 113)'
    },
    reviewCategoryLayout: {
        marginTop: 10,
        width: width - 20,
        flexDirection: 'row'
    },
    reivewCategoryItem: {
        flex: 1,
        padding: 2,
        marginRight: 10,
        borderColor: '#f00',
        borderBottomWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            android: { borderWidth: 0.5 },
            ios: { borderWidth: 1 }
        })
    },
    categoryItemTxt: {
        fontSize: 11,
        color: '#f00'
    },
    commentBox: {
        flex: 1,
        padding: 4,
        fontSize: 12,
        color: '#888',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
        minHeight: height / 2 - 20,
        textAlignVertical: 'top'
    },

    buttonContainer: {
        flex: 0,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        flex: 0,
        height: 37,
        padding: 20,
        width: width - 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(37, 137, 228)'
    },
    buttonTxt: {
        color: '#fff',
        fontWeight: 'bold'
    }
});

export default styles;
