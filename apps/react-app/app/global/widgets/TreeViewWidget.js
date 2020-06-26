import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  Alert,
  Easing,
  Animated,
  Platform,
  UIManager,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  LayoutAnimation,
  TouchableNativeFeedback
} from 'react-native';

import CustomText from '../ui/CustomText';
import TreeViewElement from './TreeViewElementWidget';
import * as Animatable from 'react-native-animatable';

const emptyNodeID = 99999;
const emptyNode = {
  'id': emptyNodeID,
  'text': '',
  'active': false,
  'parentID': 0,
  'imageURI': '',
  'children': []
};

const CustomLayoutLinear = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeIn,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY
  },
  delete: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity
  }
};

const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;

// Position
const LEFT = 1;
const MID = 2;
const RIGHT = 3;

const TOP = 'TOP';
const MIDDLE = 'MIDDLE';
const BOTTOM = 'BOTTOM';
// Level change status
const INCREASING = 1;
const INTERMEDIATE = 2;
const DECREASING = 3;

Animatable.initializeRegistryWithDefinitions({
  fadingOutDown: {
    0: {
      opacity: 1,
      transform: [{ translateY: 0 }]
    },
    0.5: {
      opacity: 1,
      transform: [{ translateY: 20 }]
    },
    1: {
      opacity: 0,
      transform: [{ translateY: 160 }]
    }
  },
  fadingOutUp: {
    0: {
      opacity: 1,
      transform: [{ translateY: 0 }]
    },
    0.5: {
      opacity: 1,
      transform: [{ translateY: -20 }]
    },
    1: {
      opacity: 0,
      transform: [{ translateY: -160 }]
    }
  },
  fadingInDown: {
    0: {
      opacity: 0,
      transform: [{ translateY: 0 }]
    },
    0.5: {
      opacity: 0.2,
      transform: [{ translateY: 20 }]
    },
    1: {
      opacity: 1,
      transform: [{ translateY: 160 }]
    }
  },
  fadingInUp: {
    0: {
      opacity: 0,
      transform: [{ translateY: 0 }]
    },
    0.5: {
      opacity: 0.2,
      transform: [{ translateY: -20 }]
    },
    1: {
      opacity: 1,
      transform: [{ translateY: -160 }]
    }
  },
  toDown: {
    from: {
      transform: [{ translateY: 0 }]
    },
    to: {
      transform: [{ translateY: 160 }]
    }
  },
  toTop: {
    from: {
      transform: [{ translateY: 0 }]
    },
    to: {
      transform: [{ translateY: -160 }]
    }
  }
});

Array.prototype.swapItems = function (a, b) {
  this[a] = this.splice(b, 1, this[a])[0];
  
  return this;
};

class TreeView extends Component {

  constructor(props) {
    super(props);

    this.currentLevel = 0;
    this.levelsWithData = [];
    this.selectedNode = null;
    this.selectedNodeID = null;
    this.levelStatus = null;

    // data = props.data ? props.data : {};
    this.normalizedArray = [];
    this.state = {
      collapsed: {},
      data: props.data ? props.data : {},
      topLevelNode: null,
      midLevelArray: [],
      bottomLevelArray: [],
      isAnimating: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.data) {
      this.normalizedArray = [];
      this._normalizeData(props.data);
      this.setState({
        topLevelNode: this.normalizedArray[this.currentLevel],
        midLevelArray: this.normalizedArray[this.currentLevel + 1],
        bottomLevelArray: this.normalizedArray[this.currentLevel + 2]
      });  
    }
    // console.log('-----', this.normalizedArray);
    if (JSON.stringify(this.state.data) === '{}' && props.data) {
      this.setState({ data: props.data });
    }
  }

  componentWillMount() {
    this.animateToCenter = new Animated.Value(0);
    this.animateToSides = new Animated.Value(0);
  }

  _normalizeData = (data) => {
    this.normalizedArray.push(data);
    if (data.children && data.children.length > 0) {
      this._populateArray(data.children);
    }
  }

  _populateArray = (children) => {
    let childArray = children.slice();
    this.normalizedArray.push(children);
    let subChildren = [];
    while(child = childArray.pop()) {
      if (child.children && child.children.length > 0) {
        subChildren = subChildren.concat(child.children);
      }
    }
    if (subChildren.length > 0) {
      this._populateArray(subChildren);
    }
  }

  _searchForNode = (element, id) => {
    if(element.id === id){
      return element;
    } else if (element.children !== null){
      let i;
      let result = null;
      if (element.children) {
        for (i = 0; result === null && i < element.children.length; i++) {
          result = this._searchForNode(element.children[i], id);
        }
      }

      return result;
    }

    return null;
  }

  _setAllLevelNodeData = (node) => {
    this.selectedNode = node;
    // Top node
    // get next top node from its parentID
    let nextTopNode = this._searchForNode(this.state.data, node.parentID);

    // Mid Array
    let arr1 = this.normalizedArray.slice()[this.currentLevel + 1];
    let midArray = arr1.filter((childNode) => childNode.parentID === node.parentID);

    // Bottom Array
    let arr2 = this.normalizedArray.slice()[this.currentLevel + 2];
    let bottomArray = [];
    if (arr2 && arr2.length > 0) { 
      bottomArray = arr2.filter((childNode) => childNode.parentID === node.id);
    } else {
      bottomArray = []; 
    }
    
    this.setState({
      topLevelNode: nextTopNode,
      midLevelArray: midArray,
      bottomLevelArray: bottomArray
    });
  }

  _onSelectTopLevelNode = (node) => {
    this.selectedLevel = TOP;
    this.selectedNode = node;
    this.selectedNodeID = node.id;
    this.levelStatus = DECREASING;
    this._runLayoutAnimation();
    if (this.currentLevel <= 0) return;
    --this.currentLevel;
    this.setState({ 
      isAnimating: true
    });
    // this._setAllLevelNodeData(node);
  }

  _onSelectMiddleLevelNode = (node, event, status = INTERMEDIATE) => {
    this.selectedLevel = MIDDLE;
    this.selectedNode = node;
    this.selectedNodeID = node.id;
    this.levelStatus = status;
    this._runLayoutAnimation();
    this.setState({ 
      // isAnimating: true
    });
    let arr = this.normalizedArray.slice()[this.currentLevel + 1];
    let index = arr.indexOf(node);
    let position = this._getPosition(event.pageX);
    let swapIndex = this._getSwapIndex(position, index);
    if (arr[swapIndex]) {
      arr.swapItems(index, swapIndex);
      this.normalizedArray[this.currentLevel + 1] = arr;
      this._setAllLevelNodeData(node);
    }
  }
  
  _onSelectBottomLevelNode = (node, event) => {
    this.selectedLevel = BOTTOM;
    this.selectedNode = node;
    this.selectedNodeID = node.id;
    this.levelStatus = INCREASING;
    ++this.currentLevel;

    this.setState({ 
      isAnimating: true
    }, () => {
      setTimeout(() => {
        this._onSelectMiddleLevelNode(node, event, INCREASING);
      }, 1250);
    });
  }

  _getSwapIndex = (position, index) => {
    switch(position) {
      case LEFT:
        return index + 1;

      case RIGHT:
        return index - 1;

      default:
        return index;
    }
  }

  _getPosition = (px) => {
    if ((px) <= (width / 3 + 5)) { 
      return LEFT;
    }
    else if ((px) <= (width / 3 * 2 + 5)) {
      return MID;
    }
    else if ((px) <= (width + 5)) {
      return RIGHT;
    }
  }

  _runLayoutAnimation = () => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
      // console.log('completed layout animation');
    }); 
  }

  _getMockViewVerticalAnimation = () => {
    if (this.state.isAnimating) {
      switch (this.levelStatus) {
        case INCREASING: return 'fadingInUp';
        case DECREASING: return 'fadingInDown';
        default: return '';
      }
    }
  }

  _getVerticalAnimationForTrueNodes = (position) => {
    if (this.state.isAnimating) {
      switch(this.levelStatus) {
        case DECREASING:
          if (position === BOTTOM) {
            return 'fadingOutDown';
          }

          return 'toDown';
        case INCREASING:
          if (position === BOTTOM) {
            return 'toTop';
          }

          return 'toTop';
        default:
          return '';        
      }
    } 

    return '';
  }

  _renderTopMockView = () => {
    let upcomingNode = this._searchForNode(this.state.data, this.state.topLevelNode.parentID);
    if (!upcomingNode) return;

    return (
      <Animatable.View 
        style={{ position: 'absolute', top: -160 }}
        animation={this._getMockViewVerticalAnimation()}
        easing={'ease-in-out-sine'}
        onAnimationEnd={() => {
          this.setState({ isAnimating: false });
        }}>
        <ScrollView horizontal={true} style={{ height: 160, width: width }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'
          }}>
            { this.renderRootNode(upcomingNode) }
          </View>
        </ScrollView>
      </Animatable.View>
    );
  }

  _renderBottomMockView = () => {
    if ((this.currentLevel + 2) >= (this.normalizedArray.length)) return;
    let arr2 = this.normalizedArray.slice()[this.currentLevel + 2];
    if (!arr2 || arr2.length <= 0) return; 
    let upComingNodes = arr2.filter((childNode) => childNode.parentID === this.selectedNodeID);

    return (
      <Animatable.View 
        style={{ position: 'absolute', bottom: -160 }}
        animation={this._getMockViewVerticalAnimation()}
        easing={'ease-in-out-sine'}
        onAnimationEnd={() => {
          this.setState({ isAnimating: false });
        }}>
        <ScrollView horizontal={true} style={{ height: 160 }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'
          }}>
            { this.renderThirdLevelNode(upComingNodes, true) }
          </View>
        </ScrollView>
      </Animatable.View>
    );
  }

  _getRendereableScrollView = (children, animation) => {
    return (
      <Animatable.View 
        animation={animation}
        easing={'ease-in-out-sine'}
        style={{ height: 160 }}
        onAnimationEnd={() => {
          this.setState({ isAnimating: false });
          this._setAllLevelNodeData(this.selectedNode);
        }}>
        <ScrollView horizontal={true} style={{ height: 160 }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'
          }}>
            {children}
          </View>
        </ScrollView>
      </Animatable.View>
    );
  }

  render() {
    if (this.state.topLevelNode === null) {
      return <View/>;
    }

    return (

      <Animatable.View style={[styles.mainContainer]} >

        {this.state.isAnimating && this.levelStatus === DECREASING && this._renderTopMockView()}
        {this._getRendereableScrollView(this.renderRootNode(this.state.topLevelNode), this._getVerticalAnimationForTrueNodes(TOP))}
        {this._getRendereableScrollView(this.renderSecondNode(this.state.midLevelArray), this._getVerticalAnimationForTrueNodes(MIDDLE))}
        {this._getRendereableScrollView(this.renderThirdLevelNode(this.state.bottomLevelArray), this._getVerticalAnimationForTrueNodes(BOTTOM))}
        {this.state.isAnimating && this.levelStatus === INCREASING && this._renderBottomMockView()}

      </Animatable.View>

    );
  }

  renderRootNode(data) {
    let contents = [];
    for (let i = 0; i < 3; i++) {
      contents.push(
        <Animatable.View>
          {
            i === 1 ?
              <TreeViewElement
                key={data.id}
                imageURI={this.appendHostToURL(data.imageURI)}
                text={data.text}
                node={data}
                index={data.id}
                hasChild={!this.state.isAnimating && data.children && data.children.length}
                active={data.active}
                onSelect={!this.state.isAnimating ? this._onSelectTopLevelNode : (() => {})}
                style={{ width: this._getWidthOfCellAccordToDevice() }}
              />
              :
              <View style={{ width: this._getWidthOfCellAccordToDevice() }}/>
          }
        </Animatable.View>
      );
    }

    return contents;
  }

  _getWidthOfCellAccordToDevice = () => {
    // Device having width less than 600 will have 3 cells visible, if not 5.
    this.cellsToVisible = 3; // width > 600 ? 5 : 3;

    return width / this.cellsToVisible;
  }

  // _getAnimationForSecondLevelNodes = (node) => {
  //   return this.selectedNodeID !== node.id && this.selectedLevel === TOP && this.levelStatus === DECREASING ? 'zoomIn' : null;
  // }


  renderSecondNode(children) {
    let childs = children.slice();
    let contents = [];
    // if (childs.length === 1) { // if single element
    //   childs.splice(0, 0, emptyNode);
    //   childs.splice(2, 0, emptyNode);
    // }
    for (let i = 1; i <= childs.length; i++) {
      let node = childs[i - 1];
      contents.push(
        node.id === emptyNodeID ?
          <View key={node.id + i} style={{ width: this._getWidthOfCellAccordToDevice() }}/>
          :
          <Animatable.View key={node.id}>
            <TreeViewElement
              key={node.id}
              node={node}
              index={node.id}
              imageURI={this.appendHostToURL(node.imageURI)}
              text={node.text}
              active={node.active}
              hasChild={!this.state.isAnimating && node.children && node.children.length > 0 && this.selectedNodeID === node.id}
              onSelect={!this.state.isAnimating ? this._onSelectMiddleLevelNode : (() => {})}
              selected={this.selectedNodeID === node.id}
              style={{ width: this._getWidthOfCellAccordToDevice() }}
            />
          </Animatable.View>
      );
    }

    return contents;
  }

  renderThirdLevelNode(children) {
    let contents = [];
    if( children) {
    if (children.length === 1) { // if single element
      children.splice(0, 0, emptyNode);
      children.splice(3, 0, emptyNode);
    }
    for (let i = 0; i <  children.length; i++) {
      let childNode = children[i];
      if (childNode.active) {
        contents.push(
          <Animatable.View key={childNode.id}>
            <TreeViewElement
              key={childNode.id}
              node={childNode}
              index={childNode.id}
              imageURI={this.appendHostToURL(childNode.imageURI)}
              text={childNode.text}
              active={childNode.active}
              hasChild={false}
              onSelect={!this.state.isAnimating ? this._onSelectBottomLevelNode : (() => {})}
              style={{ width: this._getWidthOfCellAccordToDevice()}}
            />
          </Animatable.View>
        );
      }
    }
    }

    return contents;
  }

  appendHostToURL(imageURL) {
    if (imageURL.includes("http")) {
      return imageURL;
    }
    return global.BASE_URL + imageURL;
  }

}


const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'stretch',
    alignItems: 'center'
  }
});

export default TreeView;
