import React from 'react';
import ScrollViewWithRefreshControl from '../../../global/ui/ScrollViewWithRefreshControl';
import DiscussionItemWidget from '../../../global/widgets/DiscussionItemWidget';
import CustomText from '../../../global/ui/CustomText';
import {Actions} from 'react-native-router-flux';
import I18n from 'react-native-i18n';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../../actions/index';
import {FlatList, View} from 'react-native';

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.renderNoDataFound = this.renderNoDataFound.bind(this);
    }

    handleNavigationSceneFocus() {
        console.log("From handleNavigationSceneFocus");
        this.reloadContent();

    }

    componentDidMount() {
        console.log("Component Did mount");
        // this.props.navigationStateHandler.registerFocusHook(this);

       if(this.hasEmptyDataSet()){
           this.reloadContent();
       }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("Component Update");
    }
    hasEmptyDataSet(){
        return (!this.props.panelLiveDiscussions || JSON.stringify(this.props.panelLiveDiscussions) === '{}'
            || this.props.panelLiveDiscussions.chats.length === 0)
    }

    componentWillUnmount() {
        this.props.navigationStateHandler.unregisterFocusHook(this);
    }


    onEndReached(){

    }

    reloadContent() {
        console.log("From reloadContent");
        this.props.onPress();
    }

    showLiveDiscussions() {

            return this.renderLiveDiscussionList();

    }

    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            <View key={rowID} style={{height: 0.5, backgroundColor: '#ECEBF0'}}>
            </View>
        )
    }

    renderLiveDiscussionList() {

        const {panelLiveDiscussions} = this.props;
        if (panelLiveDiscussions) {
            return (
                <FlatList ref={ref => this.listView = ref}
                          style={{backgroundColor: 'transparent'}}
                          renderItem={this.renderRow}
                          removeClippedSubviews={false}
                          enableEmptySections={true}
                          onEndReached={this.onEndReached}
                          onEndReachedThreshold={10}
                          data={panelLiveDiscussions.chats}
                          keyExtractor={item => item.ID}
                          ItemSeparatorComponent={this.renderSeparator}
                          refreshing={false}
                          onRefresh={() => {
                              this.reloadContent()
                          }}
                          ListEmptyComponent={this.renderNoDataFound}
                />
            );
        }
        return (<View/>);

    }

    renderRow({item}) {
        return (
            <DiscussionItemWidget key={item.ID}
                                  discussionData={item}
                                  onPress={() => {
                                      if (this.props.isConnected) {
                                          Actions.liveDiscussion({discussion: item, title: item.name});
                                      }
                                  }}
                                  lastCommentText = {I18n.t('last_comment', {locale: this.props.language})}
                                  commentText = {I18n.t('comments', {locale: this.props.language})}
                                  />
        );
    }

    renderNoDataFound() {
        if(!this.props.isLoading) {
            return (

                <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                    <CustomText style={{
                        color: 'black',
                        fontSize: 16
                    }}>{I18n.t('noDataToDisplay', {locale: this.props.language})}</CustomText>
                </View>

            );
        }
        return <View/>;
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex:1}}>
                {this.showLiveDiscussions()}
            </View>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        panelDiscussionList: state.panelDiscussionData,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Chat);
