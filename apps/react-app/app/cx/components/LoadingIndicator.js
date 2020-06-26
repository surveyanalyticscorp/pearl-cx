import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Platform
} from 'react-native';

export default class LoadingIndicator extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {visible,style} = this.props;
        if(visible) {
            return (
                <View style={[style,{justifyContent: 'center', alignItems: 'center', flex: 1, position:'absolute',
                    right:0,
                    left: 0,
                    top:0,
                    bottom: 0,
                    backgroundColor:'#AA000000'}]}>
                    <Image style={styles.loading} source={this.getLoadingImage()}/>
                </View>);
        }
        return null;
    }

    getLoadingImage(){
        if(Platform.OS !== 'ios'){
            return require('../../global/images/loader_dots.gif');
        }
        return ({uri:'loader_dots.gif' })
    }
}

const styles = StyleSheet.create({
    loading: {

        height: 50,
        width: 50,
    }
})
