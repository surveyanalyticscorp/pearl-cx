import React from 'react';
import {Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {toggleCsatView} from '../../redux/actions/dashboard.actions';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import TextLabel from '../TextLabel/TextLabel';
import CaretDownIcon from '../IconWidget/CaretDownIcon';

const CsatToggleButton = () => {
  const dispatch = useDispatch();
  const {isCsatViewTopBox} = useSelector(state => state.dashboard);
  const label = isCsatViewTopBox ? 'Mean CSAT' : 'Top Box';
  const toggleView = () => {
    dispatch(toggleCsatView(!isCsatViewTopBox));
  };

  return (
    <Pressable style={dashboardStyles.csatToggleButton} onPress={toggleView}>
      <TextLabel text={label} />
      <CaretDownIcon />
    </Pressable>
  );
};

export default CsatToggleButton;
