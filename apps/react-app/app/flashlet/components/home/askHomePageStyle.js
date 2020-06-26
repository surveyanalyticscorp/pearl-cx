import {Dimensions, StyleSheet} from "react-native";


const { width, height } = Dimensions.get('window');
const factor = width > height ? height : width;

const styles = StyleSheet.create({
    bottomButtonStyle : {
        height:25,
        width: 25,
        position: 'absolute',
        bottom: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        zIndex: 10
    },
    dynamicCommentTextStyle: {
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dynamicCommentTextInputStyle: {
        backgroundColor: '#ffffff',
        marginTop: 10,
        padding: 5,
        height: Math.round(factor * 0.30),
        borderWidth: 2,
        borderColor: '#eee',
    },
    mainModalContainerStyle: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
    },

    mainContainer: {
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    container: {
        padding: 4,
        height: 108,
        borderWidth: 2,
        borderRadius: 8,
        shadowOpacity: 0.3,
        borderColor: 'grey',
        alignItems: 'center',
        marginHorizontal: 12,
        marginTop: height / 3,
        backgroundColor: 'white'
    },
    submitButtonView: {
        height: 36,
        borderWidth: 1,
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
        borderColor: '#1B87E6',
        justifyContent: 'center',
        backgroundColor: '#1B87E6'
    }
});

export default styles;