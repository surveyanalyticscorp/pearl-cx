import React from 'react';
import PersonEmailAvatarSvg from '../../../../assets/images/person_email_avatar.svg';
import PersonEditSvg from '../../../../assets/images/person_edit.svg';

const TopRowIcon = ({hasPanelMember}) =>
  hasPanelMember ? (
    <PersonEmailAvatarSvg width={16} height={16} />
  ) : (
    <PersonEditSvg width={16} height={16} />
  );

export default TopRowIcon;
