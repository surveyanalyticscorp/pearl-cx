import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import SubViewBaseComponent from "../../../../global/components/SubView";
import ScrollViewWithRefreshControl from "../../../../global/ui/ScrollViewWithRefreshControl";
import {connect} from 'react-redux';
import {fetchPulseQueueHistoryReport} from "../../../actions/AskHomePageActions";
import QPPulseChartWidget from "../../../../global/widgets/QPPulseChartWidget";
import QPCard from "../../../../global/widgets/card/QPCard";
import CommentRow from "../../pulseHome/CommentRow";
import QPPulseChartWidgetNew from "../../../../global/widgets/QPPulseChartWidgetNew";
import BaseComponent from "../../../../global/components/BaseComponent";
import styles from './askDashboardStyle';

class AskDashboard extends BaseComponent {
    constructor(props) {
        super(props)
    }
    componentWillMount(){
        this.reloadContent();
    }

    reloadContent(){
        this.props.fetchReport({questionID: this.props.questionID});
    }
    renderChild() {
        return (
            <SubViewBaseComponent style={{flex: 1,backgroundColor:'grey'}} backText={"Back"}>
                <ScrollViewWithRefreshControl onRefresh={this.reloadContent.bind(this)}>
                    {this.getDashboardData()}
                </ScrollViewWithRefreshControl>
            </SubViewBaseComponent>
        )
    }
    getDashboardData(){

        if(!this.props.pulseQueueReport){return <View/>}

        return (
            <View style={{flex:1}}>
                {this.getTeamResponseContent()}
                {this.getCharts()}
                {this.getComments()}
            </View>
        );
    }
    getTeamResponseContent() {

        return (
            <View style={styles.content} key="team_response">
                <QPCard
                    title={this.props.pulseQueueReport.question.text}
                >
                    <View style={styles.chartContainer}>
                        <QPPulseChartWidget
                            data={this.props.pulseQueueReport.overall.positivePercent}
                            timeStamp={this.props.pulseQueueReport.question.scheduled}
                            responseCount={this.props.pulseQueueReport.overall.totalCount}
                        />
                    </View>
                </QPCard>
            </View>
        );
    }
    getCharts() {
        let contents = [];
        let customFieldsData = this.props.pulseQueueReport.employeeFieldResults;
        let timeStamp = this.props.pulseQueueReport.question.scheduled;

        customFieldsData.map((item, index) => {
            let totalCount = 0;
            item.choiceAnalytics.forEach(item => {
                totalCount += item.totalCount;
            });
            contents.push(
                <View style={styles.content} key={item.fieldName + '_' + index}>
                    <QPCard title={item.fieldName}>
                        <QPPulseChartWidgetNew item={item} timeStamp={timeStamp} responseCount={totalCount} />
                    </QPCard>
                </View>
            );
        });
        return contents;
    }
    getComments() {
        let comments = this.props.pulseQueueReport.comments;
        if(comments.length === 0) {
            return (<View/>);
        }
        let contents = [];
        comments.map((item, index) => {
            let color = index % 2 == 0 ? 'white' : '#5b7cba';
            let textColor = index % 2 == 0 ? '#636363' : 'white';
            contents.push(<CommentRow color={color} textColor={textColor} comment={item} key={'comments_' + index} />);
        });
        return (
            <View style={styles.content}>
                <QPCard title="Team Comments">
                    <View style={{ padding: 10, backgroundColor: '#ebeff4' }}>{contents}</View>
                </QPCard>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    pulseQueueReport: state.pulseQueueReport.body,
    isLoading: state.isLoading,
    error: state.error.message,
});

const mapDispatchToProps = dispatch => ({
    fetchReport:(data)=> dispatch(fetchPulseQueueHistoryReport(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AskDashboard);