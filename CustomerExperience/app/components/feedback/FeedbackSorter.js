import {StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import RadioForm from 'react-native-simple-radio-button';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {translate} from '../../Utils/MultilinguaUtils';
import GestureHandleBar from '../../routes/commonUI/GestureHandleBar';
import PageHeaderText from '../../routes/commonUI/PageHeaderText';
export default function FeedbackSorter(props) {
  let radio_props = [
    {label: translate('responses.date'), value: 0},
    {label: translate('responses.score'), value: 1},
    {label: translate('dashboard.segment'), value: 2},
    {label: translate('responses.email'), value: 3},
  ];
  let index =
    radio_props.findIndex(
      item => item.label === props.route.params.selectedSorter,
    ) || 0;
  return (
    <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.container}>
          <GestureHandleBar />
          <PageHeaderText
            text={translate('responses.sort_by')}
            hasCloseButton
          />
          <RadioForm
            testID="radio-button"
            radio_props={radio_props}
            initial={index}
            onPress={value => {
              props.route.params.setSorter(radio_props[value].label, value);
              props.navigation.goBack();
            }}
            buttonColor={Colors.accent}
            selectedButtonColor={Colors.accent}
            labelStyle={{fontSize: TextSizes.primary, color: Colors.primary}}
            buttonSize={MarginConstants.tab3 / 2}
            buttonOuterSize={MarginConstants.tab3}
            wrapStyle={{marginVertical: MarginConstants.tab1}}></RadioForm>
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
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    margin: MarginConstants.tab2,
    backgroundColor: Colors.white,
  },
});
