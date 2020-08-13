import React from 'react';
import {StyleSheet, View, TouchableHighlight, Text} from 'react-native';
import TimeAgo from '../../../widgets/TimeAgo';
import ReadMore from 'react-native-read-more-text';
const TicketWidget = props => {
  const _renderTruncatedFooter = handlePress => {
    return (
      <Text
        style={{color: 'blue', marginTop: 5, fontSize: 12}}
        onPress={handlePress}>
        Read more
      </Text>
    );
  };

  const _renderRevealedFooter = handlePress => {
    return (
      <Text
        style={{color: 'blue', marginTop: 5, fontSize: 12}}
        onPress={handlePress}>
        Show less
      </Text>
    );
  };
  return (
    <TouchableHighlight
      onPress={props.onPress}
      activeOpacity={0.6}
      underlayColor={'#CCCCCC'}>
      <View style={styles.mainContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
          {props.name}
        </Text>
        <TimeAgo style={styles.subtitle} time={props.time} />
        <View style={{marginTop: 10}}>
          <ReadMore
            numberOfLines={3}
            renderTruncatedFooter={_renderTruncatedFooter}
            renderRevealedFooter={_renderRevealedFooter}>
            <Text style={styles.comment}>
              {props.comment ? props.comment : 'No comments.'}
            </Text>
          </ReadMore>
        </View>
      </View>
    </TouchableHighlight>
  );
};
TicketWidget.defaultProps = {
  name: 'Customer Experience',
  time: '2016-10-17 00:46:17.0',
  comment:
    'I am not able to login to my account. It keeps saying invalid login credentials. Can someone please give me a call at my below mentioned number.',
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 10,
    marginRight: 10,
    minHeight: 120,
    padding: 10,
  },
  title: {
    color: '#393939',
    fontSize: 16,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    color: '#393939',
    textAlign: 'left',
  },
  comment: {
    fontSize: 12,
    color: '#393939',
    textAlign: 'left',
  },
});

export default TicketWidget;
