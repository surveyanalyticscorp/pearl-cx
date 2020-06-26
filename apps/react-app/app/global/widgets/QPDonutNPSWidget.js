import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import PropTypes from 'prop-types';
import CustomText from '../ui/CustomText';

const styles = StyleSheet.create({
    circle: {
        overflow: 'hidden',
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    leftWrap: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
    },
    rightWrap: {
        position: 'absolute',

    },

    loader: {
        position: 'absolute',
        left: 0,
        top: 0,
        borderRadius: 1000,

    },

    innerCircle: {
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#00508E',
        fontWeight: 'bold',

    },
    subText: {
        color: '#00508E',
    },

    percentText: {
        color: '#00508E',
        fontWeight: 'bold',
        marginTop: 10
    }
});



export default class QPDonutNPSWidget extends Component {

    // propTypes: {
    //     color: PropTypes.string,
    //     passiveColor: PropTypes.string,
    //     detractorColor: PropTypes.string,
    //     radius: PropTypes.number,
    //     percent: PropTypes.number,
    //     promoter: PropTypes.number,
    //     passive: PropTypes.number,
    //     detractor: PropTypes.number,
    //     borderWidth: PropTypes.number,
    //     disabled: PropTypes.bool,
    //
    // };

    constructor(props) {
        super(props);
       
        let percent = this.props.percent;
        let leftTransformerDegree = '0deg';
        let rightTransformerDegree = '0deg';
        if(percent< 0){
            percent = 100 + percent;
        }
        if (percent >= 50) {
            rightTransformerDegree = '180deg';
            leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
        } else {
            rightTransformerDegree = percent * 3.6 + 'deg';
        }

        this.state = {
            percent: this.props.percent,
            borderWidth: Math.round(this.props.radius / 5),
            leftTransformerDegree: leftTransformerDegree,
            rightTransformerDegree: rightTransformerDegree,
            passiveColor : this.props.percent<0 ? '#CE3E3E' : '#E8E8E8',
            promoterColor: this.props.percent<0 ? '#E8E8E8' : '#90BA5B'
        };
        console.log("BorderWidth- "+ this.state.borderWidth );
    }

    componentWillReceiveProps(nextProps) {
        let percent = nextProps.percent;
        let leftTransformerDegree = '0deg';
        let rightTransformerDegree = '0deg';
         if(percent< 0){
            percent = 100 + percent;
        }
        if (percent >= 50) {
            rightTransformerDegree = '180deg';
            leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
        } else {
            rightTransformerDegree = percent * 3.6 + 'deg';
        }
        this.setState({
            percent: this.props.percent,
            borderWidth: Math.round(this.props.radius / 5),
            leftTransformerDegree: leftTransformerDegree,
            rightTransformerDegree: rightTransformerDegree,
            passiveColor : nextProps.percent<0 ? '#CE3E3E' : '#E8E8E8',
            promoterColor: nextProps.percent<0 ? '#E8E8E8' : '#90BA5B'
        });
       
    }
    

    render() {
        textSizeNumber = Math.round(this.props.radius * 2 / 3);
        textSizePercent = Math.round(textSizeNumber / 3);
        if (this.props.disabled) {
            return (
                <View style={[styles.circle, {
                    width: this.props.radius * 2,
                    height: this.props.radius * 2,
                    borderRadius: this.props.radius
                }]}>
                    <Text style={styles.text}>{this.props.disabledText}</Text>
                </View>
            );
        }
        console.log("Border" + this.state.borderWidth);
        return (
            <View style={[styles.circle, {
                width: this.props.radius * 2,
                height: this.props.radius * 2,
                borderRadius: this.props.radius,
                backgroundColor: this.state.passiveColor
            }]}>
               
                <View style={[styles.leftWrap, {
                    width: this.props.radius,
                    height: this.props.radius * 2,
                    left: 0,
                }]}>
                    <View style={[styles.loader, {
                        left: this.props.radius,
                        width: this.props.radius,
                        height: this.props.radius * 2,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        backgroundColor: this.state.promoterColor,
                        transform: [{ translateX: -this.props.radius / 2 }, { rotate: this.state.leftTransformerDegree }, { translateX: this.props.radius / 2 }]
                    }]}></View>

                </View>
                <View style={[styles.leftWrap, {
                    left: this.props.radius,
                    width: this.props.radius,
                    height: this.props.radius * 2,

                }]}>
                    <View style={[styles.loader, {
                        left: -this.props.radius,
                        width: this.props.radius,
                        height: this.props.radius * 2,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        backgroundColor: this.state.promoterColor,
                        transform: [{ translateX: this.props.radius / 2 }, { rotate: this.state.rightTransformerDegree }, { translateX: -this.props.radius / 2 }],
                    }]}></View>
                </View>
                <View style={[styles.innerCircle, {
                    width: (this.props.radius - this.state.borderWidth) * 2,
                    height: (this.props.radius - this.state.borderWidth) * 2,
                    borderRadius: this.props.radius - this.state.borderWidth,
                    backgroundColor: 'white',
                }]}>
                    <View style={{ flexDirection: 'column' }}>
                        <CustomText style={[styles.text, { fontSize: textSizeNumber }]}>{this.props.percent}</CustomText>
                        <CustomText style={[styles.subText, { fontSize: this.props.fontSize, textAlign: 'center' }]}>NPS</CustomText>
                    </View>
                </View>
            </View>
        );

    }

};

//module.exports = DonutWithPercent;