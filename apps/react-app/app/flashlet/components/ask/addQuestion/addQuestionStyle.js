import {Dimensions, StyleSheet} from "react-native";
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
const styles = StyleSheet.create({
    selectQuestionTypeContainer: {
        marginTop: 60,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectQuestionTypeView: {
        padding: 10,
        height: Math.round(factor * 0.10),
        justifyContent: 'space-between',
        margin: 20
    },
    dynamicCommentToggleContainer: {
        marginTop: 40,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dynamicCommentTextStyle: {
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dynamicCommentTextInputStyle: {
        backgroundColor: '#ffffff',
        marginTop: 30,
        marginHorizontal: 20,
        padding: 5,
        height: Math.round(factor * 0.10),
        borderWidth: 2,
        borderColor: '#eee',
    },
    questionTextStyle: {
        alignItems: 'flex-start',
        color: '#aeaeae',
        margin: 5,
        justifyContent: 'center'
    },
    questionContainer: {
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    inputText: {
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#f3f3f3',
        padding: 5,
        height: Math.round(factor * 0.10),
        fontFamily: global.primaryText,
        fontSize: global.h2FontSize
    },
    submitButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    submitButtonView: {
        height: 36,
        borderWidth: 1,
        alignItems: 'center',
        width: '100%',
        borderColor: '#1B87E6',
        justifyContent: 'center',
        backgroundColor: '#1B87E6'
    }
});

export default styles;