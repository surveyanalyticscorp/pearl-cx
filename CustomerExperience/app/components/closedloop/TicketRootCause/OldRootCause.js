import React, {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';

import {updateRootCause} from '../../../redux/actions/closedloop.actions';
import {translate} from '../../../Utils/MultilinguaUtils';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import StringUtils from '../../../Utils/StringUtils';
import RenderRootCauseItem from '../RenderRootCauseItem';
import RenderSegmentItem from '../RenderSegmentItem';
// to find all the
export const hasId = (id, arr = []) => {
  for (let i = 0; i < arr.length; i++) {
    if (id === arr[i].id) {
      return true;
    }
  }
  return false;
};
export const OldRootCause = props => {
  const ROOT_CAUSES = translate('root_cause.root_cause');
  const ACTIONS = translate('root_cause.actions');
  const ORIGIN_SEGMENTS = translate('close_loop.origin_segment');
  const CURRENT_SEGMENTS = translate('close_loop.current_segment');

  const dispatch = useDispatch();
  const {feedbackApiKey} = useSelector(state => state.global.userInfo);
  const {authToken} = useSelector(state => state.global);
  const {ticket, rootCauseList, rootCauseActionList} = useSelector(
    state => state.dashboard,
  );

  console.log('ROOT_CAUSES', JSON.stringify(rootCauseList));
  console.log('ROOT_CAUSES_ACTIONS', JSON.stringify(rootCauseActionList));

  const getRootCauses = () => {
    return rootCauseList.length > 0
      ? rootCauseList.map((value, index) => ({
          ...value,
          isChecked: hasId(value.id, ticket.rootCauses),
        }))
      : [];
  };

  const getRootActions = () => {
    return rootCauseActionList.length > 0
      ? rootCauseActionList.map((value, index) => ({
          ...value,
          title: value.actionName,
          isChecked: hasId(value.id, ticket.rootCauseActions),
        }))
      : [];
  };
  const [rootCauses, setRootCauses] = useState(getRootCauses());
  const [rootCauseActions, setRootActions] = useState(getRootActions());
  const [originSegmentId, setOriginSegmentId] = useState(
    ticket.originSegment.id,
  );
  const [currentSegmentId, setcurrentSegmentId] = useState(
    ticket.currentSegment.id,
  );

  console.log('ROOT_CAUSES', JSON.stringify(rootCauseList));
  console.log('ROOT_CAUSES_ACTIONS', JSON.stringify(rootCauseActionList));
  console.log('TICKET', JSON.stringify(ticket));

  const updateRootCauses = (item, index) => {
    setRootCauses(prevState => {
      const temp = [...prevState];
      temp[index].isChecked = !prevState[index].isChecked;
      return temp;
    });
  };

  const updateRootActions = (item, index) => {
    setRootActions(prevState => {
      const temp = [...prevState];
      temp[index].isChecked = !prevState[index].isChecked;
      return temp;
    });
  };

  const onClickCheckBox = (title, item, index) => {
    if (title === ROOT_CAUSES) {
      updateRootCauses(item, index);
    } else {
      updateRootActions(item, index);
    }
  };

  const onClickRadioButton = (title, item, index) => {
    // update segment
    title === ORIGIN_SEGMENTS
      ? setOriginSegmentId(item.id)
      : setcurrentSegmentId(item.id);
  };

  const resetSelections = () => {
    setRootActions(getRootActions);
    setRootCauses(getRootCauses);
    setOriginSegmentId(ticket.originSegment.id);
    setcurrentSegmentId(ticket.currentSegment.id);
  };

  const updateRootCauseAndAction = () => {
    const rootCauseArr = [];
    for (let item of rootCauses) {
      if (item.isChecked) {
        rootCauseArr.push(item.id);
      }
    }

    const rootActionArr = [];
    for (let item of rootCauseActions) {
      if (item.isChecked) {
        rootActionArr.push(item.id);
      }
    }

    dispatch(
      updateRootCause(
        authToken,
        JSON.stringify(ticket.id),
        {
          rootCauses: rootCauseArr,
          rootCauseActions: rootActionArr,
          currentSegmentId: currentSegmentId,
          originSegmentId: originSegmentId,
        },
        feedbackApiKey,
      ),
    );
  };

  return (
    <View testID="root-cause-view" style={styles.rootContainer}>
      <ScrollView style={styles.container}>
        <RenderRootCauseItem
          title={ROOT_CAUSES}
          data={rootCauses}
          onClickCheckBox={onClickCheckBox}
        />
        <RenderRootCauseItem
          title={ACTIONS}
          data={rootCauseActions}
          onClickCheckBox={onClickCheckBox}
        />
      </ScrollView>

      <View style={styles.buttonView}>
        <QPButton
          testID="RootCasueResetButton"
          style={{
            ...buttonStyles.textButton,
            marginHorizontal: MarginConstants.tab4,
          }}
          onPress={resetSelections}
          buttonText={StringUtils.uppercaseFirstCharRestLowercase(
            translate('root_cause.reset'),
          )}
          textStyle={buttonStyles.textButtonTextPrimary}
        />

        <QPButton
          testID="RootCauseUpdateButton"
          style={buttonStyles.primaryButton}
          onPress={updateRootCauseAndAction}
          buttonText={translate('close_loop.update')}
          textStyle={buttonStyles.primaryButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',

    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
  },

  container: {
    margin: MarginConstants.tab1,
    flex: 1,

    // borderColor: Colors.evenDarkerGrey,
    // borderWidth: 1,
    // borderRadius: 4,
  },

  ticketStatusContainer: {
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: PaddingConstants.tab1,
  },
  columnContainer: {
    alignItems: 'flex-start',
    padding: PaddingConstants.tab1,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PaddingConstants.tab1,
  },

  headerText: {
    fontFamily: FontFamily.light,

    fontSize: TextSizes.largeText,
    color: Colors.filterIconColor,
  },

  titleText: {
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight._700,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },

  optionText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },

  departmentNameText: {
    backgroundColor: Colors.settingsBackground,
    padding: PaddingConstants.halfTab,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  dateText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: 16,
    color: Colors.primary,
  },

  detailsText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },

  underLineText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.primary,
    color: Colors.accentLight,
    textDecorationLine: 'underline',
  },

  idText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._900,
    fontSize: 16,
    color: Colors.accentLight,
  },
  buttonText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._900,
    fontSize: TextSizes.secondary,
  },
  resetButton: {color: Colors.accentLight},
  updatetButton: {color: Colors.white},
  statusText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._900,
    fontSize: 16,
    color: Colors.lightBlack,
  },
  takeActionContainer: {
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  takeActionButton: {
    height: MarginConstants.tab4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
    marginBottom: MarginConstants.tab2,
  },

  takeActionText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  rowText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
  },

  buttonView: {
    margin: MarginConstants.tab2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.tab2,
    paddingVertical: PaddingConstants.tab1,
    borderRadius: 5,
  },
  modelDropdown: {
    minHeight: MarginConstants.tab3,

    marginHorizontal: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.halfTab,
    borderColor: Colors.evenDarkerGrey,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
  },
  dropdownText: {
    flex: 1,
    color: Colors.secondary,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.halfTab,
    fontSize: Platform.isPad
      ? TextSizes.primary
      : Platform.OS === 'android'
      ? TextSizes.primary
      : TextSizes.secondary,
    textAlign: 'left',
    paddingLeft: MarginConstants.halfTab,
    paddingRight: MarginConstants.tab3,
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderColor: Colors.darkerGrey,
  },
  dropdownRow: {
    flexDirection: 'row',
    minHeight: MarginConstants.tab4,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
    backgroundColor: Colors.accent,
  },

  panelHeaderContainer: {
    flex: 1,

    padding: MarginConstants.tab2,
    backgroundColor: Colors.white,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
  },
  panelHandleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: MarginConstants.tab2,
  },
  panelHandle: {
    height: 4,
    width: 80,
    backgroundColor: Colors.filterIconColor,
  },
  header: {
    marginHorizontal: MarginConstants.tab2,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
  dropdownContainer: {
    flex: 2,
    flexDirection: 'row',

    height: '100%',
    backgroundColor: Colors.white,
    borderColor: Colors.evenDarkerGrey,

    borderWidth: 1,
    borderRadius: 3,
  },

  dropdownInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    paddingHorizontal: PaddingConstants.halfTab,
  },

  // dropdownIconTextContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   height: '100%',
  // },

  dropdownContainerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
});
