import React,{Component} from 'react';

import {
    Dimensions,
    StyleSheet,
    View
} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';

export default class QPTabView extends Component{

    constructor(props){
        super(props);
    }
    renderTabBar = (props) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
            tabStyle={[styles.tab, {width: this.props.tabWidth}]}
            labelStyle={styles.label}
        />
    );

    render(){
        const{renderScene, navigationState, onIndexChange,style} = this.props;
        return (
            <TabView
                style={[styles.container, style]}
                navigationState={navigationState}
                renderScene={renderScene}
                renderTabBar={this.renderTabBar}
                onIndexChange={onIndexChange}
                swipeEnabled
                initialLayout={initialLayout}
                lazy= {true}
            />
        )
    }
}

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicator: {
        backgroundColor: '#e92563',
    },
    label: {
        fontSize: global.h4FontSize,
        fontFamily: global.semiBoldText ,
        color: global.primaryFontColorForCommunities
    },
    tabbar: {
        backgroundColor: '#ffffff',
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    tab: {
        opacity: 1,
        justifyContent: 'space-between',
    },
    page: {
        backgroundColor: 'red',
    },
});
