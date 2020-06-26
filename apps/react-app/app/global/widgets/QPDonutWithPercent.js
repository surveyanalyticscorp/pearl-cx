import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import CustomText from '../ui/CustomText';

const styles = StyleSheet.create({
    circle: {
        overflow: 'hidden',
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b9b9b9',
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
    percentText: {
        color: '#00508E',
        fontWeight: 'bold',

    }
});



export default class QPDonutWithPercent extends Component {

    // propTypes: {
    //     color: React.PropTypes.string,
    //     radius: React.PropTypes.number,
    //     percent: React.PropTypes.number,
    //     borderWidth: React.Proptypes.number,
    //     disabled: React.PropTypes.bool,
    //
    // };

    constructor(props) {
        super(props);
        let percent = this.props.percent;
        let leftTransformerDegree = '0deg';
        let rightTransformerDegree = '0deg';
        if (percent >= 50) {
            rightTransformerDegree = '180deg';
            leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
        } else {
            rightTransformerDegree = percent * 3.6 + 'deg';
        }

        this.state = {
            percent: this.props.percent,
            borderWidth: this.props.borderWidth < 2 || !this.props.borderWidth ? 2 : Math.round(this.props.radius / 4),
            leftTransformerDegree: leftTransformerDegree,
            rightTransformerDegree: rightTransformerDegree
        };
    }

    componentWillReceiveProps(nextProps) {
        let percent = nextProps.percent;
        let leftTransformerDegree = '0deg';
        let rightTransformerDegree = '0deg';
        if (percent >= 50) {
            rightTransformerDegree = '180deg';
            leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
        } else {
            rightTransformerDegree = percent * 3.6 + 'deg';
        }
        this.setState({
            percent: this.props.percent,
            borderWidth: this.props.borderWidth < 2 || !this.props.borderWidth ? 2 : Math.round(this.props.radius / 4),
            leftTransformerDegree: leftTransformerDegree,
            rightTransformerDegree: rightTransformerDegree
        });
    }

    render() {
        let textSizeNumber = Math.round(this.props.radius * 2/ 3.5);
        let textSizePercent = Math.round(textSizeNumber* 2 / 3.5);

      //  console.log("Radius->" + this.props.radius);
      //  console.log("textSizeNumber->" + textSizeNumber);

      //  console.log("textSizePercent->" + textSizePercent);
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
                borderRadius: this.props.radius
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
                        backgroundColor: this.props.color,
                        transform: [{ translateX: -this.props.radius / 2 }, { rotate: this.state.leftTransformerDegree }, { translateX: this.props.radius / 2 }],
                    }]}></View>
                </View>
                <View style={[styles.leftWrap, {
                    left: this.props.radius,
                    width: this.props.radius,
                    height: this.props.radius * 2,
                   // left: this.props.radius,
                }]}>
                    <View style={[styles.loader, {
                        left: -this.props.radius,
                        width: this.props.radius,
                        height: this.props.radius * 2,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        backgroundColor: this.props.color,
                        transform: [{ translateX: this.props.radius / 2 }, { rotate: this.state.rightTransformerDegree }, { translateX: -this.props.radius / 2 }],
                    }]}></View>
                </View>
                <View style={[styles.innerCircle, {
                    width: (this.props.radius - this.state.borderWidth) * 2,
                    height: (this.props.radius - this.state.borderWidth) * 2,
                    borderRadius: this.props.radius - this.state.borderWidth,
                    backgroundColor: '#fff',
                    justifyContent: "center", alignItems: 'center'
                }]}>
                    <View style={{ flexDirection: 'row',justifyContent: "center", alignItems: 'center'}}>
                        <CustomText style={[styles.text, {textAlign: "center", justifyContent: "center",alignItems: 'center',fontSize: textSizeNumber}, { color: this.props.color}]}>{Math.round(this.props.percent)}</CustomText>
                        <CustomText style={[styles.percentText,{ fontSize: textSizePercent, marginTop: textSizePercent / 2 }, { color: this.props.color }]}>%</CustomText>
                    </View>
                </View>
            </View>
        );

    }

};

//module.exports = DonutWithPercent;