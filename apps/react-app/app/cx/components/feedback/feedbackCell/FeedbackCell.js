import React, {Component} from 'react';
import {
    View,
    Image,
    Platform,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';

import styles from './styles';
import ThreeDot from './ThreeDot';
import StringUtils from "../../../../global/StringUtils";
import ArrayUtils from "../../../../global/ArrayUtils";
import CustomText from "../../../../global/ui/CustomText";

const ProgressColor = {
    5: '#ff0101',
    1: '#ff7058',
    0: '#9b9b9b',
    2: '#7dc855'
};

class FeedbackCell extends Component {

    _cellTap = () => {
        this.props.onSelect();
    }

    render() {
        const item = this.props.item;
        const index = this.props.index;
        const disable = this.props.origin === "Detail"
        const bgColor = this.getScoreColor(item.sentiment);
        const selected = this.props.selected;
        const textResult = StringUtils.isNotEmpty(item.textResultValue) ? item.textResultValue : item.emailAddress;
        const userName = (item.firstName? item.firstName+" ": "") + "" +(item.lastName? item.lastName: "");
        return (
            <TouchableHighlight
                onPress={this._cellTap}
                disabled={disable}
                underlayColor={'rgba(0, 0, 0, 0)'}
            >
                <View style={[styles.cell, {backgroundColor: selected ? 'rgba(0, 0, 0, 0.18)' : 'transparent'}, index === 0 ? {marginTop:10}:{}]}>
                    <View style={[styles.score, {backgroundColor: bgColor}]}>
                        <CustomText style={[styles.textExtraLarge, styles.whiteText, styles.boldText]}>{item.answerText}</CustomText>
                    </View>
                    <View style={styles.rightContent}>
                        <View style={styles.upperContent}>
                            <View style={{flex: 0.6}}>
                                <CustomText
                                    style={[styles.textLarge, styles.grayText]}>{item.businessUnitName}</CustomText></View>
                            {this.getTicketStatusView(item)}
                        </View>
                        <View style={styles.lowerContent}>
                            <View style={{flex: 0.6}}>
                                <CustomText style={[styles.textLarge, styles.blueText]}>{userName}</CustomText>
                                {!disable && <CustomText style={[styles.textMedium, styles.grayText]}>{textResult}</CustomText>}
                                <CustomText style={[styles.textMedium, styles.grayText]}>{item.surveyTakenDate}</CustomText>
                            </View>
                            {!disable &&
                            <Image style={styles.rightIcon} source={_getImageUri('right_arrow_grey.png')}/>}
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )

    }
    getTicketStatusView(item){
        if(item.ticketStatus !== -1){
            const{ticketStatuses} = this.props;
            return (
                <TouchableOpacity activeOpacity={this.props.onPressStatus? 0.8: 1}
                                  onPress={()=>{
                                      this.props.onSelect && this.props.onSelect();

                                  }}>
                    <View style={styles.status}>
                        <CustomText style={[styles.textSmall, styles.grayText]}>{ArrayUtils.getMatchingObject(ticketStatuses,'id',item.ticketStatus).text}</CustomText>
                        <ThreeDot
                            color={ProgressColor[item.ticketStatus]}
                        />
                    </View>
                </TouchableOpacity>
            )
        }
    }

    getScoreColor = (sentiment) => {
        if (sentiment === 'Detractor') {
            return "#ff0047"
        } else if (sentiment === 'Passive') {
            return "#E3CA14"
        } else {
            return "#63A523"
        }
    }
}

const _getImageUri = src => {
    if (Platform.OS === 'android') {
        return {uri: `asset:/${src}`};
    }

    return {uri: src};
};

export default FeedbackCell;
