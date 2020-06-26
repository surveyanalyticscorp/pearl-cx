import React from 'react';
import {FlatList, Image, StyleSheet, View,Dimensions,Platform} from 'react-native';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import CustomText from "../../../global/ui/CustomText";
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import ElevatedView from "../../../global/ui/ElevatedView";
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
export default class Result extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
        this.data = [];
        // let result = {
        //     "question": "Which sport do you prefer?",
        //     "name": "Sports",
        //     "id": 2,
        //     "items": [{"name": "Gilli-Danda", "id": 14}, {"name": "Tennis", "id": 17}, {
        //         "name": "Cricket",
        //         "id": 8
        //     }, {"name": "Baseball", "id": 16}, {"name": "Table-Tennis", "id": 12}, {
        //         "name": "Football",
        //         "id": 9
        //     }, {"name": "Golf", "id": 13}, {"name": "Archery", "id": 11}, {
        //         "name": "Hockey",
        //         "id": 15
        //     }, {"name": "Swimming", "id": 10}]
        // };
        for (let i = 0; i < props.result.items.length; i++) {
            let item = props.result.items[i];
            item.index = i + 1;
            this.data.push(item);
        }

        this.state = {
            scrolling : false
        }
    }


    renderChild() {


        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <View style={styles.questionSection}>

                    <CustomText style={styles.questionText} numerOfLines={2}>
                        Awesome, Here is your result!
                    </CustomText>

                </View>

                <View style={{flex: 0.8, alignSelf: 'stretch'}}>
                    {this.renderHeader()}
                    <FlatList ref={ref => this.listView = ref}
                              style={{flex: 1, alignSelf: 'stretch', backgroundColor: '#4CC5FD'}}
                              keyExtractor={item => item.index}
                              renderItem={this.renderRow.bind(this)}
                              data={this.data.slice(1)}
                              refreshing={false}
                              onScroll = {
                                  (e)=>{
                                      this.setState({scrolling:true})
                                  }
                              }
                              onMomentumScrollEnd = {()=>{this.setState({scrolling: false})}}
                              onScrollBeginDrag = {()=>{this.setState({scrolling: true})}}
                              onScrollEndDrag ={()=>{this.setState({scrolling: false})}}
                    />
                </View>

            </View>
        )
    }

    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            <View key={rowID} style={{height: 0.5, backgroundColor: 'white'}}>
            </View>
        )
    }

    renderRow({item}) {
        return (

            <Animatable.View
                animation={"fadeInUp"}
                delay={item.index > 1 ? item.index * 500 : 0}
            >
                <LinearGradient colors={['#4CC5FD', '#44BFFD']} style={styles.row}>
                    <CustomText style={{
                        marginLeft: 10, color: 'white',
                        fontWeight: '900',

                        fontSize: 24, marginRight: 20
                    }}>{item.index}</CustomText>
                    <CustomText style={styles.rowText}>{item.name}</CustomText>
                </LinearGradient>

            </Animatable.View>
        );
    }

    renderHeader() {
        return (
            <ElevatedView elevation={this.state.scrolling? 3: 0} style={[styles.header,{elevation:this.state.scrolling? 3: 0 },{zIndex: this.state.scrolling? 3: 0}]}>


                <Image source={this.getTopperImage()}
                       style={{height: 75, width: 70, flex: 0.2}}/>
                <View style={{flex: 0.8, justifyContent: 'center'}}>
                    <CustomText style={[styles.rowText, {fontSize: 30}]}>{this.data[0].name}</CustomText>
                </View>


            </ElevatedView>);
    }

    getTopperImage(){
        if(Platform.OS === 'ios'){
            return { uri: 'top_rated.png' };
        }
        return require('../../../global/images/top_rated.png')
    }
}

const styles = StyleSheet.create({
    questionSection: {
        flex: 0.3,
        backgroundColor: '#4CC5FD',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding : 10
    },
    questionText: {
        color: 'white',
        fontSize: Math.round(factor * 0.1),
        textAlign: 'center'
    },
    header: {
        backgroundColor: '#2DAEFD',
        flexDirection: 'row',
        minHeight: 70,
        alignSelf: 'stretch',
        paddingHorizontal: 40,
        paddingBottom: 10,

    },
    rowText: {
        color: 'white',
        ...Platform.select({
            android: {
                fontWeight: '300'
            },ios:{
                fontWeight: '900'
            }}),
        marginHorizontal: Math.round(factor * 0.07),
        fontSize: 24,
    },
    row: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 55,
        minHeight: 70,
        alignSelf: 'stretch',
    }
})