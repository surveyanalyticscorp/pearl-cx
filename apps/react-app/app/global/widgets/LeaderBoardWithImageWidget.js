import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Dimensions,
    Platform,
    Image
} from 'react-native';
import QPCard from './card/QPCard';
import CustomText from '../ui/CustomText';
import colorCodes from './typography/ColorCodes';
import renderIf from '../renderIf';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
const CachedImage = require('../ImageCache/CachedImage');
export default class LeaderBoardWithImageWidget extends Component {


    getQPointgrowthImage() {
        if (this.props.leaderBoardData.memberQPointGrowth) {
            var qpointGrowthInt = parseInt(this.props.QPointGrowth, 10);

            if (qpointGrowthInt > 0) {
                if (Platform.OS != 'ios') {
                    return require('../images/up_arrow_green.png');
                } else {
                    return { uri: 'up_arrow_green.png' };
                }
            }
            else {
                if (Platform.OS != 'ios') {
                    return require('../images/down_arrow_red.png');
                } else {
                    return { uri: 'down_arrow_red.png' };
                }
            }
        }
    }

    getQPointgrowthText() {
        if (this.props.leaderBoardData.memberQPointGrowth) {
            return this.props.leaderBoardData.memberQPointGrowth;
        } else {
            return '';
        }
    }

    getQPointText() {
        if (this.props.QPointGrowth) {
            return this.props.QPoint + " "+this.props.pointsText || 'Points';
        } else {
            return '';
        }
    }

    getProfilePicURL() {
        var external = RegExp('^(https?:)?//');
        if(external.test(this.props.profilepic)){
            return { uri: this.props.profilepic};
        }else{
            return { uri: global.BASE_URL + this.props.profilepic};
        }
    }

    render() {
        return (

            <TouchableHighlight onPress={this.props.onPress}

                activeOpacity={0.6}
                underlayColor={'#CCCCCC'}>
                <View style={styles.mainContainer}>
                    <View style={styles.indexContainer}>
                        <View style={styles.indexParent}>
                            <CustomText style={styles.indexText}>{this.props.index}</CustomText>
                        </View>
                    </View>
                    <View style={styles.profilePicContainer}>
                        <CachedImage style={styles.profileImage} source={this.getProfilePicURL()} />
                    </View>
                    <View style={styles.userDetailContainer}>
                        <View style={styles.titleContainer} >

                            <CustomText style={[styles.titleText, { flex: 0.75 }]} numberOfLines={1} ellipsizeMode='tail'>
                                {this.props.title}
                            </CustomText>


                        </View>
                        <View style={styles.subtitleContainer} >
                            <CustomText style={styles.subtitleText}>
                                {this.getQPointText()}
                            </CustomText>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row',paddingHorizontal:8 }}>
                        {renderIf(parseInt(this.props.QPointGrowth) != 0)(

                            <Image style={{ width: 15, height: 15 }} source={this.getQPointgrowthImage()} />

                        )
                        }
                        <View>
                            <CustomText style={styles.qpointText}>{this.getQPointgrowthText()}</CustomText>
                        </View>
                    </View>

                </View>
            </TouchableHighlight>

        );
    }

};

// LeaderBoardWithImageWidget.defaultProps = {
//     index: React.PropTypes.number,
//     profilepic: React.PropTypes.string,
//     title: React.PropTypes.string,
//     QPoint: React.PropTypes.number,
//     rewardpic: React.PropTypes.string,
//     QPointGrowth: React.PropTypes.number,
//     leaderBoardData: React.PropTypes.object
// };
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#ffffff',
        marginTop: 0,
        flex: 1,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 0
    },
    indexContainer: {
        flex: 0.1,
        
    },
    indexParent: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center'
    },
    indexText: {
        color: '#D1001D',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    profilePicContainer: {
        flex: 0.15,
        alignItems: 'center',

        margin: 8
    },
    profileImage: {
        backgroundColor: '#ffffff',
        height: Math.round(factor * 0.10),
        borderRadius: Math.round(factor * 0.10) / 2,
        width: Math.round(factor * 0.10)
    },
    userDetailContainer: {
        flex: 1.0,
        marginLeft: 10,
        flexDirection: 'column',

        marginTop: 12,
        
    },
    titleContainer: {
        flex: 0.5,
        flexDirection: 'row',

    },
    titleText: {
        color: '#393939',
        fontSize: 16,
        textAlign: 'left',

    },
    qpointText: {
        fontSize: global.h2FontSize,
        color: '#393939',
        textAlign: 'center'
    },
    subtitleContainer: {
        flex: 0.7,
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',

    },
    subtitleText: {
        fontSize: 10,
        color: '#b0b0b0',
        textAlign: 'left'
    },

});

