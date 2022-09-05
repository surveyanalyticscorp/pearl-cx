const Colors = {
  textTintColor: '#D5D8DE',
  primary: '#707070',
  secondary: '#909090',
  red: '#990000',
  lightRed: '#FC1154',
  white: '#ffffff',
  black: '#000000',
  accentLight: '#1b87e6',

  accent: '#1B3380',

  filterIconColor: '#545E6B',
  accentGradient: 'rgba(239, 246, 252, 1)',
  gradientColor: '#8AC0EA',
  grey: '#f9f9f9',
  lightBlack: '#404A5B',
  evenDarkerGrey: '#9B9B9B',
  darkerGrey: '#eeeeee',
  darkGrey: '#d8d8d8',
  overlay: '#edf6fd',
  borderColor: '#A2A6A9',
  dotColor: 'rgba(100,100,100,0.5)',
  dotSelectedColor: '#010B06',
  placeholderColor: 'rgba(45,76,128,0.8)',
  imageOverlay: '#d3d3d3',
  crossColor: 'rgba(10,35,54,0.8)',
  transparent: 'rgba(255, 255, 255, 0.5)',
  fullTransparent: 'rgba(255, 255, 255, 0)',
  modalBackgroundForSurveyList: '#2c2b2c',
  toggleButtonColor: '#6DBEB7',
  settingsBackground: '#F5F5F5',
  settingDividerColor: '#E4E4E4',
  success: '#3FCA5A',
  error: '#E53251',
  selectionColor: 'rgba(138, 192, 234,0.15)',
  faceLandmarksBorderColor: '#a6ffb4',
  smileyOneColor: '#f21c1c',
  smileyTwoColor: '#ea5614',
  smileyThreeColor: '#ffb80d',
  smileyFourColor: '#7cca53',
  smileyFiveColor: '#4cb714',
  selectionGreyColor: '#F7F8F9',

  promoter: '#3FCA5A',
  promoter2: '#1BA758',
  detractor: '#CE002A',
  detractor2: '#FF7681',
  passive: '#FFE300',
  passive2: '#FFCB47',
  critical: '#E53251',
  critical2: '#DA2222',
  high: '#FF6103',
  high2: '#E4632D',
  medium2: '#F6C140',
  low2: '#A6BE54',

  negativePromter: '#E8E8E8',
  positivePromter: '#90BA5B',
  negativePassive: '#CE3E3E',
  positivePassive: '#E8E8E8',
};

const textColors = {
  primary: Colors.white,
  secondary: Colors.secondary,
  accent: '#193F8B',
};

const buttonColors = {
  backgroundColor: '#193F8B',
  positive: Colors.accent,
  negative: Colors.secondary,
};

const getStatusBorderColor = (_status) => {
  switch (_status) {
    case 'Open':
      return statusColors.openBorder;
    case 'Closed':
      return statusColors.closedBorder;
    case 'Escalated':
      return statusColors.escalatedBorder;
    case 'Overdue':
      return statusColors.overDueBorder;
    case 'Resolved':
      return statusColors.resolvedBorder;
    default:
      return statusColors.newBorder;
  }
};

const getStatusFillerColor = (_status) => {
  switch (_status) {
    case 'Open':
      return statusColors.openFiller;
    case 'Closed':
      return statusColors.closedFiller;
    case 'Escalated':
      return statusColors.escalatedFiller;
    case 'Overdue':
      return statusColors.overDueFiller;
    case 'Resolved':
      return statusColors.resolvedFiller;
    default:
      return statusColors.newFiller;
  }
};

const getPriorityBorderColor = (_priority) => {
  switch (_priority) {
    case 'Critical':
      return priorityColors.critical.border;
    case 'High':
      return priorityColors.high.border;
    case 'Normal':
      return priorityColors.normal.border;
    case 'Low':
      return priorityColors.low.border;
    default:
      return priorityColors.unassigned.border;
  }
};

const getPriorityFillerColor = (_priority) => {
  switch (_priority) {
    case 'Critical':
      return priorityColors.critical.filler;
    case 'High':
      return priorityColors.high.filler;
    case 'Normal':
      return priorityColors.normal.filler;
    case 'Low':
      return priorityColors.low.filler;
    default:
      return priorityColors.unassigned.filler;
  }
};

const statusColors = {
  openBorder: Colors.promoter,
  openFiller: '#9FE4AC',

  closedBorder: Colors.evenDarkerGrey,
  closedFiller: Colors.darkGrey,

  escalatedBorder: '#FF9045',
  escalatedFiller: '#FFC7A2',

  overDueBorder: Colors.error,
  overDueFiller: '#F298A8',

  resolvedBorder: Colors.accentLight,
  resolvedFiller: '#8DC3F2',

  newBorder: Colors.evenDarkerGrey,
  newFiller: Colors.white,
};

const priorityColors = {
  critical: {
    border: '#DA2222',
    filler: '#DA222236',
  },
  high: {
    border: '#E4632D',
    filler: '#E4632D33',
  },
  normal: {
    border: Colors.medium2,
    filler: '#F6C14033',
  },
  low: {
    border: Colors.low2,
    filler: '#A6BE5433',
  },
  unassigned: {
    border: Colors.darkGrey,
    filler: '#D8D8D833',
  },
};

export const PROGRESS_COLOR_INCOMPLETE = '#DD4F43';
export const PROGRESS_COLOR_TERMINATED = '#FFCE42';

export {
  Colors,
  textColors,
  buttonColors,
  statusColors,
  priorityColors,
  getPriorityBorderColor,
  getPriorityFillerColor,
  getStatusBorderColor,
  getStatusFillerColor,
};
