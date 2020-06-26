import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Image,
    TouchableHighlight,
    Text,
    Dimensions
} from 'react-native';
import QPCard from './card/QPCard';
import CustomText from '../ui/CustomText';
import colorCodes from './typography/ColorCodes';
import QPDonutWithExponent from './QPDonutWithExponent';
import renderIf from '../renderIf';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
export default class CXTrendItemWidget extends Component {
    constructor(props) {
        super(props);
        let total = this.props.promoter + this.props.detractor + this.props.passive;
        let promoterPercent = this.props.promoter / total * 100;
        let detractorPercent = this.props.detractor / total * 100;
        let passivePercent = this.props.passive / total * 100;
        this.state = {
            promoterPercent: promoterPercent,
            detractorPercent: detractorPercent,
            passivePercent: passivePercent
        }
    }
    render() {
        return (

            <TouchableHighlight onPress={this.props.onPress}

                activeOpacity={0.6}
                underlayColor={'#CCCCCC'}>
                <View style={styles.mainContainer}>

                    <View style={styles.titleContainer}>

                        <CustomText style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                            {this.props.storeName}
                        </CustomText>
                        <View style={{ height: 5, marginTop: 10, marginBottom: 10, flexDirection: 'row', backgroundColor: '#E8E8E8' }}>
                            <View style={{ height: 5, flex: this.state.promoterPercent, backgroundColor: '#90BA5B' }}></View>
                            <View style={{ height: 5, flex: this.state.passivePercent, backgroundColor: '#E8E8E8' }}></View>
                            <View style={{ height: 5, flex: this.state.detractorPercent, backgroundColor: '#CE3E3E' }}></View>

                        </View>

                    </View>

                    <View style={styles.valueContainer}>


                        <CustomText style={styles.value}>
                            {this.props.nps}
                        </CustomText>

                    </View>
                    <View style={styles.arrowContainer}>
                        {renderIf(this.props.isClickable)(
                         <Image source={this.getArrowImage()} style={{height: 10, width:10}}/>
                        )}
                    </View>
                </View>
            </TouchableHighlight>

        );
    }
    getArrowImage() {
        if (Platform.OS != 'ios') {
            return require('../images/arrow_right.png');
        }
        let iosImage = { uri: 'arrow_right_blue.png' };
        return iosImage;
    }

};

CXTrendItemWidget.defaultProps = {
    storeName: 'Delhi',
    nps: 57,
    promoter: 126,
    passive: 40,
    detractor: 22,
    isClickable : false
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#ffffff',
        marginTop: 0,
        flex: 1,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 0,
        padding: 15,
        marginRight: 0
    },

    indexParent: {
        flex: 1,
        backgroundColor: '#4575b8',
        alignItems: 'center',
        justifyContent: 'center'
    },

    titleContainer: {
        flex: 0.8,
        justifyContent: 'center',
        flexDirection: 'column',
        

    },
    title: {
        color: '#393939',
        fontSize: Math.round(factor * 0.05),
        textAlign: 'left'
    },
   
    valueContainer: {
        flex: 0.15,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    value: {
        color: '#3b3b3b',
        fontSize: Math.round(factor * 0.05),
        textAlign: 'center'
    },
    arrowContainer:{
        flex: 0.05,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    }
});



