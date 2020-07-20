import React from 'react';
import ConfirmDialog from './ConfirmDialog';
import {buttonColors} from '../../styles/color.constants';

export default function CxAlert(props) {
  const getPositiveButton = () => {
    return props.showPositiveButton
      ? {
          title: props.positiveButtonText,
          titleStyle: {
            color: buttonColors.negative,
          },
          onPress: () => {
            props.positiveCallBack && props.positiveCallBack();
          },
        }
      : undefined;
  };

  const getNegativeButton = () => {
    return props.showNegativeButton
      ? {
          title: props.negativeButtonText,
          onPress: () => {
            props.negativeCallBack && props.negativeCallBack();
          },
          titleStyle: {
            color: props.positiveButtonColor,
          },
        }
      : undefined;
  };

  const renderAlert = () => {
    return (
      <ConfirmDialog
        {...props}
        title={props.title}
        message={props.message}
        visible={props.visible}
        positiveButton={getPositiveButton()}
        negativeButton={getNegativeButton()}
        flexDirection={props.flexDirection}
      />
    );
  };
  return renderAlert();
}
