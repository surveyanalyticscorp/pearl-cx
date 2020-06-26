import { Dimensions, StyleSheet } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const factor = WINDOW_WIDTH > WINDOW_HEIGHT ? WINDOW_HEIGHT : WINDOW_WIDTH;

const styles = StyleSheet.create({
    imageContainer: {
        height: 60,
        alignItems: 'center',
        backgroundColor: 'white',
        margin: 6
    },
    profileImage: {
        backgroundColor: '#ffffff',
        height: 60,
        width: 60,
        overflow: "hidden",
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardHeaderStyle : {
        flex:1,
        height: 30,
        paddingHorizontal: 12,
        marginVertical: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
        alignItems: 'center',
    },
    cardHeaderDateTextStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b717c',
    },
    cardHeaderQuestionCountContainerStyle : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHeaderQuestionCountTextStyle: {
        fontSize: 12,
        color: '#b6b6b6',
    },
    cardContainerStyle: {
        margin: 5,
        backgroundColor: '#ffffff'
    },
    rowItemStyle : {
        flex: 1,
        margin: 5,
        padding: 5,
        flexDirection: 'row'
    },
    questionTextStyle: {
        fontSize: 16,
        color: '#5796e4',
        fontWeight: 'bold',
        flexWrap:"wrap"
    },
    questionOwnerNameStyle : {
        fontSize: 13,
        fontWeight: 'bold'
    },
    addQuestionTextStyle: {
        fontWeight: 'bold',
        textAlignVertical: 'center',
        color: '#5796e4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginVertical: 15,
        flex: 1,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        width: WINDOW_WIDTH - 26 * 2,
        marginRight: 18,
        marginLeft: 18,
        borderRadius: 2,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#ededed',
        backgroundColor: '#ffffff'
    }
});


export default styles;