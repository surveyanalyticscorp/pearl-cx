import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  FlatList,
  SafeAreaView,
  TextInput,
  LogBox,
} from 'react-native';
import StringUtils from '../../Utils/StringUtils';
import ArrayUtils from '../../Utils/ArrayUtils';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors, statusColors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {Sizes} from '../../styles/Size.constant';
import moment from 'moment';
import {translate} from '../../Utils/MultilinguaUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';
import QPButton from '../../widgets/Button';
import ModalDropdown from '../../widgets/drop-down/ModalDropdown';
import {backgroundColor} from '../../widgets/qp-calendar/style';

export default function TicketComments(props) {
  const sampleData = [
    // {id: 1, title: 'Astro'},
    // {id: 2, title: 'Bakun'},
  ];

  const ShowFlatlistOrNoCommentText = () => {
    return sampleData.length ? <ShowFlatList /> : <ShowNoComments />;
  };

  const ShowFlatList = () => {
    return (
      <FlatList
        style={styles.container}
        data={sampleData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    );
  };

  const renderItem = ({item}) => <Text> {item.title} </Text>;

  const ShowNoComments = () => {
    return (
      <View style={{flex: 1, margin: MarginConstants.tab3}}>
        <Text
          style={{
            fontFamily: FontFamily.medium,
            color: Colors.filterIconColor,
            fontSize: TextSizes.primary,
          }}>
          No Comments...
        </Text>
      </View>
    );
  };

  const onChangeCommentHandler = (text) => {
    console.log(text);
  };
  const getCommentBox = () => {
    return (
      <View style={styles.commentBox}>
        <MaterialIconView iconName="chat-bubble" />
        <TextInput
          // style={styles.input}
          onChangeText={onChangeCommentHandler}
          placeholder="Comment"
          scrollEnabled={true}
        />
      </View>
    );
  };

  const MaterialIconView = ({iconName}) => (
    <View style={{margin: MarginConstants.halfTab}}>
      <MaterialIcon name={iconName} size={24} color={Colors.filterIconColor} />
    </View>
  );

  const ContactButton = () => {
    return (
      <TouchableOpacity>
        <MaterialIconView iconName="account-circle" />
      </TouchableOpacity>
    );
  };

  const AttachmentButton = () => {
    return (
      <TouchableOpacity>
        <MaterialIconView iconName="attach-file" />
      </TouchableOpacity>
    );
  };

  const PictureButton = () => {
    return (
      <TouchableOpacity>
        <MaterialIconView iconName="photo" />
      </TouchableOpacity>
    );
  };

  const CommentFooter = () => {
    return (
      <View style={styles.commentFooter}>
        {getCommentBox()}
        <ContactButton />
        <AttachmentButton />
        <PictureButton />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ShowFlatlistOrNoCommentText />
      <CommentFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
