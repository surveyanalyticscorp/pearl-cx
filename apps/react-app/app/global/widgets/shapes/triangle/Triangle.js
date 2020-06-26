import React, {Component} from 'react';
import{
    View,
    StyleSheet
} from 'react-native';
export default class Triangle extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {color, inverse} = this.props;
        return (
            <View style={[styles.triangle, this.props.style, {borderBottomColor:color, transform: [
                    {rotate: inverse? '180deg': '0deg'}
                ]}]} />
        )
    }


}

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 16,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'red'
    }
});


