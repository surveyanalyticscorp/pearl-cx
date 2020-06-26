import React, {Component} from 'react';

import {
    View,
    Text,
    ListView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Platform,
    Dimensions
} from 'react-native';

import * as _ from 'lodash';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {
    DotIndicator
} from 'react-native-indicators';
import styles from './EveryoneStyle';
import EmployeeCell from '../EmployeeView';
import SearchBar from '../../searchbar/Searchbar';
import CommentView from '../../praise/PraiseNew/PraiseComment';
import {selectedBadgeUser} from '../../../actions/PraiseActions';
import {ActionBarModule} from '../../../../global/native-modules/NativeModules';
import {getReviewEmployeeList, setEmployeeInfo, submitReviewRequest} from '../../../actions/ReviewActions';

const displayPerPage = 15;

class Everyone extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            text: '',
            loadMoreItems: false,
            modalVisible: false,
            selectedEmployee: null,
            selectedRow: null,
            input: '',
            errorVisible: false,
            requestSubmitting: false,
            requestSubmitted: false,
            selectedEmployeesForReview: []
        };
        this.total = 0;
        this.limit = displayPerPage;
    }

    componentWillMount() {
        this.props
            .getReviewEmployeeList({origin:this.props.origin})
            .then(() => {
                console.log('Review employee list loaded');
            })
            .catch(e => console.log(e.toString()));
    }

    componentWillUnmount() {
        // if (this.props.origin === 'REVIEW') {
        //   ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: this.props.changingTab ? 'Performance Review' : 'Welcome to Pulse Review' }));
        //   ActionBarModule.toggleBackButton(this.props.changingTab ? true : false);
        // }
    }

    componentWillReceiveProps(props) {
        this.setState({selectedRow: null});
    }

    _handleSearch = input => {
        this.setState({text: input});
    };

    _internalSearch = (items, input) => {
        if (input === '') {
            return items;
        }

        return items.filter(item => {
            return this._alphaSearch(item.first_name, input);
        });
    };

    _alphaSearch = (collection, input) => {
        let type = typeof collection;

        if (type === 'string') {
            return _.startsWith(collection.toString().toLowerCase(), input.toString().toLowerCase());
        }

        return _.some(collection, item => this._alphaSearch(item, input));
    };

    onPressEmployeeForReview(rowID, selectedEmployee) {
        if (this.props.origin === 'REVIEW') {
            this.handleSelectEmployeeForReview(rowID,selectedEmployee);
        } else if(this.props.origin === 'REQUEST_REVIEW') {
            this.handleSelectEmployeeToRequestReview(rowID, selectedEmployee)
        }
    }

    handleSelectEmployeeForReview(rowID, selectedEmployee) {
        this.props.setEmployeeInfo(selectedEmployee);
        this.setState({selectedRow: rowID}, () => {
            setTimeout(() => {
                Actions.refresh({type: 'push'});
                Actions.competencySelection({navFunc: this.navigateBack});
                ActionBarModule.toggleBackButton(true);
            }, 300);
        });
    }

    handleSelectEmployeeToRequestReview(rowID, selectedEmployee) {
        let items = this.state.selectedEmployeesForReview;
        if (this.state.selectedEmployeesForReview.includes(selectedEmployee.id)) {
            const filteredItems = items.filter(item => item !== selectedEmployee.id)
            this.setState({selectedEmployeesForReview : filteredItems })
        } else {
        this.setState({ selectedEmployeesForReview: [...this.state.selectedEmployeesForReview, selectedEmployee.id]});
        }

    }

    navigateBack = () => {
        this.setState({selectedRow: null});
    };

    onPressEmployeeForPraise(rowID, selectedEmployee) {
        this.setState({modalVisible: true, selectedEmployee, selectedRow: rowID});
    }

    hideCommentView = (visible) => {
        const employeeInfo = Object.assign(this.state.selectedEmployee, {
            comment: this.state.input
        });

        this.setState({
            modalVisible: visible,
            errorVisible: false
        });
        setTimeout(() => {
            this.setState(
                {
                    selectedRow: null
                },
                () =>
                    setTimeout(() => {
                        Actions.pop();
                        ActionBarModule.toggleBackButton(true);
                        ActionBarModule.updateTitleAndMenu(JSON.stringify({title: this.props.praiseNewBadge.selectedBadge.name}));
                        // @sujan Changes to mutate array
                        let {praises, userBadges, praiseNewBadge} = this.props;
                        this.props.selectedBadge(
                            praises,
                            userBadges,
                            employeeInfo,
                            praiseNewBadge
                        );
                    }, 500)
            );
        }, 400);
    };

    textChanged = text => {
        if (text.length <= 255) {
            this.setState({input: text, errorVisible: false});
        } else {
            this.setState({input: text, errorVisible: true});
        }
    };

    searchText(items, input) {
        if (_.isEmpty(input)) {
            return items;
        }

        return this._internalSearch(items, input);
    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
        return (
            <EmployeeCell
                select={() => {
                    this.props.origin === 'PRAISE'
                        ? this.onPressEmployeeForPraise(rowID, rowData)
                        : this.onPressEmployeeForReview(rowID, rowData);
                }}
                item={rowData}
                origin={this.props.origin}
                selected={this._isSelected(rowID,rowData)}
            />
        );
    }

    _isSelected(rowID, rowData) {

        if (this.props.origin === 'REQUEST_REVIEW') {
            return this.state.selectedEmployeesForReview.includes(rowData.id);
        } else {
            return this.state.selectedRow === rowID;
        }

    }

    loading() {
        return <DotIndicator style={styles.loading} color="rgb(37, 137, 228)" count={3} size={10}/>
    }

    showError(msg) {
        return (
            <View style={styles.error}>
                <Text style={styles.errorTxt}>{msg}</Text>
            </View>
        );
    }

    noresult() {
        return (
            <View style={styles.info}>
                <Text>No Employee(s)</Text>
            </View>
        );
    }

    getLimit(total) {
        let limit;
        limit = this.limit + displayPerPage;
        limit = limit > total ? total : limit;
        return limit;
    }

    getPagination(items, offset, limit) {
        this.total = items.length;
        return limit > items.length ? items : items.slice(offset, limit);
    }

    _onEndReached() {
        const limit = this.getLimit(this.total);

        if (limit < this.total) {
            setTimeout(() => {
                this.setState({loadMoreItems: true});
                this.limit = limit;
            }, 2000);
        }

        if (limit === this.total) {
            this.setState({limit, loadMoreItems: false});
        }
    }

    _renderFooter() {
        if (!this.state.loadMoreItems) return <View/>;

        return <DotIndicator style={styles.loading} color="rgb(37, 137, 228)" count={3} size={10}/>

    }

    _getImageUri(src) {
        if (Platform.OS === 'android') {
            return { uri: `asset:/${src}` };
        }

        return { uri: src };
    }


    render() {
        const {isLoading, error, reviewEmployeeList} = this.props;
        let items = reviewEmployeeList;

        if (this.state.requestSubmitting) {
            return (
                <View style={{flex: 1}}>
                    <View style={styles.overlay}>
                        <Text style={styles.overlayTxt}>Please wait. Submitting..</Text>
                    </View>
                </View>
            )
        }

        if (this.state.requestSubmitted) {
            return (<View style={{flex: 1}}>
                <View style={{
                    flex: 0,
                    height: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#D8D8D8'
                }}>
                    <Image source={this._getImageUri('check_greenBg.png')} style={{width: 22, height: 22}}/>
                    <Text style={{color: '#545E6B'}}>Review Request Submitted!</Text>
                </View>
            </View>);
        }

        if (isLoading) {
          return this.loading();
        }

        if (error && !items.length) {
            return this.showError(error);
        }

        if (!items.length) {
            return this.noresult();
        }

        if (items.length > 0) {
            items = this.searchText(reviewEmployeeList.slice(0), this.state.text);
        }

        if (items.length > 0) {
            items = this.getPagination(items.slice(0), 0, this.limit);
        }

        return (
            <View style={{flex: 1}}>
                <SearchBar
                    ref={ref => (this.searchBar = ref)}
                    showOnLoad
                    data={items}
                    placeholderTextColor="#545E6B"
                    handleSearch={this._handleSearch}
                    placeholder="Search or select from the list below."
                />
                {items.length > 0 && (
                    <ListView
                        onEndReachedThreshold={100}
                        renderRow={this._renderRow.bind(this)}
                        dataSource={this.ds.cloneWithRows(items)}
                        onEndReached={this._onEndReached.bind(this)}
                        renderFooter={this._renderFooter.bind(this)}
                        removeClippedSubviews={false}
                    />
                )}
                {this.state.modalVisible && (
                    <CommentView
                        doneAction={this.hideCommentView}
                        input={this.state.input}
                        inputChanged={this.textChanged}
                        showError={this.state.errorVisible}
                    />
                )}


                {!items.length && this.noresult()}

                {this.props.origin === 'REQUEST_REVIEW' && (
                <TouchableOpacity style={{
                    position:'absolute',
                    bottom:10,
                    left: 10,
                    right: 10,
                    height: 36,
                    borderWidth: 1,
                    alignItems: 'center',
                    borderColor: '#1B87E6',
                    justifyContent: 'center',
                    backgroundColor: '#1B87E6',
                    zIndex: 10}} onPress={() => this._submitReviewRequest()}>
                    <Text style={{color:'white'}}>
                        {'Request Review'}
                    </Text>
                </TouchableOpacity>)}
            </View>
        );
    }

    _submitReviewRequest() {

        if (this.state.requestSubmitting) return;
        this.setState({ requestSubmitting: true });

        let data = {
            employees: this.state.selectedEmployeesForReview
        };
        this.props.submitReviewRequest(data);
        setTimeout(
            () =>
                this.setState(
                    { requestSubmitting: false, requestSubmitted: true},
                    () => {
                        setTimeout(() => {
                            Actions.refresh({selectedSegment: 2 });
                            ActionBarModule.toggleBackButton(false);ActionBarModule.updateTitleAndMenu(
                                JSON.stringify({ title: 'Performance Review' })
                            );

                        }, 2000);
                    }
                ),
            2000
        );


    }
}

function setProps(store) {
    return {
        isLoading: store.isLoading,
        reviewMyReviews: store.reviewMyReviews,
        error: store.error.message,
        isConnected: store.isConnected,
        reviewEmployeeList: store.reviewEmployeeList,
        praiseNewBadge: store.praiseNewBadge,
        praises: store.praises,
        userBadges: store.userBadges
    };
}

const mapDisptachToProps = dispatch => ({
    getReviewEmployeeList: () => dispatch(getReviewEmployeeList()),
    setEmployeeInfo: selectedEmployee => dispatch(setEmployeeInfo(selectedEmployee)),
    selectedBadge: (praises, userBadges, selectedEmployee, selectedBadge) =>
        dispatch(selectedBadgeUser(praises, userBadges, selectedEmployee, selectedBadge)),
    setReviewEmployees: filteredList => dispatch({type: 'REVIEW_EMPLOYEE', payload: filteredList}),
    submitReviewRequest: reqInfo => dispatch(submitReviewRequest(reqInfo))

});

export default connect(setProps, mapDisptachToProps)(Everyone);
