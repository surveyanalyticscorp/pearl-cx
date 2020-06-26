import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    LayoutAnimation,
    ListView,
    FlatList,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    TouchableHighlight,
    View
} from 'react-native';

import SubView from '../../global/components/SubView';
import ScrollViewWithRefreshControl from '../../global/ui/ScrollViewWithRefreshControl';

import ContactWidget from '../../global/widgets/ContactWidget';
import SearchBarWidget from '../../global/widgets/SearchBarWidget';
import CustomText from '../../global/ui/CustomText';
import {Actions} from 'react-native-router-flux';
import {utils} from '../../global/Utils';
import I18n from 'react-native-i18n';
import {apiHandler} from '../../global/api/APIHandler';
import {bindActionCreators} from "redux";
import {ActionCreators} from "../actions";
import {connect} from "react-redux";


const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
var Contacts = require('react-native-contacts');

var CustomLayoutAnimation = {
    duration: 200,
    create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    },
    update: {
        type: LayoutAnimation.Types.curveEaseInEaseOut,
    },
};

 class InviteViaEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contactList: [],
            filterContactList: [],
            isSearchEnable: false,
            hasResponse: false
        };
    }

    componentDidMount() {
        this.getContactDetails();
    }

    reloadContent() {
        this.getContactDetails();
    }

    getContactDetails() {
        var _this = this;
        if (Platform.OS != 'ios') {
            this.checkAndroidPermissionAndFetch();
        }
        else {
            this.fetchContacts();
        }


    }
    async checkAndroidPermissionAndFetch(){
        try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS

                );
                if (granted) {
                    console.log("You can use the Contacts");
                    this.fetchContacts();
                } else {
                    console.log("Contacts permission denied")
                }
            } catch (err) {
                console.warn(err)
            }
    }
    fetchContacts() {
        Contacts.getAll((err, contacts) => {
            if (err && err.type === 'permissionDenied') {
                console.log("permissionDenied");
            } else {
                var contactData = [];
                for (var i = 0; i < contacts.length; i++) {
                    if (contacts[i].emailAddresses.length !== 0) {
                        contacts[i].rowID = i,
                            contacts[i].isSelect = false,
                            contactData.push(contacts[i]);
                    }
                }
                this.setState({ contactList: contactData });
            }
        })
    }
    renderNoDataFound() {
        return (
            <View style={{ alignItems: 'center', margin: 10, padding: 10 }}>
                <CustomText style={{ color: 'black', fontSize: 16 }}>{I18n.t('noDataToDisplay',{locale:this.props.language})}</CustomText>
            </View>
        );
    }


    renderContactList() {
        if (this.state.contactList.length > 0) {
            var contactList = [];
            if (this.state.isSearchEnable) {
                contactList = this.state.filterContactList;
            } else {
                contactList = this.state.contactList;
            }
            return (
                <FlatList ref="contactList"
                          keyExtractor={item => item.recordID}
                          data={contactList}
                          removeClippedSubviews = {false}
                          enableEmptySections={true}
                          renderSeparator={this.renderSeparator.bind(this)}
                          renderItem={this.renderRow.bind(this)}/>

            );
        } else {
            return this.renderNoDataFound();
        }
    }

    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            <View key={rowID} style={{ height: 0.5, backgroundColor: '#ECEBF0' }}>
            </View>
        )
    }

    renderRow = (item) => {
        const contactData = item.item
        var _this = this;
        return (
            <ContactWidget key={contactData.recordID}
                contact={contactData}
                onSelect={() => {
                    contactData.isSelect = !contactData.isSelect;
                    var contactDataList = this.state.contactList;
                    this.setState({ contactList: contactDataList, hasResponse: this.checkResponses() });

                }}>
            </ContactWidget>);
    }

    checkResponses() {
        var response = false;
        for (var i = 0; i < this.state.contactList.length; i++) {
            if (this.state.contactList[i].isSelect) {
                response = true;
            }
        }
        return response;
    }

    onFocusSearchBar() {
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        if (this.state.filterContactList.length == 0) {
            this.state.filterContactList = this.state.contactList;
        }
        this.setState({ isSearchEnable: true });
    }

    onBlurSearchBar() {
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        // this.setState({ isSearchEnable: false });
    }

    getInviteButtonImage() {
        if (Platform.OS != 'ios') {
            return require('../../global/images/communities/invite.png');
        }
        let iosImage = { uri: 'invite.png' };
        return iosImage;
    }

    showSearchBar() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.searchBarContainer}>
                    <SearchBarWidget
                        hasResponse={this.state.hasResponse}
                        placeholderText={I18n.t('search_contacts',{locale: this.props.language})}
                        isFocus={this.state.isSearchEnable}
                        onDonePress={() => {
                            this.processPanelMemberInvitation()
                        }}
                        onFocus={() => {
                            this.onFocusSearchBar();
                        }}
                        onBlur={() => {
                            this.onBlurSearchBar();
                        }}
                        onSearchTextChange={(text) => {
                            this.handleSearchAction(text);
                        }}>
                    </SearchBarWidget>
                </View>
                <TouchableHighlight style={[styles.inviteButtonContainer, this.state.hasResponse ? { opacity: 1.0 } : { opacity: 0.2 }]}
                    disabled={this.state.submitDisabled}
                    onPress={() => {
                        this.processPanelMemberInvitation()
                    }}>
                    <Image style={[{ width: Math.round(factor * 0.07), height: Math.round(factor * 0.07) }]} source={this.getInviteButtonImage()} />
                </TouchableHighlight>
            </View>
        );
    }

    processPanelMemberInvitation() {
        var inviteContactList = [];
        for (var i = 0; i < this.state.contactList.length; i++) {
            if (this.state.contactList[i].isSelect) {
                inviteContactList.push(this.state.contactList[i].emailAddresses[0].email);
            }
        }
        if (inviteContactList.length > 0) {
            var responseDict = {};
            responseDict['invitees'] = inviteContactList;
            if (this.props.isConnected && !this.props.isLoading) {
                apiHandler.sendPanelMemberInvitation(this.processPanelMemberInvitationResponse.bind(this), responseDict, (error) => {
                    // this.handleError(error);
                    console.log("Error received");
                });
            }
        }
    }


    processPanelMemberInvitationResponse(response) {
        if (response.body.message) {
            utils.showToastMessage(response.body.message);
        }else {
            Actions.pop({ refresh: { refreshProfile: true } });
        }

        //this.props.onPress();
    }

    handleSearchAction(text) {
        var filterContact = [];
        var response = false;
        for (var i = 0; i < this.state.contactList.length; i++) {
            console.log('name ' + this.state.contactList[i].givenName);
            if (this.state.contactList[i].givenName.toLowerCase().includes(text.toLowerCase())) {
                filterContact.push(this.state.contactList[i]);
            }
            if (this.state.contactList[i].isSelect) {
                response = true;
            }

        }
        if (text.length == 0) {
            this.setState({ filterContactList: this.state.contactList });
        }
        else {
            this.setState({ filterContactList: filterContact, hasResponse: response });
        }
    }

    render() {
        return (
            <SubView title={this.props.title} style={{ flex: 1, flexDirection: 'column', marginTop: 10 }}>
                <View style={{ backgroundColor: 'white', marginBottom: 50 }}>
                    {this.showSearchBar()}
                </View>
                <View style={{}}>
                <ScrollViewWithRefreshControl
                    onRefresh={() => { this.reloadContent() }}>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>

                        <View style={styles.lineViewContainer} />
                        <View>
                            {this.renderContactList()}
                        </View>
                    </View>
                </ScrollViewWithRefreshControl>
                </View>
            </SubView>

        );
    }
}

const styles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: '#FFFF00',
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15,
        flex: 1,
        justifyContent: 'flex-end'
    },
    lineViewContainer: {
        height: 1,
        flex: 1,
        backgroundColor: '#E5E8E9'
    },
    inviteButtonContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginLeft: 6,
        marginRight: 6,
        backgroundColor: '#FFFFFF'
    }
});
function mapDispatchToProps(dispatch)
{
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(InviteViaEmail);
