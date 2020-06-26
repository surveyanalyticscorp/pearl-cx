import React, { Component } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    StyleSheet
} from 'react-native';

export default class ImageWithLoader extends Component {
    constructor(props) {
        super(props);
        this.state = { showLoader: false }
    }
    render() {
        const props = this.props;
        return (
            <View style={styles.container} pointerEvents={this.state.showLoader ? "none" : "auto"}>

                <View style={styles.content}>
                    <Image onLoadStart={() => {  console.log("On Load Start");this.setState({ showLoader: true }) }}
                        onLoadEnd={() => { console.log("On Load end");this.setState({ showLoader: false }) }}
                        {...props}
                           resizeMode={'contain'}
                        style={[styles.imageStyle, this.props.style]} />
                </View>
                {this.getSpinner()}
            </View>
        )
    }
    getSpinner() {
        let spinner = (this.state.showLoader) ? (
            <ActivityIndicator
                color={'#003566'}
                animating={true}
                size="small"
                style={{ flex: 1, position:'absolute', top:0,right:0,left:0,bottom:0 }}
            />
        ) : (
                null
            );
        return spinner;
    }
}
var styles = StyleSheet.create({
    container: {
       
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {

        flex: 1,
        width: undefined,
        height: undefined,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'

    },
  
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
       
    },
});