import React, {Component} from 'react';

import {
    View,
    ScrollView,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import styles from "../homePage/askedQuestionsListStyle";
import BaseComponentWithoutScroll from "../../../../global/components/BaseComponentWithoutScroll";
import DayCard from "../components/DayCard";
import CustomText from "../../../../global/ui/CustomText";
import {fetchPulseQueueHistoryList, fetchQuestions} from "../../../actions/AskHomePageActions";
import moment from "moment";
import {Actions} from 'react-native-router-flux';
import ScrollViewWithRefreshControl from "../../../../global/ui/ScrollViewWithRefreshControl";
const originalFormat = 'DD-MM-YYYY hh:mm a z';
import colorCodes from '../../../../global/widgets/typography/ColorCodes';
class HistoryList extends BaseComponentWithoutScroll{
    constructor(props){
        super(props);
    }
    componentWillMount() {
        this.reloadContent();
    }

    reloadContent(){
        this.props.fetchQuestions();
    }
    renderChild(){
        if(!this.props.pulseQueueHistoryList){return <View/>};
        const{schedules} =  this.props.pulseQueueHistoryList;
        let views = this.getCards(schedules);

        return (
            <View style={{flex: 1,  backgroundColor: '#f5f5f5'}}>
                <ScrollViewWithRefreshControl onRefresh={this.reloadContent.bind(this)}>
                    {views}
                </ScrollViewWithRefreshControl>
            </View>
        );
    }

    loading() {
        return <ActivityIndicator style={styles.loading} color="black"/>;
    }

    navigateToAskDashboard (questionID) {
        Actions.askDashboard({questionID: questionID})
    }

    getCards (schedules) {
        if(schedules && schedules.length > 0) {
            let cards = [];
            let shouldAddDividerView = false;
            let currentItemMonth = undefined;
            let dividerText;
            cards.push(
                schedules.map((item, key) => {
                    if (currentItemMonth === undefined) {
                        currentItemMonth = moment(item.date, originalFormat).format('MM');
                    } else if (!shouldAddDividerView && moment(item.date, originalFormat).format('MM') > currentItemMonth) {
                        shouldAddDividerView = true;
                        dividerText = moment(item.date, originalFormat).format('MMMM YYYY');
                    } else if (schedules.length - 1 === key) {
                        shouldAddDividerView = false;
                    }
                    return <View>
                        {shouldAddDividerView && this.renderDividerView(dividerText)}
                        <DayCard
                            item={item}
                            key={key}
                            questions={this.props.pulseQueueHistoryList}
                            onPress={(key, questionID) => {
                                console.log("Click on Question..");
                                this.navigateToAskDashboard(questionID);
                            }}
                            headerTitle={moment(item.date, originalFormat).format('dddd DD')}
                            rightIcon={'chevron-right'}
                            rightIconClickable={true}
                            onPressRightIcon={(key, questionID) => {
                                this.navigateToAskDashboard(questionID);
                            }}
                            canAddQuestion={false}/>
                    </View>

                }));
            return cards;
        }
        return this.renderNoDataFound();
    }
    renderNoDataFound(){
        return (
            <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                <CustomText style={{color: colorCodes.secondaryFontColor, fontSize: 16}}>No data found</CustomText>
            </View>
        )
    }

    renderDividerView (dividerText) {
        return (
            <View style={{flexDirection: 'row', margin: 5, flexGrow: 1}}>
                <CustomText style={{ alignSelf:'flex-start', paddingHorizontal:5, fontSize: 16, fontWeight: 'bold' }}>{dividerText}</CustomText>
                <View style={{backgroundColor: '#dcdcdc', height: 2, flex: 1, alignSelf: 'center'}} />
            </View>
        );
    }

}

const mapStateToProps = state => ({
    pulseQueueHistoryList: state.pulseQueueHistoryList.body,
    isLoading: state.isLoading,
    error: state.error.message,
});

const mapDispatchToProps = dispatch => ({
    fetchQuestions:()=> dispatch(fetchPulseQueueHistoryList()),
   // addQuestion: (questions, question, itemKey) => dispatch(addQuestion(questions ,question, itemKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryList);