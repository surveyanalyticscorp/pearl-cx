import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Text} from 'react-native';
import TimeAgo from '../../../widgets/TimeAgo';
import ReadMore from 'react-native-read-more-text';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import StringUtils from '../../../Utils/StringUtils';

const TicketWidget = props => {
  const _renderTruncatedFooter = handlePress => {
    return (
      <Text
        style={styles.truncatedFooter}
        onPress={handlePress}>
        Read more
      </Text>
    );
  };

  const _renderRevealedFooter = handlePress => {
    return (
      <Text
        style={styles.truncatedFooter}
        onPress={handlePress}>
        Show less
      </Text>
    );
  };

  let onPress = () => {
    props.navigation.navigate('Ticket Details',{item:props.item});
  };

  let renderReadMoreView = () => {
    if (StringUtils.isNotEmpty(props.comment)) {
      return <ReadMore
          numberOfLines={3}
          renderTruncatedFooter={_renderTruncatedFooter}
          renderRevealedFooter={_renderRevealedFooter}>
        <Text style={styles.comment}>{ props.comment }</Text>
      </ReadMore>
    }
    return <Text style={styles.comment}>No comments</Text>
  };


  return (
    <TouchableWithoutFeedback
      onPress={onPress}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
          {props.item.emailAddress}
        </Text>
        <TimeAgo style={styles.subtitle} time={props.item.timestamp} />
        <View style={{marginTop: MarginConstants.halfTab}}>
          {renderReadMoreView()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
    marginTop: MarginConstants.tab1,
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: MarginConstants.tab1,
    padding: PaddingConstants.tab1,
  },
  title: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: TextSizes.mediumText,
    marginTop: 2,
    color: Colors.secondary,
    textAlign: 'left',
  },
  comment: {
    fontSize: TextSizes.semiMediumText,
    color: Colors.secondary,
    textAlign: 'left',
  },
  truncatedFooter: {
    color: Colors.accent,
    marginTop: 5,
    fontSize: TextSizes.mediumText
  }
});

export default TicketWidget;
