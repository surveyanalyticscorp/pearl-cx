import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    WebView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import FeedbackCell from '../feedbackCell';
import { ActionBarModule, AuthenticationModule } from '../../../../global/native-modules/NativeModules';
import CustomText from "../../../../global/ui/CustomText";

class FeedbackDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.feedbackDetail ? props.feedbackDetail : null,
            authToken : undefined
        };
        AuthenticationModule.getAuthToken((token)=>{
            this.setState({authToken: token});
        }, (error)=>{console.log("Error-"+error)});
    }

    componentWillUnmount() {
        Actions.refresh();
        ActionBarModule.updateTitleAndMenu(
            JSON.stringify({
                title: 'Feedback'
            })
        );
        ActionBarModule.toggleBackButton(false);
    }

    componentWillReceiveProps(props) {
        this.setState({ data: props.feedbackDetail });
    }



    _press = () => {
        ActionBarModule.updateTitleAndMenu(
            JSON.stringify({
                title: 'Change Status',
                image: 'rightArrowWhite',
                isStatic: true
            })
        );
        ActionBarModule.toggleBackButton(true);
        Actions.cxFeedbackUpdate({
            data: this.state.data
        });
    }

    render() {
        const data = this.state.data;
        let uri = global.BASE_URL + "" + data.responseSetLink
        if(this.state.authToken) {
            console.log("URL= "+ uri + " And Auth-Token: "+this.state.authToken);
            return (
                <View style={{flex: 1}}>
                    <View style={{flex: 0.94}}>
                        <FeedbackCell
                            item={data}
                            origin="Detail"
                            onPressStatus={this._press}
                        />
                        <View style={{flex: 1}}>
                            <WebView
                                source={{uri: uri, headers: {"Auth-Token": this.state.authToken}}}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={true}/>
                        </View>
                    </View>
                    <View style={styles.updateButtonWrapper}>
                        <TouchableHighlight
                            onPress={this._press}
                            underlayColor={'rgba(0, 0, 0, 1)'}
                        >
                            <View style={styles.updateButton}>
                                <CustomText style={[styles.textLarge, styles.whiteText]}>Update</CustomText>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

            )
        }
        return <View/>;
    }
}

export default FeedbackDetail;
