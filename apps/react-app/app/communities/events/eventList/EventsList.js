/**
 * Created by TanviGupta on 12/02/20.
 */
import React from 'react';
import moment from 'moment';
import {
    StyleSheet,
    View,
    FlatList,
    Image, Dimensions
} from 'react-native';
import CustomText from "../../../global/ui/CustomText";
import OnTouchHighlightWidget from "../../../global/widgets/ui/OnTouchHighlightWidget";
import I18n from 'react-native-i18n';
import Icon from "react-native-vector-icons/MaterialIcons";
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;

export default class EventsList extends React.Component {
    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.renderNoDataFound = this.renderNoDataFound.bind(this);
    }

    checkImageURLValid(imageURL) {
        if (imageURL.trim() == "") {
            return false
        }
        let lastStr = imageURL.substring(imageURL.lastIndexOf('.') + 1)
        if (lastStr === 'png' || lastStr === 'jpg' || lastStr === "jpeg") {
            return true
        }
        return false ;
    }

    getImageURL(imageURL) {
        let isValidURL = this.checkImageURLValid(imageURL)
       if (!isValidURL){ //check if its not empty
               return require('../../../../assets/app/global/images/noEventsImage.png');
       } else {
           return { uri: imageURL };
       }
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
        const {data} = this.props;
        if (data) {
            return (
                <FlatList ref={ref => this.listView = ref}
                          style={{backgroundColor: 'transparent'}}
                          renderItem={this.renderRow}
                          removeClippedSubviews={false}
                          enableEmptySections={true}
                          data={data}
                          keyExtractor={item => item.ID + ""}
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

    renderRow({item}) {
        const {selectAction} = this.props;
        let defaultDateFormat = 'YYYY-MM-DD HH:mm:ss'
        const startTime = item.startTime //2019-07-19 03:57:16
        let startDateMoment = moment(startTime, defaultDateFormat).format("MMM DD, YYYY")
        let endTime = item.endTime
        let endDateMoment = moment(endTime, defaultDateFormat).format("MMM DD, YYYY")
        let dateMoment = startDateMoment + " - " + endDateMoment
        return (
            <OnTouchHighlightWidget onPress={() => {
                selectAction({event: item})
            }}>
                <View style={{flexDirection: 'row',
                    flexGrow: 1, paddingHorizontal: 10,
                    paddingVertical: 10, alignItems: 'center', width: '100%',
                    justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', width: '95%'}}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} resizeMode={'contain'}
                                   source={this.getImageURL(item.imageURL)}/>
                        </View>
                        <View style={{ flexShrink: 1,padding: 5}}>
                            <CustomText style={styles.rowText} numberOfLines={1}  ellipsizeMode="tail">{item.name}</CustomText>
                            <CustomText style={styles.descriptionText} numberOfLines={2} ellipsizeMode="tail">{item.description}</CustomText>
                            <CustomText style={styles.dateText}>{dateMoment}</CustomText>
                        </View>
                    </View>
                    <View  style={{ width: '5%'}}>
                    <Icon name="keyboard-arrow-right" color={"#d8d8d8"} size={30}/>
                    </View>
                </View>
            </OnTouchHighlightWidget>
        );
    }

}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5
    },
    container: {
        flex: 1,
    },
    image: {
        height: Math.round(factor * 0.08),
        borderRadius: Math.round(factor * 0.08) / 2,
        width: Math.round(factor * 0.08)
    },
    descriptionText: {
        flexShrink: 1,
        fontSize: global.h3FontSize,
        fontFamily: global.primaryText,
        color: global.secondaryFontColorForCommunities
    },
    rowText: {
        paddingBottom: 5,
        flexShrink: 1,
        fontSize: global.h2by2FontSize,
        fontFamily: global.boldText,
        color: global.secondaryFontColorForCommunities
    },
    dateText: {
        marginTop: 5,
        fontSize: global.h3FontSize,
        fontFamily: global.semiBoldText,
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
