/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  ART
} from 'react-native';

const {
  Group,
  Shape,
  Surface,
} = ART;

const { width, height } = Dimensions.get('window');

class NewMarkerLine extends Component {

  constructor(props) {
    super(props);
    this.state = {

      endPoint: { x: 0, y: 0 },
      startPoint: { x: 0, y: 0 }
    };
  }

  _setTextPosition(nativeEvent) {
    this.setState({
      startPoint: {
        x: width / 2,
        y: nativeEvent.layout.y + nativeEvent.layout.height + 5
      },
      endPoint: {
        x: width - 90,
        y: height - (Platform.OS === 'ios' ? 150 : 170)
      }
    });
  }


  _calculatePath = (startingPoint = { x: 110, y: 200 }, endingPoint = { x: 350, y: 500 }) => {
    let dx = endingPoint.x - startingPoint.x
    let dy = endingPoint.y - startingPoint.y
    // DRAWING ARROW
    let arrowCenterPoint = `${endingPoint.x} ${endingPoint.y}`;
    var arrowStartPoint = `${endingPoint.x} ${endingPoint.y}`;
    var horizontal = endingPoint.x - 2;
    let arrowCP1 = `${endingPoint.x - 2} ${endingPoint.y}`;
    let arrowCP2 = `${endingPoint.x - 50} ${endingPoint.y}`;
    let arrowTopCP3 = `${endingPoint.x - 55} ${endingPoint.y - 20}`;
    let arrowBottomCP3 = `${endingPoint.x - 55} ${endingPoint.y + 20}`;
    // composing arrow path eg: 'M100 200 L110 210 L100 220'
    this.arrowPath1 = `M${arrowStartPoint} H${horizontal} C${arrowCP1}, ${arrowCP2} ${arrowTopCP3} V${endingPoint.y - 20}`;
    this.arrowPath2 = `M${arrowStartPoint} H${horizontal} C${arrowCP1}, ${arrowCP2} ${arrowBottomCP3} V${endingPoint.y + 20}`;
    //DRAWING CURVE LINE
    let startPoint = arrowCenterPoint;
    let controlPoint1 = `${endingPoint.y / 3} ${endingPoint.y}`;
    let controlPoint2 = `${endingPoint.x - dx - endingPoint.y / 5} ${endingPoint.y}`;
    let controlPoint3 = `${startingPoint.x} ${startingPoint.y}`;
    //
    this.linePath = `M${startPoint} H${endingPoint.x - 15} C${controlPoint1}, ${controlPoint2} ${controlPoint3} V${startingPoint.y}`;
  }


  render() {

    //const { startingPoint, endingPoint } = this.props;
    this._calculatePath(this.state.startPoint, this.state.endPoint);

    return (
      <View style={{ flex: 1 }}>
        <Text onLayout={({ nativeEvent }) => this._setTextPosition(nativeEvent)} >Get started with new goals</Text>
        <View style={{ position: 'absolute', top: 0, height: height, width: width, backgroundColor: 'transparent' }}>
          <View>
            <Surface width={width} height={height}>
              <Group>
                <Shape
                  d={this.arrowPath1}
                  stroke="#000"
                  strokeWidth={1} />
                <Shape
                  d={this.arrowPath2}
                  stroke="#000"
                  strokeWidth={1} />
                <Shape
                  d={this.linePath}
                  stroke="#000"
                  strokeWidth={1} />
              </Group>
            </Surface>
          </View>
        </View>
      </View>

    );
  }

}

export default NewMarkerLine;
