/**
 * Created by TanviGupta on 05/02/20.
 */
import React from 'react';
import moment from 'moment';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import CustomText from "../../../global/ui/CustomText";
import OnTouchHighlightWidget from "../../../global/widgets/ui/OnTouchHighlightWidget";
import I18n from 'react-native-i18n';
import Icon from "react-native-vector-icons/MaterialIcons";
import {Colors} from "react-native-pathjs-charts/src/util";

export default class DocumentCategoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameSortEnable: false,
            dateSortEnable: false,
            nameSortType: this.props.sortState.nameSort,
            dateSortType: this.props.sortState.dateSort
        }
        this.renderRow = this.renderRow.bind(this);
        this.renderNoDataFound = this.renderNoDataFound.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
    }

    componentDidMount() {

    }

    getNameAccordingToTheType(type) {
        if (type === 'none') {
            return 'increasingOrder';
        } else if (type === 'increasingOrder') {
            return 'decreasingOrder';
        } else if (type === 'decreasingOrder') {
            return 'none';
        }
        return 'none';
    }

    getColorAccordingToTheType(type) {
        if (type === 'none') {
            return '#d8d8d8';
        } else if (type === 'increasingOrder') {
            return '#00BB47';
        } else if (type === 'decreasingOrder') {
            return '#CF2203';
        }
        return '#d8d8d8';
    }

    render() {
        return (<View style={styles.container}>
            {this.renderCategoryList()}
        </View>);
    }

    reloadContent(page = 0) {
        this.props.reload({page: page});
    }

    renderCategoryList() {
        const {categories} = this.props;
        if (categories) {
            return (
                <FlatList ref={ref => this.listView = ref}
                          style={{backgroundColor: 'transparent'}}
                          renderItem={this.renderRow}
                          removeClippedSubviews={false}
                          enableEmptySections={true}
                          ListHeaderComponent={this.renderHeader}
                          ListHeaderComponentStyle={{backgroundColor: Colors.white}}
                          data={categories}
                          keyExtractor={item => item.id + item.invitationID + ""}
                          ItemSeparatorComponent={this.renderSeparator}
                          refreshing={false}
                          onRefresh={() => {
                              this.reloadContent()
                          }}
                          ListEmptyComponent={this.renderNoDataFound}
                />
            )
        }
        return (<View/>);

    }

    renderNoDataFound() {
        if (!this.props.isLoading) {
            return (
                <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                    <CustomText style={{
                        color: 'black',
                        fontSize: 16
                    }}> {I18n.t('noDataToDisplay', {locale: this.props.language})}</CustomText>
                </View>
            );
        }
        return <View/>;
    }

    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            < View
                key={rowID}
                style={styles.separator}
            />
        )
    }

    renderHeader() {
        const {nameSortingEnabled, dateSortingEnabled,categories} = this.props;
        const nameSortColor = this.getColorAccordingToTheType(this.state.nameSortType);
        const dateSortColor = this.getColorAccordingToTheType(this.state.dateSortType);
        if (categories.length > 0) {
            return (
                <View style={{flexDirection: 'column', flex: 1}}>
                    <View
                        style={{flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', height: 50}}>
                        <View style={{width: "40%"}}>
                            <TouchableWithoutFeedback onPress={() => {
                                nameSortingEnabled && nameSortingEnabled(this.getNameAccordingToTheType(this.state.nameSortType))
                                dateSortingEnabled && dateSortingEnabled("none")
                                this.setState({nameSortType: this.getNameAccordingToTheType(this.state.nameSortType), dateSortType: 'none'})
                            }}>
                                <View style={{flexDirection: 'row', alignItems: 'center', width: "100%"}}>
                                    <CustomText style={styles.nameText} numberOfLines={4}>{"Name"}</CustomText>
                                    <Icon name="filter-list" color={nameSortColor} size={30}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{paddingLeft: 20, width: "40%"}}>
                            <TouchableWithoutFeedback onPress={() => {
                                nameSortingEnabled && nameSortingEnabled("none")
                                dateSortingEnabled && dateSortingEnabled(this.getNameAccordingToTheType(this.state.dateSortType))
                                this.setState({dateSortType: this.getNameAccordingToTheType(this.state.dateSortType), nameSortType: 'none'})
                            }}>
                                <View style={{flexDirection: 'row', alignItems: 'center', width: "100%"}}>
                                    <CustomText style={styles.nameText} numberOfLines={4}>{"Date"}</CustomText>
                                    <Icon name="filter-list" color={dateSortColor} size={30}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={{backgroundColor: "#d8d8d8", height: 0.5}}/>
                </View>
            );
        } else {
            return (<View/>)
        }
    }

    renderRow({item}) {
        const {itemLabel, createTimeLabel, favourite, selectAction, favouriteSelected} = this.props;
        const favouriteNo = item[`${favourite}`]
        const favColor = favouriteNo === 0 ? "#d8d8d8" : "#0072CA";
        let defaultDateFormat = 'YYYY-MM-DD HH:mm:ss'
        const createTime = item[`${createTimeLabel}`] //2019-07-19 03:57:16
        let dateMoment = moment(createTime, defaultDateFormat).format("MMM DD, YYYY")
        return (
            <OnTouchHighlightWidget onPress={() => {
                selectAction({category: item})
            }}>
                <View
                    style={{flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'space-between'}}>
                    <CustomText style={styles.rowText} numberOfLines={4}>{item[`${itemLabel}`]}</CustomText>
                    <CustomText style={styles.dateText}>{dateMoment}</CustomText>
                    <TouchableWithoutFeedback onPress={() => {
                        favouriteSelected && favouriteSelected({category: item})
                    }}>
                        <Icon name="star" color={favColor} size={30}/>
                    </TouchableWithoutFeedback>
                    <Icon name="keyboard-arrow-right" color={"#d8d8d8"} size={30}/>
                </View>
            </OnTouchHighlightWidget>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    rowText: {
        width: "40%",
        fontSize: global.h3FontSize,
        fontFamily: global.semiBoldText,
        color: global.secondaryFontColorForCommunities
    },
    dateText: {
        fontSize: global.h3FontSize,
        fontFamily: global.primaryText,
        color: global.secondaryFontColorForCommunities
    },
    nameText: {
        fontSize: global.h3FontSize,
        fontFamily: global.semiBoldText,
        color: global.secondaryFontColorForCommunities
    },
    label: {
        fontFamily: global.semiBoldText,
        fontSize: global.h4FontSize,
        textAlign: 'left',
        color: global.tertiaryFontColorForCommunities
    },
    button: {
        backgroundColor: '#47A0DC',
        paddingHorizontal: 20,
        marginVertical: 2,
        paddingVertical: 3
    },
    buttonText: {
        fontSize: global.h4FontSize,
        color: 'white',
        fontFamily: global.semiBoldText
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    separator: {
        height: 0.5,
        backgroundColor: '#ECEBF0'
    }
});
