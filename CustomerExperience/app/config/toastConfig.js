import * as React from 'react';
import ErrorToast from '../routes/commonUI/toast/ErrorToast';
import SuccessToast from '../routes/commonUI/toast/SuccessToast';
import InfoToast from '../routes/commonUI/toast/InfoToast';

export default {
  custom_error: props => ErrorToast(props),
  custom_success: props => SuccessToast(props),
  custom_info: props => InfoToast(props),
};
