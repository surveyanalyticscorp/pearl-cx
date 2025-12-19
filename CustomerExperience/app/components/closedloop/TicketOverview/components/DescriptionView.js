import React from 'react';
import {useSelector} from 'react-redux';
import ShowTitleAndText from '../../ui/ShowTitleAndText';
import moment from 'moment';
import {FullMonthDateYearFormat} from '../../../../Utils/AppConstants';
import {View} from 'react-native';
import DescriptionHeader from './DescriptionHeader';
import {ChildContainer} from '../../../../widgets/ParentContainer';
import {translate} from '../../../../Utils/MultilinguaUtils';
import ticketOverviewStyles from '../ticket.overview.style';
import CopyTicketIdButton from './CopyTicketIdButton';
import NPSScoreComponent from './NPSScoreComponent';
import ConditionalResponseButton from './ConditionalResponseButton';

const DetailsView = ({showResponseButton, children}) => {
  const ticket = useSelector(state => state.dashboard.ticket);
  const createdDate =
    ticket !== undefined
      ? moment(ticket.issueDate).format(FullMonthDateYearFormat)
      : '';
  return (
    <View
      testID="description-view"
      style={ticketOverviewStyles.ticketStatusContainer}>
      <View style={ticketOverviewStyles.rowContainer}>
        <DescriptionHeader text={'Details'} />
        <CopyTicketIdButton />
      </View>
      <ChildContainer style={{paddingHorizontal: 0}}>
        <ShowTitleAndText
          title={translate('close_loop.origin_segment')}
          subText={ticket?.originSegment?.name ?? ''}
        />
        <ShowTitleAndText
          title={translate('close_loop.current_segment')}
          subText={ticket?.currentSegment?.name ?? ''}
        />
        <ShowTitleAndText
          title={translate('close_loop.created_on')}
          subText={createdDate}
        />
        <NPSScoreComponent />

        {children}

        <ConditionalResponseButton showResponseButton={showResponseButton} />
      </ChildContainer>
    </View>
  );
};

export default DetailsView;
