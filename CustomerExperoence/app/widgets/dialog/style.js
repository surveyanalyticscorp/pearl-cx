import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MarginConstants} from "../../style/margin.constants";
import {TextSizes} from "../../style/textsize.constants";

export const styles = EStyleSheet.create({
    defaultLoadingText:{
        marginLeft: MarginConstants.tab2,
        fontSize: TextSizes.secondary,
        color: "#00000089"
    },
    loadingView:{
        alignItems: 'center'
    },


})
