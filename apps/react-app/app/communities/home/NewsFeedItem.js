import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Platform,
    TouchableWithoutFeedback,
    Linking,
    Text,
    Dimensions
} from 'react-native';
import CustomText from '../../global/ui/CustomText';
import ReadMore from '@exponent/react-native-read-more-text';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
import renderIf from '../../global/renderIf';

export default class NewsFeedItem extends Component {
    constructor(props) {
        super(props);
        this.newsFeedItem = props.newsFeedItem;
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={{ flex: 0.7 }}>
                    <CustomText style={styles.titleText} numberOfLines={3} ellipsizeMode={'tail'}>{this.newsFeedItem.title}</CustomText>
                    <View style={{ marginTop: 5 }}>
                        <ReadMore numberOfLines={3}
                            renderTruncatedFooter={this._renderTruncatedFooter}
                            renderRevealedFooter={this._renderRevealedFooter}>
                            <CustomText style={styles.description}>
                                {this.newsFeedItem.description ? this.newsFeedItem.description : "No description."}
                            </CustomText>
                        </ReadMore>
                        {renderIf(this.newsFeedItem.url)(
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                    let url = this.newsFeedItem.url
                                    if (this.newsFeedItem.url.includes('www.') && !url.includes('https://'))  {
                                        url = "https://" + this.newsFeedItem.url
                                    }
                                    if (!url.includes('https://')) {
                                        if (url.charAt(0) === '/') {
                                            url = url.substr(1);
                                        }
                                        url = global.BASE_URL + url
                                    }
                                    Linking.openURL(url).catch((err) => {
                                        console.error('An error occurred', err)
                                    });
                                }} >
                                <Text style={{color:"#00aaff", textDecorationLine: "underline"}}>{this.newsFeedItem.url}</Text>
                            </TouchableWithoutFeedback>
                        )
                        }
                    </View>
                </View>
                {renderIf(this.newsFeedItem.imageURL)(
                    <View style={{ flex: 0.3, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={styles.image} source={{ uri: this.getNewsFeedImage() }} />
                    </View>
                )
                }
            </View>
        );
    }
    _renderTruncatedFooter = (handlePress) => {
        return (
            <CustomText style={{ color: '#99bfe4', marginTop: 5, fontSize: 12 }} onPress={handlePress}>
                {this.props.readMoreText || "Read more"}
      </CustomText>
        );
    };

    _renderRevealedFooter = (handlePress) => {
        return (
            <CustomText style={{ color: '#99bfe4', marginTop: 5, fontSize: 12 }} onPress={handlePress}>
                {this.props.showLessText || "Show less"}
      </CustomText>
        );
    };

    getNewsFeedImage() {
        if (this.newsFeedItem.imageURL) {
            return global.BASE_URL + this.newsFeedItem.imageURL;
        } else {
            return null;
        }
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#F7F7F7',
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15
    },
    titleText: {
        color: '#616970',
        fontFamily: global.primaryText,
        fontSize: global.h3FontSize
    },
    description: {
        fontSize: global.h4FontSize,
        color: '#b0b0b0',
        fontFamily: global.primaryText,
        textAlign: 'left'
    },
    image: {
        height: Math.round(factor * 0.25),
        width: Math.round(factor * 0.25),
        resizeMode: 'contain'

    }

});
