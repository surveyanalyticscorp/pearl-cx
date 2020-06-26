import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View, Dimensions,Platform,Animated,Easing} from 'react-native';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import CustomText from "../../../global/ui/CustomText";
import {Actions} from 'react-native-router-flux';
import ScrollViewWithRefreshControl from '../../../global/ui/ScrollViewWithRefreshControl';

const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
import {data} from './sports';
import * as Animatable from 'react-native-animatable';
import {mergeSort} from "./sort/MergeSort";
import PathFinderResults from './PathFinderResults';
const THEME_COLOR = '#55CBFD';
export default class Rate extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
        this.state = {
            pressStatus1: false,
            pressStatus2: false,
            sortData: {},
            hasData: false,
            index: 0,
            progress: 0,
        };
        this.data = data;
        this.getPathFinderResults = this.getPathFinderResults.bind(this);
        this.scaleValue = new Animated.Value(0);
        this.buttonScale = this.scaleValue.interpolate({
            inputRange: [0, 0.2,0.4,0.5,0.6,0.8, 1],
            outputRange: [0.3, 0.28, 0.24, 0.2, 0.18, 0.14, 0.1]
        });
        this.answerScale = this.scaleValue.interpolate({
            inputRange: [0, 0.2,0.4,0.5,0.6,0.8, 1],
            outputRange: [0.7,0.74,0.78, 0.8,0.84,0.88, 0.9]
        })
        this.questionTextScale = this.scaleValue.interpolate({
            inputRange: [0, 0.2,0.4,0.5,0.6,0.8, 1],
            outputRange: [Math.round(factor * 0.1),
                            Math.round(factor * 0.09),
                                Math.round(factor * 0.08),
                                Math.round(factor * 0.07),
                                    Math.round(factor * 0.06),
                                    Math.round(factor * 0.05),
                                    Math.round(factor * 0.04)]
        });
        this.answerContainerPadding = this.scaleValue.interpolate({
            inputRange: [0, 0.2,0.4,0.5,0.6,0.8, 1],
            outputRange: [50,
                55,
                60,
                65,
                70,
                75,
                80]
        })
    }

    componentDidMount() {

        this.reloadContent();

    }
    scale() {

        this.scaleValue.setValue(0);
        Animated.timing(
            this.scaleValue,
            {
                toValue: 1,
                duration: 500,
                easing: Easing.easeOutBack
            }
        ).start();
    }

    reloadContent() {
        let context = this;
        this.props.getFlashLetPathFinder().then((response) => {
            if (JSON.stringify(this.props.pathFinderQuestionData) === '{}') {
                context.getPathFinderResults();
            }
            else {
                this.setState({sortData: mergeSort.initialize(this.props.pathFinderQuestionData.items)}, () => {
                    this.setState({sortData: mergeSort.getNextPair(this.state.sortData)});
                });
            }
        }).catch(e => this.showErrorToastAndClear())
    }

    getPathFinderResults() {
        let context = this;
        this.props.getFlashLetPathFinderResults().then(response => {
            if (JSON.stringify(this.props.pathFinderResultsData) === '[]') {
                context.setState({hasData: false});
            }
            else {
                context.setState({hasData: true});
            }
        });
    }


    button1 = ref => this.b1 = ref
    button2 = ref => this.b2 = ref

    renderNoDataFound() {
        return (

            <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                <CustomText style={{color: 'black', fontSize: 16}}>No PathFinder to answer</CustomText>
            </View>

        );
    }

    renderChild() {
        const {pathFinderQuestionData} = this.props;
        console.log("Progress- "+ this.state.sortData? this.state.sortData.percentageCompleted : 0);
        let view;

        if (this.state.sortData && JSON.stringify(this.state.sortData) !== '{}' && this.state.sortData.selectionPair) {
            let pathFinderData = pathFinderQuestionData;
            let answers = this.state.sortData.selectionPair;
            return (
                <View style={styles.parent}>
                    <Animated.View style={[styles.questionSection,{flex: this.buttonScale}]}>

                        <Animated.Text style={[styles.questionText,{fontSize: this.questionTextScale}]} numerOfLines={3}>
                            {pathFinderData.question}
                        </Animated.Text>

                    </Animated.View>
                    <Animated.View ref={this.parent} style={[styles.answerSection,{flex:this.answerScale}]}>

                        <Animated.View style={{flex:1, paddingVertical: this.answerContainerPadding, justifyContent: 'space-between'}}>
                            <Animatable.View animation={"slideInLeft"} duration={500} ref={this.button1}>
                                <TouchableHighlight
                                    onPress={() => {
                                        this.toggleButton(1)
                                    }}
                                    activeOpacity={1}
                                    style={[this.state.pressStatus1 ? styles.buttonPress : styles.button]}
                                >
                                    <Text
                                        style={this.state.pressStatus1 ? styles.answerTextPress : styles.answerText}>{answers[0].name}</Text>

                                </TouchableHighlight>
                            </Animatable.View>
                            <Text style={styles.vsText}>v/s</Text>
                            <Animatable.View animation={"slideInRight"} duration={500} ref={this.button2}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    style={[this.state.pressStatus2 ? styles.buttonPress : styles.button]}
                                    onPress={() => {
                                        this.toggleButton(2);

                                    }}
                                >
                                    <Text
                                        style={this.state.pressStatus2 ? styles.answerTextPress : styles.answerText}>{answers[1].name}</Text>
                                </TouchableHighlight>
                            </Animatable.View>

                        </Animated.View>

                        <View style={{position:'absolute',alignSelf:'stretch',flexDirection:'row', right:0, bottom:0, left:0, height:8, backgroundColor:'#EBECEC'}}>
                            <View style={{backgroundColor:THEME_COLOR, height: 8, flex:this.state.sortData.percentageCompleted }}/>
                            <View style={{backgroundColor:'transparent', flex:100 - this.state.sortData.percentageCompleted}}/>
                        </View>

                    </Animated.View>
                </View>

            );

        } else if (this.state.hasData) {
            view = (<PathFinderResults {...this.props}/>);

        }

        else if(!this.props.isLoading){
            view = this.renderNoDataFound();
        }
        else{
            view = (<View/>);
        }
        return (

            <ScrollViewWithRefreshControl fillViewPort={true} onRefresh={() => {
                this.reloadContent()
            }}>
                {view}
            </ScrollViewWithRefreshControl>


        )
    }

    toggleButton(option) {

        this.setState({pressStatus1: option === 1, pressStatus2: option !== 1}, () => {
            let sortData = this.state.sortData;
            sortData.selectedID = option;
            sortData = mergeSort.getNextPair(sortData);
            console.log("Pair- " + sortData.selectionPair[0].name + " & " + sortData.selectionPair[1].name);
            if (!sortData.success) {
                this.fadeOutAnswers();
                setTimeout(() => {
                    this.setState({sortData: sortData, pressStatus1: false, pressStatus2: false, index: this.state.index + 1, progress:this.state.progress + 0.1}, () => {
                        this.slideInAnswers();
                        if(this.state.index === 3) {
                            this.scale();
                        }
                    });

                }, 500);
            }
            else {
                setTimeout(() => {
                    this.submitSortedList();
                }, 500);
            }

        })

    }

    submitSortedList() {
        let responseData = {...this.props.pathFinderQuestionData, items: this.state.sortData.sortedArray}
        //Actions.result({result : responseData});
        this.props.submitPathFinderResponse(responseData).then(() => {
            Actions.result({result: responseData});
        }).catch(e => this.showErrorToastAndClear())
    }

    slideInAnswers() {
        this.b1.slideInLeft();
        this.b2.slideInRight();
    }

    fadeOutAnswers() {
        this.b1.fadeOut();
        this.b2.fadeOut();
    }

}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        alignItems: 'center'
    },
    questionSection: {
        flex: 0.3,
        backgroundColor: THEME_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding: 10

    },
    answerSection: {
        flex: 0.7,
        justifyContent: 'center',
        alignSelf:'stretch',
        alignItems:'center'
    },

    questionText: {
        color: 'white',
        ...Platform.select({
            android: {
                fontWeight: '500'
            },ios:{
                fontWeight: '500'
            }}),
        fontSize: Math.round(factor * 0.1),
        textAlign: 'center'
    },

    vsText:{
        color: THEME_COLOR,
        ...Platform.select({
            android: {
                fontWeight: '500'
            },ios:{
                fontWeight: '500'
            }}),
        fontSize: Math.round(factor * 0.08),
        textAlign: 'center',
        marginVertical: 10,
    },
    answerText: {
        fontSize: Math.round(factor * 0.06),
        textAlign: 'center',
        margin: 10,
        color: THEME_COLOR
    },
    answerTextPress: {
        fontSize: Math.round(factor * 0.06),
        textAlign: 'center',
        margin: 10,
        color: '#ffffff'
    },
    button: {
        borderColor: THEME_COLOR,
        borderWidth: 1,
        paddingHorizontal: 40,
        maxWidth: factor * 0.8,
        justifyContent:'center',
        alignItems:'center',
        minHeight: Math.round(factor * 0.24),


    },
    buttonPress: {
        borderColor: THEME_COLOR,
        backgroundColor: THEME_COLOR,
        borderWidth: 1,
        paddingHorizontal: 40,
        maxWidth: factor * 0.8,
        justifyContent:'center',
        alignItems:'center',
        minHeight: Math.round(factor * 0.24),


    },
})