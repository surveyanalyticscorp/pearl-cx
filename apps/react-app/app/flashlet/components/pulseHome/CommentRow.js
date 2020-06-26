import React, { Component } from 'react';
import {

    View,
    Image,

    Platform
} from 'react-native';
import CustomText from '../../../global/ui/CustomText';
export default class CommentRow extends Component {
    constructor(props) {
        super(props);
    }

    getIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/no_photo_pulse.png');
        } else {
            return { uri: 'no_photo_pulse.png' };
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignSelf: 'stretch', marginHorizontal: 5 }}>
                <View style={{ paddingTop: 10 }}>
                    <Image style={{ height: 20, width: 20, borderRadius: Platform.OS!='ios'? 40:10, borderWidth:1, borderColor:'#6f6f6f'}} source={this.getIconImage()} />

                </View>
                <View style={{ alignItems: 'flex-start', flex: 1, marginLeft: 10 }}>
                    <View style={{ backgroundColor: this.props.color, padding: 10, borderRadius: 2 }}>
                        <View style={{
                            borderTopColor: this.props.color, left: -5, top: 10, position: 'absolute', width: 0, height: 0, borderRightWidth: 5, zIndex: 10,
                            borderTopWidth: 5, backgroundColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '180deg' }]
                        }} />
                        <CustomText style={{ color: this.props.textColor, fontSize: 10, fontFamily: global.semiBoldText }} numberOfLines={10}>{this.props.comment.text}</CustomText>
                    </View>
                </View>
            </View>
        )
    }

}
