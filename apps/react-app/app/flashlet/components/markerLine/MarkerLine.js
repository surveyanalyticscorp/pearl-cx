import React, { Component } from 'react';
import {
  View,
  ART
} from 'react-native';

const {
  Group,
  Shape,
  Surface,
} = ART;

class MarkerLine extends Component {

  constructor(props) {
    super(props);
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

    const { startingPoint, endingPoint } = this.props;
    this._calculatePath(startingPoint, endingPoint);

    return (
      <View>
        <Surface width={this.props.width} height={this.props.height}>
          <Group>
            <Shape
              d={this.arrowPath1}
              stroke="#000"
              strokeWidth={1}/>
            <Shape
              d={this.arrowPath2}
              stroke="#000"
              strokeWidth={1}/>
            <Shape
              d={this.linePath}
              stroke="#000"
              strokeWidth={1}/>
          </Group>
        </Surface>
      </View>
    );
  }

}

export default MarkerLine;
