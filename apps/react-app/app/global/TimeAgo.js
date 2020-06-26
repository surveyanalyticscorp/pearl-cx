import React, { Component } from 'react';
import {
    Text

} from 'react-native';
import CustomText from './ui/CustomText';
import moment from 'moment';
import TimerMixin from 'react-timer-mixin';
export default class TimeAgo extends Component {
    componentDidMount() {
        var {interval} = this.props;
        this.setInterval(this.update, interval);
    }
    componentWillUnmount() {
        this.clearInterval(this.update);
    }
    update() {
        this.forceUpdate();
    }
    render() {
        return (
            <CustomText {...this.props}>{moment(this.props.time).fromNow(this.props.hideAgo)}</CustomText>
        );
    }
    clearInterval(){
        this.props.interval = 0;
    }
    setInterval(interval){
        this.props.interval = interval;
    }

};
// TimeAgo.propTypes = {
//     time: React.PropTypes.oneOfType([
//         React.PropTypes.string,
//         React.PropTypes.number,
//         React.PropTypes.array,
//         React.PropTypes.instanceOf(Date)
//     ]).isRequired,
//     interval: React.PropTypes.number,
//     hideAgo: React.PropTypes.bool
// };
TimeAgo.defaultProps = {
    hideAgo: false,
    interval: 60000
};