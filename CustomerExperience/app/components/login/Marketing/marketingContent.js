import React from 'react';
import {translate} from '../../../Utils/MultilinguaUtils';
import MarketingAsset1 from '../../../../assets/images/marketing_01.svg';
import MarketingAsset2 from '../../../../assets/images/marketing_02.svg';
import MarketingAsset3 from '../../../../assets/images/marketing_03.svg';
import MarketingAsset4 from '../../../../assets/images/marketing_04.svg';

export const getMarketingScreenContent = () => [
  {
    image: <MarketingAsset1 />,
    introTitle: translate('onBoarding.marketing_title_1'),
    description: translate('onBoarding.marketing_desc_1'),
  },
  {
    image: <MarketingAsset2 />,
    introTitle: translate('onBoarding.marketing_title_2'),
    description: translate('onBoarding.marketing_desc_2'),
  },
  {
    image: <MarketingAsset3 />,
    introTitle: translate('onBoarding.marketing_title_3'),
    description: translate('onBoarding.marketing_desc_3'),
  },
  {
    image: <MarketingAsset4 />,
    introTitle: translate('onBoarding.marketing_title_4'),
    description: translate('onBoarding.marketing_desc_4'),
  },
];
