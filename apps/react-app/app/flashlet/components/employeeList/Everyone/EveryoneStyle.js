import {StyleSheet, Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
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
    overlay: {
        width,
        height,
        top: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    },

    overlayTxt: {
        padding: 5,
        fontWeight: 'bold',
        marginLeft: width / 2 - 80,
        marginTop: height / 2 - 100
    },

    info: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorTxt: {
        padding: 5,
        fontSize: 12
    },
    buttonContainer: {
        height: 36,
        borderWidth: 1,
        alignItems: 'center',
        width: width - 26 * 2,
        borderColor: '#1B87E6',
        justifyContent: 'center',
        backgroundColor: '#1B87E6',
        zIndex: 10,
        position: 'absolute'
    }
});

export default styles;
