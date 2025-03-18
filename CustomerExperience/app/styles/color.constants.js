const Colors = {
  textTintColor: '#D5D8DE',
  primary: '#707070',
  secondary: '#909090',
  red: '#990000',
  lightRed: '#FC1154',
  white: '#ffffff',
  transparentBackground: 'rgba(0,0,0,0.1)',
  black: '#000000',
  accentLight: '#1b87e6',
  checkboxColor: '#ababab',
  accent: '#1B3380',
  deleteBackground: '#cc000012',
  deleteButtonText: '#cc0000',

  filterIconColor: '#545E6B',
  overdueAlertColor: '#EA4650',
  textAvatarBackground: '#cc6677',
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
  overdueBackgroundColor: '#FFBABA',
  overdueTextColor: '#D8000C',
  toastSuccessTextColor: '#227700',
  toastSuccessBackgroundColor: '#DFF2BF',

  toastInfoTextColor: ' #215694',
  toastInfoBackgroundColor: '#CCF0FF',
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

const getStatusBorderColor = _status => {
  switch (_status) {
    case 'open':
      return statusColors.openBorder;
    case 'closed':
      return statusColors.closedBorder;
    case 'escalated':
      return statusColors.escalatedBorder;
    case 'overdue':
      return statusColors.overDueBorder;
    case 'resolved':
      return statusColors.resolvedBorder;
    default:
      return statusColors.newBorder;
  }
};

const getStatusBorderColorbyId = _status => {
  switch (_status) {
    case 'open':
      return statusColors.openBorder;
    case 'closed':
      return statusColors.closedBorder;
    case 'escalated':
      return statusColors.escalatedBorder;
    case 'overdue':
      return statusColors.overDueBorder;
    case 'resolved':
      return statusColors.resolvedBorder;
    default:
      return statusColors.newBorder;
  }
};

const getStatusFillerColor = _status => {
  switch (_status) {
    case 'open':
      return statusColors.openFiller;
    case 'closed':
      return statusColors.closedFiller;
    case 'escalated':
      return statusColors.escalatedFiller;
    case 'overdue':
      return statusColors.overDueFiller;
    case 'resolved':
      return statusColors.resolvedFiller;
    default:
      return statusColors.newFiller;
  }
};
const getStatusFillerColorbyId = _status => {
  switch (_status) {
    case 1:
      return statusColors.openFiller;
    case 2:
      return statusColors.escalatedFiller;
    case 3:
      return statusColors.overDueFiller;
    case 4:
      return statusColors.resolvedFiller;
    case 0:
      return statusColors.newFiller;

    default:
      //'closed'
      return statusColors.closedFiller;
  }
};

const getPriorityBorderColor = _priority => {
  switch (_priority) {
    case 'critical':
      return priorityColors.critical.border;
    case 'high':
      return priorityColors.high.border;
    case 'medium':
      return priorityColors.normal.border;
    case 'low':
      return priorityColors.low.border;
    default:
      return priorityColors.unassigned.border;
  }
};

const getPriorityBorderColorbyId = _priority => {
  switch (_priority) {
    case 3:
      return priorityColors.critical.border;
    case 2:
      return priorityColors.high.border;
    case 1:
      return priorityColors.normal.border;
    case 0:
      return priorityColors.low.border;
    default:
      return priorityColors.unassigned.border;
  }
};

const getPriorityFillerColor = _priority => {
  switch (_priority) {
    case 'critical':
      return priorityColors.critical.filler;
    case 'high':
      return priorityColors.high.filler;
    case 'normal':
      return priorityColors.normal.filler;
    case 'low':
      return priorityColors.low.filler;
    default:
      return priorityColors.unassigned.filler;
  }
};

const getPriorityFillerColorbyId = _priority => {
  switch (_priority) {
    case 3:
      return priorityColors.critical.filler;
    case 2:
      return priorityColors.high.filler;
    case 1:
      return priorityColors.normal.filler;
    case 0:
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
  //   Critical: #6E003C
  // High: #B40014
  // Medium: #FF8C00
  // Low: #FFCF70
  critical: {
    border: '#DA2222',
    filler: '#DA222236',
  },
  high: {
    border: '#E4632D',
    filler: '#E4632D33',
  },
  normal: {
    border: '#F6C140',
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

export function getNPSColor(sentiment) {
  switch (sentiment) {
    case 'Detractor':
      return Colors.detractor2;
    case 'Passive':
      return Colors.passive2;
    default:
      return Colors.promoter2;
  }
}

let getNPSColorByNPS = nps => {
  if (nps < 0) {
    return Colors.detractor2;
  } else if (nps >= 0 && nps <= 50) {
    return Colors.passive2;
  } else {
    return Colors.promoter2;
  }
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
  getPriorityBorderColorbyId,
  getPriorityFillerColorbyId,
  getStatusBorderColorbyId,
  getStatusFillerColorbyId,
  getNPSColorByNPS,
};
