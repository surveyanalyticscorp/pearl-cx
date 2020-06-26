/**
 * Created by tanviGupta on 29/01/20.
 */
import React from 'react';
import {
    StyleSheet,
    View,
    FlatList
} from 'react-native';
import CustomText from "../../global/ui/CustomText";
import OnTouchHighlightWidget from "../../global/widgets/ui/OnTouchHighlightWidget";
import I18n from 'react-native-i18n';
import Icon from "react-native-vector-icons/MaterialIcons";

export default class ReimbrusementSurveyList extends React.Component {
    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.renderNoDataFound = this.renderNoDataFound.bind(this);

    }

    render() {
        return (<View style={styles.container}>
            {this.renderCategoryList()}
        </View>);
    }

    hasEmptyDataSet() {
        return (this.props.categories.length === 0)
    }

    componentDidMount() {
        // if (this.hasEmptyDataSet()) {
        //     this.reloadContent();
        // }
    }

    reloadContent(page = 0) {
        this.props.reload({page: page});
    }

    renderHeader() {
        const {language, categories} = this.props;
        if (categories.length > 0) {
            return (
                <View>
                    <View style={styles.rowContainer}>
                        <CustomText style={styles.label}>
                            {I18n.t('select_category_text', {locale: language})}
                        </CustomText>
                    </View>
                    {this.renderSeparator()}
                </View>
            )
        }
        return <View/>;
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
                          onEndReached={this.onEndReached}
                          onEndReachedThreshold={10}
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

    // Welcome. You do not have access to this page.
    renderNoDataFound() {
        if (!this.props.isLoading) {
            return (
                <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                    <CustomText style={{
                        color: 'black',
                        fontSize: 16
                    }}> {I18n.t('reimbrusementNoData', {locale: this.props.language})}</CustomText>
                </View>
            );
        }
        return <View/>;
    }

    onEndReached() {
        // const {categories, totalCount} = this.props;
        // console.log("End reached.");
        // let currentLength = categories.length;
        // let pageSize = 10;
        // if (currentLength < totalCount) {
        //     this.reloadContent(Math.floor(currentLength / pageSize));
        // }
    }

    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            < View
                key={rowID}
                style={styles.separator}
            />
        )
    }

    renderRow({item}) {
        const {itemLabel, countLabel, selectAction} = this.props;
        return (
            <OnTouchHighlightWidget onPress={() => {
                selectAction({category: item})
            }}>
                <View
                    style={{flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'space-between'}}>
                    <CustomText style={styles.rowText}>{item[`${itemLabel}`]}</CustomText>
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
