import React from 'react';
import {
    RefreshControl,
    ScrollView,
    View
} from 'react-native';
import BaseComponentWithoutScroll from "../../../../global/components/BaseComponentWithoutScroll";
import DayCard from "../components/DayCard";
import moment from "moment";
import CustomText from "../../../../global/ui/CustomText";
import {utils} from "../../../../global/Utils";
const originalFormat = 'DD-MM-YYYY hh:mm a z';
export default class AskedQuestionsList extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);

        this.state = {
            nextPageForSectionId: -1,
        };
    }

    componentDidMount() {
        this.props.navigationStateHandler.registerFocusHook(this);
        this.props.getAskedQuestionList();
    }

    componentWillUnmount() {
        this.props.navigationStateHandler.unregisterFocusHook(this);
    }

    handleNavigationSceneFocus() {
        if(!this.props.isLoading) {
            this.props.getAskedQuestionList();
        }
    }

    alertForDeleteQuestion(questionId) {
        utils.showAlert("Delete Question", "Do you want to delete this question?",
            () => {
            }, () => this.buildAndSendDeleteQuestionObject(questionId));
    }

    buildAndSendDeleteQuestionObject(questionId) {
        let deleteQuestionObject = {
            questionID: questionId,
        };
        this.props.deleteQuestion(deleteQuestionObject).then((response) => {
            if (response.body) {
                utils.showToastMessage(response.body.message);
                this.props.getAskedQuestionList();
            }
        });
    }

    getCards (schedules) {
        let cards = [];
        let shouldAddDividerView = false;
        let currentItemMonth = undefined;
        let dividerText;
        cards.push(
            schedules.map((item, key) => {
                if(currentItemMonth === undefined) {
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
                        questions={this.props.questions}
                        headerTitle = {moment(item.date, originalFormat).format('dddd DD')}
                        rightIcon={'delete'}
                        rightIconClickable={true}
                        onPressRightIcon={(key, questionID) => {
                            this.alertForDeleteQuestion(questionID)
                        }}
                        canAddQuestion={item.canAddQuestion}/>
                </View>

            }));
        return cards;
    }

    renderDividerView (dividerText) {
        return (
            <View style={{flexDirection: 'row', margin: 5}}>
                <CustomText style={{ alignSelf:'flex-start', paddingHorizontal:5, fontSize: 16, fontWeight: 'bold' }}>{dividerText}</CustomText>
                <View style={{backgroundColor: '#dcdcdc', height: 2, flex: 1, alignSelf: 'center'}} />
            </View>
        );
    }

    reloadContent() {
        this.props.getAskedQuestionList();
    }

    renderChild() {

        if(!this.props.isLoading) {
            const  {questions} = this.props;

            if(questions && questions.schedules !== undefined) {
                let views = this.getCards(questions.schedules);

                return (
                    <View style={{flex: 1,  backgroundColor: '#f5f5f5'}}>
                        <ScrollView keyboardShouldPersistTaps={'always'} ref='scrollView'
                                    style={{ margin: 6}}
                                    refreshControl={
                                        <RefreshControl
                                            style={{ backgroundColor: 'transparent' }}
                                            refreshing={false}
                                            onRefresh={this.reloadContent.bind(this)}
                                            tintColor="#003566"
                                            title=""
                                            enabled={this.state.refreshEnabled}
                                            progressBackgroundColor="#fff"
                                        />
                                    }
                        >
                            {views}
                        </ScrollView>
                    </View>
                );
            }
        }
        return (<View/>);
    }
}

