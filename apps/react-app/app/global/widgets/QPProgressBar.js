import React, { Component } from 'react';
import {
    Dimensions
} from 'react-native';
import * as Progress from 'react-native-progress';
const { height, width } = Dimensions.get('window');
export default class QPProgressBar extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        if (this.props.isLoading)
            return (
                <Progress.Bar borderColor='transparent'
                    color={'#c0511c'}
                    indeterminate={true}
                    width={width}
                    style={[{ backgroundColor: '#f5821f' }, this.props.style]}
                    height={3}
                    borderWidth={0} />
            );
            return null;
    }
}