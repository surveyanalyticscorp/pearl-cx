import React, {Component} from 'react';
import {ActivityIndicator, Animated, Dimensions, FlatList, StyleSheet, View} from 'react-native';
import CustomText from "../../../global/ui/CustomText";
import SubView from '../../../global/components/SubView';
import {utils} from '../../../global/Utils'
import I18n from 'react-native-i18n';
import {Actions} from "react-native-router-flux";
import ActionButton from 'react-native-action-button';
import ModuleItemRow from "./ModuleItemRow";
import moment from "moment/min/moment-with-locales.min";
import QPTabView from "../../QPTabView";

export default class ModuleItemList extends Component {
    currentTab = 0;
    previousTab = 0;
    constructor(props) {
        super(props);
        let useTranslationForTabs = true;
        if(global.appUser.useTranslationsForTabs){
            useTranslationForTabs = global.appUser.useTranslationsForTabs ==='true';
        }

        this.state = {
            index: 0,
            isLoadingTail: false,
            routes: [
                {
                    key: '1',
                    type : "RECENT",
                    title: useTranslationForTabs? I18n.t(props.tabTitles[0], {locale: props.language}): props.tabTitles[0] ,
                    text: I18n.t('no_recent_ideas', {locale: props.language})
                },
                {
                    key: '2',
                    type : "POPULAR",
                    title: useTranslationForTabs? I18n.t(props.tabTitles[1], {locale: props.language}) : props.tabTitles[1],
                    text: I18n.t('no_popular_ideas', {locale: props.language})
                },
                {
                    key: '3',
                    type : "POST_BY_ME",
                    title: useTranslationForTabs? I18n.t(props.tabTitles[2], {locale: props.language}) : props.tabTitles[2],
                    text: I18n.t('no_posted_by_me_ideas', {locale: props.language})
                },
                {
                    key: '4',
                    type : "FAVOURITE",
                    title: useTranslationForTabs? I18n.t(props.tabTitles[3], {locale: props.language}) : props.tabTitles[3],
                    text: I18n.t('no_favorite_ideas', {locale: props.language})
                }
            ],
            data: [],
            totalCount: 0,
            lastAddedCount: 0,
            page : 0,
        };
        this.renderRow = this.renderRow.bind(this);
        this.hasMore = this.hasMore.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.renderNoDataFound = this.renderNoDataFound.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.updateResponse = this.updateResponse.bind(this);

    }

    componentDidMount() {
        this.reloadContent();
    }

    getRequestData() {
        const{categoryIDLabel} = this.props;
        return {
            page: this.state.page,
            [`${categoryIDLabel}`]: this.props.category.ID,
            type: this.state.routes[this.state.index].type,
        }
    }

    reloadContent() {
        const{fetchItems} = this.props;
        this.setState({
            data: [],
            page: 0,
            lastAddedCount: 0,
        }, () => {
            fetchItems(this.state.page, this.state.routes[this.state.index].type, this.updateResponse);
        })
    }

    updateResponse = (items)=>{
        this.setState({
            data: [...this.state.data, ...items],
            lastAddedCount: items.length,
            dataLoaded: true,
            isLoadingTail : false,
        })
    };

    hasMore() {
        return this.state.lastAddedCount > 0 && this.state.lastAddedCount % 10 === 0   ;
    }

    onItemVote(item, isUpVote, failure = () => {}) {
        const{idLabel} = this.props;
        const baseItem = item;
        const index = this.getIndex(this.state.data, item[`${idLabel}`], idLabel);
        let updatedIdea = this.updateLocalState(item, isUpVote);
        this.props.addUpdateVoteAction(this.getRequestDataForVote(item,isUpVote))
            .catch((error) => {
                this.props.onError && this.props.onError(error);
                let data = this.state.data;
                data[index] = baseItem;
                this.setState({data: data});
                failure(baseItem);
            });
        return updatedIdea;
    }



    updateIdeaOnComment(idea, commentCount, failure= ()=>{}){

        let updatedIdea = {};
        updatedIdea.commentsCount = commentCount;
        this.updateItemInCacheAndState(idea, updatedIdea);
    }

    updateLocalStateForFavorite(idea) {
        let updatedIdea = {};
        updatedIdea.myFavourite = idea.myFavourite==='checked'? '': 'checked';
        return this.updateItemInCacheAndState(idea, updatedIdea);
    }

    updateLocalState(item, isUpVote) {
        let updatedIdea = {};
        if (isUpVote) {
            this.handleUpVoteAction(item, updatedIdea);
        }
        else {
            this.handleDownVoteAction(item, updatedIdea);
        }
        return this.updateItemInCacheAndState(item, updatedIdea);
    }


    updateItemInCacheAndState(item, updatedItem) {
        let data = this.state.data;
        const{idLabel} = this.props;
        let index = this.getIndex(data, item[`${idLabel}`], idLabel);
        if(index !== -1) {
            data[index] = Object.assign({}, item, updatedItem);
            this.setState({data: data});
            //this.updateIdeaInResultCache(data[index]);
            return data[index];
        }
        return item;
    }

    handleDownVoteAction(item, updatedItem) {
        if (this.isDownVotedEarlier(item)) {
            updatedItem.myVote = 0;
            updatedItem.downVotes = item.downVotes - 1;
        }
        else if (this.isUpVotedEarlier(item)) {
            updatedItem.myVote = -1;
            updatedItem.upVotes = item.upVotes - 1;
            updatedItem.downVotes = item.downVotes + 1;
        }
        else {
            updatedItem.myVote = -1;
            updatedItem.downVotes = item.downVotes + 1;
        }
    }

    isUpVotedEarlier(item) {
        return item.myVote === 1;
    }

    isDownVotedEarlier(item) {
        return item.myVote === -1;
    }

    handleUpVoteAction(item, updatedItem) {
        if (this.isUpVotedEarlier(item)) {
            updatedItem.myVote = 0;
            updatedItem.upVotes = item.upVotes - 1;
        }
        else if (this.isDownVotedEarlier(item)) {
            updatedItem.myVote = 1;
            updatedItem.upVotes = item.upVotes + 1;
            updatedItem.downVotes = item.downVotes - 1;
        }
        else {
            updatedItem.myVote = 1;
            updatedItem.upVotes = item.upVotes + 1;
        }
    }

    renderNoDataFound() {
        //TODO : Multilingual
        const{itemLabel} = this.props;
        if (!this.props.isLoading) {
            return (

                <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                    <CustomText style={{
                        color: global.tertiaryFontColorForCommunities,
                        fontSize: 16
                    }}>{I18n.t('noDataToDisplay',{locale:this.props.language})}</CustomText>
                </View>

            );
        }
        return (<View/>);

    }

    getReference(ref) {
        return "listview";
    }
    handleAddItemClick(item = undefined, successCallback=()=>{}){
        const{categoryIDLabel, addItem} = this.props;
        addItem(item,(updatedItem)=>{
                if(item){
                    this.updateItemInLocalCache(item,updatedItem)
                    successCallback(updatedItem);
                }
                else {
                    if (updatedItem[`${categoryIDLabel}`] === this.props.category.ID && this.state.index !== 3)
                        this.setState({data: [updatedItem, ...this.state.data]});
                }
            });
    }
    updateItemInLocalCache(item, updatedItem) {
        const{ data} = this.state;
        const{idLabel} = this.props;
        let index = this.getIndex(data, item.ID? item.ID: item[`${idLabel}`], idLabel);
        if(index !== -1) {
            data[index] = Object.assign({}, item, updatedItem);
            this.setState({data: data});
            //this.updateIdeaInResultCache(data[index]);
            return data[index];
        }
        return item;
    }
    renderItemsList() {
        const{idLabel} = this.props;
        return (
            <FlatList ref={ref => this.listView = ref}
                      style={{flex: 1, paddingTop: 10 }}
                      keyExtractor={(item) =>{ return item.ID? item.ID : item[`${idLabel}`]}}
                      ListFooterComponent={this.renderFooter}
                      renderItem={this.renderRow}
                      ItemSeparatorComponent={this.renderSeparator}
                      data={this.state.data}
                      onEndReached={this.onEndReached}
                      onEndReachedThreshold={0.01}
                      refreshing={false}
                      ListEmptyComponent={this.renderNoDataFound}
                      onRefresh={() => {
                          this.reloadContent();
                      }}
            />
        );
    }


    onEndReached() {
        const{fetchItems} = this.props;

        if (!this.hasMore() || this.state.isLoadingTail) {
            return;
        }
        this.setState({
                isLoadingTail: true,
                page : this.state.page + 1
            },
            () => {
                fetchItems(this.state.page,
                    this.state.routes[this.state.index].type,
                    this.updateResponse);
            });


    }


    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            <View key={rowID} style={{height: 10, backgroundColor: 'transparent'}}>
            </View>
        )
    }

    renderFooter() {
        if (this.state.isLoadingTail) {
            return (
                <ActivityIndicator
                    color={'#003566'}
                    animating={true}
                    size="small"

                />
            )
        }

        return <View style={{height: 120}}/>;
    }
    updateLocalStateForFavorite(item) {
        let updatedItem = {};
        updatedItem.myFavourite = item.myFavourite==='checked'? '': 'checked';
        return this.updateItemInLocalCache(item, updatedItem);
    }
    onItemFavorite(item, failure = () => {}) {
        const{idLabel} = this.props;
        const index = this.getIndex(this.state.data, item[`${idLabel}`],idLabel);
        const baseItem = item;
        let updatedItem = this.updateLocalStateForFavorite(item);
        this.props.onFavoriteAction(this.getRequestDataForFavorite(item, updatedItem)).catch((error)=>{
            this.props.onError && this.props.onError();
            let data = [...this.state.data];
            data[index] = baseItem;
            this.setState({data: data});
        });

        return updatedItem;


    }
    getRequestDataForFavorite(item, updatedItem){
        const{idLabel, categoryIDLabel} = this.props;
        return {
            [`${idLabel}`]: item[`${idLabel}`],
            "isMarkFavourite": updatedItem.myFavourite ==='checked',
            [`${categoryIDLabel}`] : item[`${categoryIDLabel}`]
        }
    }

    getRequestDataForVote(item, isUpVote){
        const{idLabel, categoryIDLabel} = this.props;
        return {
            [`${idLabel}`]: item[`${idLabel}`],
            "isUpVote" : isUpVote,
            [`${categoryIDLabel}`] : item[`${categoryIDLabel}`]
        }
    }
    onModuleUpdateComment(item, commentCount, failure= ()=>{}){
        let updatedItem = {};
        updatedItem.commentsCount = commentCount;
        this.updateItemInCacheAndState(item, updatedItem);
    }
    renderRow({item}) {
       const{onFavorite,itemTitleLabel, itemImageURLLabel,onEdit,onDelete,onEditComplete, onError,useIcon,showDocumentViewer}  = this.props;
        let member = item.author? item.author : {
            "firstName": item.authorFirstName,
            "lastName": item.authorLastName,
            "profileImage": item.memberImage,
            "memberID": item.memberID
        };

        let creationTimestamp = isNaN(item.creationTimeStamp) ? item.creationTimeStamp
            : ((moment(new Date(item.creationTimeStamp)).format('MMM DD, YYYY')).toUpperCase());
        return (
            <ModuleItemRow
                     item={item}
                     title = {item[`${itemTitleLabel}`]}
                     itemImageURL = {item[`${itemImageURLLabel}`]}
                     memberImage = {member.profileImage}
                     description = {item.description}
                     authorFirstName={member.firstName}
                     authorLastName = {member.lastName}
                     creationTimeStamp={creationTimestamp}
                     onModuleUpdateComment = {this.onModuleUpdateComment.bind(this)}
                     onItemVote={this.onItemVote.bind(this)}
                     onFavorite={this.onItemFavorite.bind(this)}
                     onEdit ={this.handleAddItemClick.bind(this)}
                     onDelete = {this.alertForItemDelete.bind(this)}
                     onEditComplete = {onEditComplete}
                     onError = {onError}
                     onDetailsLoadAction = {(props)=>{
                         this.props.onDetailsLoad(props);
                     }}
                     useIcon = {useIcon}
                     showDocumentViewer={(documentURL) => {
                         showDocumentViewer && showDocumentViewer(documentURL)
                     }}
                     />
        );
    }


    render() {
        const{headerLabel,category,categoryTitleLabel} = this.props;
        return (
            <SubView title={category[`${categoryTitleLabel}`]}>
                <QPTabView
                    style={this.props.style}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    onIndexChange={this._handleChangeTab.bind(this)}

                />
                <ActionButton
                    buttonColor="#3498db"
                    fixNativeFeedbackRadius
                    onPress={() => {
                        this.handleAddItemClick();
                    }}
                />
            </SubView>
        );
    }

    _handleChangeTab(index) {
        this.previousTab = this.currentTab;
        this.currentTab = index;
        console.log("Change Tab - " + index);
        this.setState({data: []});
        this.setState({
            index,
        });
        if (!this.props.isLoading) {
            this.reloadContent();
        }

    };


    _renderScene = ({route}) => {
        if (this.state.index === this.state.routes.indexOf(route)) {

            return <View style={{flex: 1,backgroundColor:'#e8e8e8'}}>
                {this.renderView()}
            </View>;

        }
        return null;
    };

    renderView() {

        if (this.state.data) {
            return this.renderItemsList();

        }
        return (<View></View>);
    }


    componentWillUnmount() {
        this.resultCache = [];
    }

    getIndex(data, id, idLabel){
        let clone = JSON.parse(JSON.stringify(data));
        return clone.findIndex((obj) => parseInt(obj[idLabel]) === parseInt(id));
    }

    alertForItemDelete(item, successCallback = ()=>{}){
        const{headerLabel} = this.props;
        utils.showAlert("Delete "+headerLabel, "Do you really want to delete this item?",
            ()=>{}, ()=> this.deleteItem(item, successCallback));
    }
    deleteItem(item, successCallback = ()=>{}){
        const{idLabel} = this.props;
        this.props.deleteItemAction(this.buildItemObjectToDelete(item)).then((response) => {

            if (response.body) {
                let data =  utils.removeElementByAttribute( this.state.data,idLabel,item[`${idLabel}`]);
                this.setState({
                    data:data

                }, () => {
                    utils.showToastMessage(response.body.message);
                    successCallback();
                });


            }
        });
    }

    buildItemObjectToDelete(item){
        const{idLabel, categoryIDLabel} = this.props;
        return {
            [`${idLabel}`]: item[`${idLabel}`],
            [`${categoryIDLabel}`] : item[`${categoryIDLabel}`]
        }
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    indicator: {
        backgroundColor: '#e92563',
    },
    label: {
        fontSize: 14,
        fontWeight: 'normal',
        margin: 8,
        color: '#393939'
    },
    tabbar: {
        backgroundColor: '#ffffff',
    },
    imageStyle: {
        flex: 1,
        width: undefined,
        height: undefined,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'

    },
    tab: {
        opacity: 1,
    },
    page: {
        backgroundColor: 'red',
    },
});

// ModuleItemList.propTypes ={
//     itemList : React.PropTypes.array,
//     addItem : React.PropTypes.func,
//     loadTail : React.PropTypes.func
//
// };

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

