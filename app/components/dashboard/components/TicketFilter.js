import {
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import React from 'react';
import RadioForm from 'react-native-simple-radio-button';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {translate} from "../../../Utils/MultilinguaUtils";

export default function TicketFilter(props) {
    let radio_props = [
        {label: translate("close_loop.all"), value: -1 },
        {label: translate("close_loop.critical"), value: 3 },
        {label: translate("close_loop.high"), value: 2 },
        {label: translate("close_loop.medium"), value: 1 },
        {label: translate("close_loop.low"), value: 0 },
    ];
    let index = radio_props.findIndex(item => item.value === props.route.params.selectedFilter) || 0;
    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={'handled'}
            >
                <View style={styles.container}>
                    <RadioForm
                        radio_props={radio_props}
                        initial={index}
                        onPress={(value) => {
                            props.route.params.setFilter(value);
                            props.navigation.goBack();
                        }}
                        buttonColor={Colors.accent}
                        selectedButtonColor={Colors.accent}
                        labelStyle={{fontSize: TextSizes.primary, color: Colors.primary}}
                        buttonSize={MarginConstants.tab3/2}
                        buttonOuterSize={MarginConstants.tab3}
                        wrapStyle={{marginVertical: MarginConstants.tab1}}
                    >
                    </RadioForm>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContainer: {
        flex:1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        margin: MarginConstants.tab2,
        backgroundColor: Colors.white,
    }
});
