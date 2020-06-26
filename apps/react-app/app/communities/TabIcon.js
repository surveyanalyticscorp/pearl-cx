import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Platform,
    TouchableHighlight,
    ScrollView,
    Text,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import CustomText from '../global/ui/CustomText';

 const TabIcon = ({selected, title, iconImage} ) => (
  
    <View style={{flexDirection:'row', borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: 'rgba(0, 0, 0, .2)',
                borderLeftWidth: StyleSheet.hairlineWidth,
                borderLeftColor: 'rgba(0, 0, 0, .2)',
              borderRightWidth: StyleSheet.hairlineWidth,
            borderRightColor: 'rgba(0, 0, 0, .2)',}}>
      <View style={{flex:1, paddingVertical:6, backgroundColor: selected? '#e8e8e8':'#ffffff', justifyContent:'center', alignItems:'center'}}>
        <Image source={iconImage} style={{height:20, width:20}}></Image>
        <CustomText style={{color:'#9A9C9C', fontSize:14, marginTop:4}}>{title}</CustomText>
    </View>
   </View>
  );
export default TabIcon;