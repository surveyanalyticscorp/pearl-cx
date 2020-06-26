import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Modal,
    Platform
} from 'react-native';

const OS = Platform.OS;
const {height, width} = Dimensions.get('window');
const CachedImage = require('../ImageCache/CachedImage');
import {Actions} from 'react-native-router-flux';
import ImageZoom from 'react-native-image-pan-zoom';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class DetailImageView extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Modal animationType={OS === 'ios' ? "fade" : "none"} transparent
                   onRequestClose={() => {
                   }}
                   supportedOrientations=
                       {['portrait', 'landscape', 'landscape-left', 'landscape-right']}>
                <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                    <View style={styles.parent}>
                        <Icon
                            style={{position: 'absolute', top: 50, right: 10, zIndex: 10}}
                            name='clear'
                            size={20}
                            color={'white'}
                        />
                        <ImageZoom cropWidth={width}
                                   cropHeight={height}
                                   imageWidth={width * 0.8}
                                   imageHeight={height * 0.5}
                                   pinchToZoom = {true}
                                   >
                            <CachedImage {...this.props}
                                         style={[styles.image]}
                                         resizeMode={'contain'}/>
                        </ImageZoom>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )

    }

}

const styles = StyleSheet.create({
    image: {
        minHeight: height * 0.5,
        minWidth: width * 0.8,
    },
    parent: {

        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000000DD",
        justifyContent: "center",
        alignItems: "center",

    }


});