/**
 * Created by TanviGupta on 05/02/20.
 */
import React from "react";
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import {View, TouchableWithoutFeedback, Image, ScrollView, StyleSheet, Dimensions,Platform} from 'react-native'
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../actions";
import {connect} from "react-redux";
import {Actions} from "react-native-router-flux";

const {width, height} = Dimensions.get('window');
import RNUrlPreview from 'react-native-url-preview';
import CustomText from "../../../global/ui/CustomText";
import moment from 'moment';
import Icon from "react-native-vector-icons/MaterialIcons";
import SubViewBaseComponent from "../../../global/components/SubView";

class EventDescriptionView extends BaseComponentWithoutScroll {

    constructor(props) {
        super(props);
        console.log(props);
        this.scrollWidths = {url: 0, image: 0};
        this.state = {
            currentIndex: 0
        }
    }

    checkImageURLAvailable() {
        if (this.props.event.imageURL.trim() == "") {
            return false
        }
        let lastStr = this.props.event.imageURL.substring(this.props.event.imageURL.lastIndexOf('.') + 1)
        if (lastStr === 'png' || lastStr === 'jpg' || lastStr === "jpeg") {
            return true
        }
        return false;
    }

    checkIfVideoIsAvailable() {
        return this.props.event.videoURL.trim() !== ""
    }

    renderBackButton() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                Actions.pop();
            }}>
                <View style={styles.backButton}>
                    <Image source={require('../../../../assets/app/global/images/left_arrow_grey.png')}
                           style={styles.backButtonIcon}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderImageWithURL() {
        return (  <View style={styles.imageContainer} onLayout={(event) => {
            this.scrollWidths.image = event.nativeEvent.layout.x;
        }}>
            <View style={{justifyContent: "center", alignItems: "center",flex: 1,height: height/4 - 40}}>
                <Image source={{uri: this.props.event.imageURL}} resizeMode={"contain"} style={styles.image}/>
            </View>
            {this.checkIfVideoIsAvailable() && this.renderNextIconOnImage()}
        </View>);
    }

    renderNextIconOnImage() {
        return (<TouchableWithoutFeedback onPress={() => {
            this.scrollView.scrollTo({x: this.scrollWidths.url, y: 0, animated: true});
            this.setState({currentIndex: 1})
        }}>
            <View style={{width: "6%",justifyContent: "center", alignItems: "center"}}>
                <Icon name={"keyboard-arrow-right"} color={"#003566"} size={28}/>
            </View>
        </TouchableWithoutFeedback>);
    }

    renderNOImage() {
        return(<View style={styles.noImageContainer} onLayout={(event) => {
            this.scrollWidths.image = event.nativeEvent.layout.x;
        }}>
            <View style={{justifyContent: "center", alignItems: "center",width: width - 40,flex: 1,height: height/4 - 40}}>
                <Image source={require('../../../../assets/app/global/images/noEventsImage.png')}
                       resizeMode={"contain"}
                       style={styles.image}/>
            </View>
            {this.checkIfVideoIsAvailable() && this.renderNextIconOnImage()}
        </View>)
    }

    renderImage() {
        const isImageURl = this.checkImageURLAvailable();
            return isImageURl ?  this.renderImageWithURL() : this.renderNOImage();
    }

    renderURLPreview() {
        return (
            <View style={styles.urlPreviewContainer} onLayout={(events) => {
                this.scrollWidths.url = events.nativeEvent.layout.x;
            }}>
                <TouchableWithoutFeedback onPress={() => {
                    this.scrollView.scrollTo({x: 0, y: 0, animated: true});
                    this.setState({currentIndex: 0})
                }}>
                    <View style={{width: "6%",justifyContent: "center", alignItems: "center"}}>
                        <Icon name={"keyboard-arrow-left"} color={"#003566"} size={28}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{width: '94%', marginLeft: 10}}>
                <RNUrlPreview text={this.props.event.videoURL}/>
                </View>
            </View>);

    }

    renderDetailView() {
        let defaultDateFormat = 'YYYY-MM-DD HH:mm:ss'
        const startTime = this.props.event.startTime //2019-07-19 03:57:16
        let startDateMoment = moment(startTime, defaultDateFormat).format("MMM DD, YYYY")
        let endTime = this.props.event.endTime
        let endDateMoment = moment(endTime, defaultDateFormat).format("MMM DD, YYYY")
        let dateMoment = startDateMoment + " - " + endDateMoment
        return (
            <View style={styles.detailViewContainer}>
                <CustomText style={styles.nameText} ellipsizeMode="tail">{this.props.event.name}</CustomText>
                <CustomText style={styles.dateText}>{dateMoment}</CustomText>
                <CustomText style={styles.descriptiontext}>{this.props.event.description}</CustomText>
            </View>
        );
    }

    renderImageAndVideoScroll() {
        return (
            <View style={styles.scrollViewContainer}>
                <ScrollView ref={(ref) => {
                    this.scrollView = ref
                }}          disableIntervalMomentum={true}
                            onScrollEndDrag={(event) => {
                                if(this.checkIfVideoIsAvailable() && Platform.OS ==='ios') {
                                    console.log(event)
                                    let nativeEvent = event.nativeEvent
                                    let xAxis = nativeEvent.targetContentOffset.x ? nativeEvent.targetContentOffset.x : 0
                                    if (xAxis === 0) {
                                        this.setState({currentIndex: 0})
                                    } else {
                                        this.setState({currentIndex: 1})
                                    }
                                }
                            }}
                            pagingEnabled={true}
                            scrollEventThrottle={1}
                            contentContainerStyle={styles.contentContainer}
                            showsHorizontalScrollIndicator={true}
                            alwaysBounceHorizontal={true}
                            horizontal={true}

                >
                    {this.renderImage()}
                    {this.checkIfVideoIsAvailable() && this.renderURLPreview()}
                </ScrollView>
            </View>
        );
    }

    renderPagerDots() {
        //fiber_manual_record
        const selectedColor = "#003566";
        const unSelectedColor = "#A5A5A5";
        let iconOneColor = this.state.currentIndex === 0 ? selectedColor : unSelectedColor;
        let iconSecondColor = this.state.currentIndex === 1 ? selectedColor : unSelectedColor;
        return(
            <View style={{flexDirection: 'row', alignItems: 'center', width: width, marginVertical: 10,justifyContent:'center'}}>
                <Icon name={"brightness-1"} color={iconOneColor} size={8} style={{marginRight:2}}/>
                {this.checkIfVideoIsAvailable() && (<Icon name={"brightness-1"} color={iconSecondColor} size={8} style={{marginLeft:2}}/>)}
            </View>
        );

    }

    render() {
        return (<SubViewBaseComponent style={{flex: 1}}>

            {this.renderImageAndVideoScroll()}
            {this.renderPagerDots()}
            {this.renderDetailView()}

        </SubViewBaseComponent>);
    }

}

const styles = StyleSheet.create({
    backButton: {marginTop: 10 , padding: 5},
    backButtonIcon: {height: 15, width: 15},
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    imageContainer: {
        width: width - 40,
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        justifyContent: 'center',
    },
    image: {
        width: width - 40,
        height: height/4 - 40
    },
    noImageContainer: {
        padding: 10,
        flexDirection: "row",
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    urlPreviewContainer: {
        flexDirection: 'row',
        width: width - 40,
        height: height/4 - 40,
        marginLeft: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    detailViewContainer: {
        marginHorizontal: 20,
        marginTop: 10,
        width: width - 40,
        flexShrink: 1
    },
    nameText: {
        paddingBottom: 5,
        fontSize: global.h2FontSize,
        fontFamily: global.boldText,
        color: global.secondaryFontColorForCommunities
    },
    dateText: {
        fontSize: global.h2by2FontSize,
        fontFamily: global.primaryText,
        color: global.secondaryFontColorForCommunities
    },
    descriptiontext: {
        paddingBottom: 5, marginTop: 5,
        fontSize: global.h3FontSize,
        fontFamily: global.lightText,
        color: global.secondaryFontColorForCommunities
    },
    scrollViewContainer: {
        height: height/4, width: width}
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        error: state.error.message,
        isConnected: state.network.isConnected
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(EventDescriptionView);
