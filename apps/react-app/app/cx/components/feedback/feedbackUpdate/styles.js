import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const sliderItemWidth = width / 4;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputContainer: {
        marginBottom: 10
    },
    textInputWrapper: {
        padding: 10
    },
    textInput: {
        padding: 6,
        fontSize: 12,
        height: 150,
        borderWidth: 1,
        textAlignVertical: 'top'
    },
    sliderContainer: {
        padding: 10
    },
    sliderTextWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textMedium: {
        fontSize: 13
    },
    textLarge: {
        fontSize: 14
    },
    whiteText: {
        color: 'white'
    },
    greyText: {
        color: 'grey'
    },
    orangeText: {
        color: 'orange'
    },
    greenText: {
        color: 'green'
    },
    redText: {
        color: 'red',
    },
    underline: {
        height: 2,
        backgroundColor: 'rgb(29, 119, 186)'
    },
    sliderWrapper: {
        paddingHorizontal: 10
    },
    slider: {
        width: 10,
        height: 20,
        borderRadius: 5,
        backgroundColor: '#CCCCCC'
    },
    sliderOverlay: {
        top: 0,
        height: 60,
        position: 'absolute',
        width: sliderItemWidth,

    }
});

export default styles;
