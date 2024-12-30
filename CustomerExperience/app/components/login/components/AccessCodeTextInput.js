import React from 'react';
import QPTextField from '../../../widgets/TextField';
import {useDispatch, useSelector} from 'react-redux';
import {setLoginAccessCode} from '../../../redux/actions/login.action';
import {translate} from '../../../Utils/MultilinguaUtils';
import {loginStyles} from '../login.styles';
const AccessCodeTextInput = ({defaultValue}) => {
  // const accessCode = useSelector(state => state.login.accessCode);
  const dispatch = useDispatch();

  const handleAccessCode = text => {
    dispatch(setLoginAccessCode(text));
  };

  return (
    <QPTextField
      testID="companyCodeTextField"
      defaultValue={defaultValue ?? ''}
      label={translate('onBoarding.companyCode')}
      style={loginStyles.emailInput}
      // onEndEdit={handleAccessCode}
      onChange={handleAccessCode}
      returnKey={'done'}
    />
  );
};

export default AccessCodeTextInput;
