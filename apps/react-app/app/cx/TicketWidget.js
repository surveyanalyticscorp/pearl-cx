import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text
} from 'react-native';

import CustomText from '../global/ui/CustomText';
import colorCodes from '../global/widgets/typography/ColorCodes';
import TimeAgo from '../global/TimeAgo';
import ReadMore from '@exponent/react-native-read-more-text';
export default class TicketWidget extends Component {

    render() {
        return (

            <TouchableHighlight onPress={this.props.onPress}

                activeOpacity={0.6}
                underlayColor={'#CCCCCC'}>
                <View style={styles.mainContainer}>
                    <CustomText style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>{this.props.name}</CustomText>
                    <TimeAgo style={styles.subtitle} time={this.props.time} />
                    <View style={{ marginTop: 10 }}>
                        <ReadMore numberOfLines={3}
                            renderTruncatedFooter={this._renderTruncatedFooter}
                            renderRevealedFooter={this._renderRevealedFooter}>
                            <CustomText style={styles.comment}>
                                {this.props.comment ? this.props.comment : "No comments."}
                            </CustomText>
                        </ReadMore>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    _renderTruncatedFooter = (handlePress) => {
        return (
            <CustomText style={{ color: 'blue', marginTop: 5, fontSize: 12 }} onPress={handlePress}>
                Read more
      </CustomText>
        );
    };

    _renderRevealedFooter = (handlePress) => {
        return (
            <CustomText style={{ color: 'blue', marginTop: 5, fontSize: 12 }} onPress={handlePress}>
                Show less
      </CustomText>
        );
    }
};
TicketWidget.defaultProps = {
    name: 'Customer Experience',
    time: '2016-10-17 00:46:17.0',
    comment: 'I am not able to login to my account. It keeps saying invalid login credentials. Can someone please give me a call at my below mentioned number.',

};
const styles = StyleSheet.create({

    mainContainer: {
        backgroundColor: '#ffffff',
        marginTop: 10,
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 10,
        marginRight: 10,
        minHeight: 120,
        padding: 10,
    },
    title: {
        color: '#393939',
        fontSize: 16,
        textAlign: 'left'
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
        color: '#393939',
        textAlign: 'left'
    },
    comment: {
        fontSize: 12,
        color: '#393939',
        textAlign: 'left'
    }
});