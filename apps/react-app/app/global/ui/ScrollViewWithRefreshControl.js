import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    RefreshControl
} from 'react-native';

export default class ScrollViewWithRefreshControl extends Component {

    constructor(props) {
        super(props);
        this.state = { showLoader: false }
    }

    render() {
        return (
            <ScrollView
                {...this.props}
                refreshControl={
                    <RefreshControl
                        style={{ backgroundColor: 'transparent' }}
                        refreshing={this.state.showLoader}
                        onRefresh={this.props.onRefresh}
                        tintColor="#003566"
                        title=""
                        enabled={this.state.refreshEnabled}
                        progressBackgroundColor="#fff"
                        />
                }
                >
                {this.props.children}
            </ScrollView>
        );
    }

}