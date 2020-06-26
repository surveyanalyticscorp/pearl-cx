import React, {Component} from 'react';
import {Dimensions, Image, Platform, StyleSheet, View} from 'react-native';
import CustomText from '../../../global/ui/CustomText';
import QPCard from '../../../global/widgets/card/QPCard';
import QPPulseChartWidgetNew from '../../../global/widgets/QPPulseChartWidgetNew';
import QPPulseChartWidget from '../../../global/widgets/QPPulseChartWidget';
import colorCodes from '../../../global/widgets/typography/ColorCodes';
import CommentsRow from './CommentRow';
//import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
//var PageControl = require('react-native-page-control');
const DONUT_COLOR = '#0097DC';
const LINE_COLOR = '#efefef';
const ICON_SIZE = 40;
const TEXT_COLOR = '#7e7e7e';
const { height, width } = Dimensions.get('window');
export default class PulseDashboard extends Component {
  constructor(props) {
    super(props);
    // console.log(JSON.stringify(this.props.data));
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.getTeamResponseContent()}
        {this.getCharts()}
        {this.getComments()}
      </View>
    );
  }

  getCharts() {
    let contents = [];
    let customFieldsData = this.props.data.body.selectedBatch.result.employeeFieldResults;
    let timeStamp = this.props.data.body.selectedBatch.batch.timestamp;

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

  getQuestionText() {
    return (
      <View key="questionText" style={{ margin: 10 }}>
        <CustomText
          style={[
            {
              fontFamily: global.boldText,
              fontSize: 16,
              padding: 2,
              flexWrap: 'wrap'
            },
            colorCodes.primaryFontColor
          ]}
        >
          {this.props.data.body.selectedBatch.question.title}
        </CustomText>
      </View>
    );
  }
  getIndividualResult() {
    let result = this.props.data.body.selectedBatch.result.individualResult;
    let timeStamp = this.props.data.body.selectedBatch.batch.timestamp;
    let item = {};
    item.choiceAnalytics = [];
    item.choiceAnalytics.push({
      positivePercent: result.positiveResult.percentageFormatted,
      neutralPercent: result.neutralResult.percentageFormatted,
      negativePercent: result.negativeResult.percentageFormatted,
      individual: true
    });
    return (
      <View style={styles.content}>
        <QPCard title={'Your Response'}>
          <QPPulseChartWidgetNew item={item} timeStamp={timeStamp} responseCount={1} />
        </QPCard>
      </View>
    );
  }
  getTeamResponseContent() {
    return (
      <View style={styles.content} key="team_response">
        <QPCard
          title={this.props.data.body.selectedBatch.question.title}
          renderOptions={this.renderIndividualResponse()}
        >
          <View style={styles.chartContainer}>
            <QPPulseChartWidget
              data={this.props.data.body.selectedBatch.result.teamResult.positiveResult.percentage}
              timeStamp={this.props.data.body.selectedBatch.batch.timestamp}
              responseCount={this.props.data.body.selectedBatch.result.teamResult.totalCount}
            />
          </View>
        </QPCard>
      </View>
    );
  }

  renderIndividualResponse() {
    //console.log('Rendering image... ');
    return <Image source={this.getIndividualResultImage()} style={{ height: 25, width: 25 }} />;
  }

  getIndividualResultImage() {
    let resultData = this.props.data.body.selectedBatch.result.individualResult;
    if (resultData.positiveResult.percentage === 100) {
      if (Platform.OS != 'ios') {
        return require('../../../global/images/pulse_positive.png');
      } else {
        return { uri: 'pulse_positive.png' };
      }
    } else if (resultData.negativeResult.percentage === 100) {
      if (Platform.OS != 'ios') {
        return require('../../../global/images/pulse_negative.png');
      } else {
        return { uri: 'pulse_negative.png' };
      }
    } else {
      if (Platform.OS != 'ios') {
        return require('../../../global/images/pulse_neutral.png');
      } else {
        return { uri: 'pulse_neutral.png' };
      }
    }
  }

  getComments() {
    let comments = this.props.data.body.selectedBatch.result.comments;
    let contents = [];
    comments.map((item, index) => {
      let color = index % 2 == 0 ? 'white' : '#5b7cba';
      let textColor = index % 2 == 0 ? '#636363' : 'white';
      contents.push(<CommentsRow color={color} textColor={textColor} comment={item} key={'comments_' + index} />);
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

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    margin: 10
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15
  },

  lastResponseText: {
    color: TEXT_COLOR,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8
  }
});
