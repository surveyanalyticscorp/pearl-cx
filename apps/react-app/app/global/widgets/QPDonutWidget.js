import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import CustomText from '../ui/CustomText';
var color1 = '#E26173'; //red
var color2 = '#88bf57'; //green
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



export default class QPDonutWidget extends Component {

    // propTypes: {
    //     color: React.PropTypes.string,
    //
    //     radius: React.PropTypes.number,
    //     percent: React.PropTypes.number,
    //
    //     borderWidth: React.Proptypes.number,
    //     disabled: React.PropTypes.bool,
    //     result: React.PropTypes.object
    //
    // };

    constructor(props) {
        super(props);
        let dimensions = [];
        let percentAggregate = 100;
        let lastPercent = 0;
        this.props.result.answers.map((item, index) => {
            let dimension = {};
            let percent = parseInt(item.percentage);
                percentAggregate = percentAggregate - lastPercent;
                dimension.percent = percentAggregate;
                lastPercent = percent; 
                let leftTransformerDegree = '0deg';
                let rightTransformerDegree = '0deg';
                if (dimension.percent < 0) {
                    dimension.percent = 100 + dimension.percent;
                }
                if (dimension.percent >= 50) {
                    rightTransformerDegree = '180deg';
                    leftTransformerDegree = (dimension.percent - 50) * 3.6 + 'deg';
                } else {
                    rightTransformerDegree = dimension.percent * 3.6 + 'deg';
                }
                dimension.leftTransformerDegree = leftTransformerDegree;
                dimension.rightTransformerDegree = rightTransformerDegree;
                dimension.color = item.color;
                dimensions.push(dimension);
            

        });


        this.state = {
            percent: this.props.percent,
            borderWidth: this.props.borderWidth ? this.props.borderWidth : Math.round(this.props.radius / 3.5),
            passiveColor: this.props.percent < 0 ? '#88bf57' : '#E8E8E8',
            promoterColor: this.props.percent < 0 ? '#E8E8E8' : '#88bf57',
            dimensions: dimensions
        };
        console.log("Dimensions- " + JSON.stringify(this.state.dimensions));
    }

    componentWillReceiveProps(nextProps) {
        let dimensions = [];
        let percentAggregate = 100;
        let lastPercent = 0;
        nextProps.result.answers.map((item, index) => {
            let dimension = {};
            let percent = parseInt(item.percentage);
            
                percentAggregate = percentAggregate - lastPercent;
                dimension.percent = percentAggregate;
                lastPercent = percent; 
                let leftTransformerDegree = '0deg';
                let rightTransformerDegree = '0deg';
                if (dimension.percent < 0) {
                    dimension.percent = 100 + dimension.percent;
                }
                if (dimension.percent >= 50) {
                    rightTransformerDegree = '180deg';
                    leftTransformerDegree = (dimension.percent - 50) * 3.6 + 'deg';
                } else {
                    rightTransformerDegree = dimension.percent * 3.6 + 'deg';
                }
                dimension.leftTransformerDegree = leftTransformerDegree;
                dimension.rightTransformerDegree = rightTransformerDegree;
                dimension.color = item.color;
                dimensions.push(dimension);
            

        });

        this.setState({
            percent: this.props.percent,
            borderWidth: this.props.borderWidth ? this.props.borderWidth : Math.round(this.props.radius / 3.5),
            passiveColor: nextProps.percent < 0 ? '#88bf57' : '#E8E8E8',
            promoterColor: nextProps.percent < 0 ? '#E8E8E8' : '#88bf57',
            dimensions: dimensions
        });

    }


    render() {


        return (
            <View style={[styles.circle, {
                width: this.props.radius * 2,
                height: this.props.radius * 2,
                borderRadius: this.props.radius,
                backgroundColor: '#E8E8E8'
            }]}>


                {this.getCircles()}


                <View style={[styles.innerCircle, {
                    width: (this.props.radius - this.state.borderWidth) * 2,
                    height: (this.props.radius - this.state.borderWidth) * 2,
                    borderRadius: this.props.radius - this.state.borderWidth,
                    backgroundColor: 'white',
                }]}>

                </View>
            </View>
        );

    }

    getCircles() {
        var circles = [];
        console.log("Dimensions Size- " + this.state.dimensions.length);
        let dimensions1 = this.state.dimensions;//.slice(1, this.state.dimensions.length);
        dimensions1.map((item, index) => {
            circles.push(


                <View key={index} style={[styles.leftWrap, {
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
                        backgroundColor: item.color,
                        transform: [{ translateX: -this.props.radius / 2 }, { rotate: item.leftTransformerDegree }, { translateX: this.props.radius / 2 }]
                    }]}></View>

                </View>);
            circles.push(<View key={(index + dimensions1.length)}style={[styles.leftWrap, {
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
                    backgroundColor: item.color,
                    transform: [{ translateX: this.props.radius / 2 }, { rotate: item.rightTransformerDegree }, { translateX: -this.props.radius / 2 }],
                }]}></View>
            </View>

            );
        });
        return circles;
    }

};

//module.exports = DonutWithPercent;