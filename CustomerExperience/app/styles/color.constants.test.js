import {
  getNameInitials,
  getPriorityById,
  getStatusById,
} from '../Utils/TicketUtils';
import {
  Colors,
  textColors,
  buttonColors,
  getPriorityBorderColor,
  getPriorityBorderColorbyId,
  getPriorityFillerColor,
  getPriorityFillerColorbyId,
  getStatusBorderColor,
  getStatusBorderColorbyId,
  getStatusFillerColor,
  getStatusFillerColorbyId,
  statusColors,
  priorityColors,
  getNPSColor,
  PROGRESS_COLOR_INCOMPLETE,
  PROGRESS_COLOR_TERMINATED,
} from './color.constants';
// test all functions/methods in color.constants.js
describe('Colors', () => {
  it('has the correct values for Colors', () => {
    expect(Colors.textTintColor).toBe('#D5D8DE');
    expect(Colors.primary).toBe('#707070');
    expect(Colors.secondary).toBe('#909090');
    expect(Colors.red).toBe('#990000');
    expect(Colors.lightRed).toBe('#FC1154');
    expect(Colors.white).toBe('#ffffff');
    expect(Colors.black).toBe('#000000');
    expect(Colors.accentLight).toBe('#1b87e6');
    expect(Colors.checkboxColor).toBe('#ababab');
    expect(Colors.accent).toBe('#1B3380');
    expect(Colors.deleteBackground).toBe('#CC0000');
    expect(Colors.deleteButtonText).toBe('#FFFFFF');
    expect(Colors.filterIconColor).toBe('#545E6B');
    expect(Colors.overdueAlertColor).toBe('#EA4650');
    expect(Colors.textAvatarBackground).toBe('#CC6677');
    expect(Colors.accentGradient).toBe('rgba(239, 246, 252, 1)');
    expect(Colors.gradientColor).toBe('#8AC0EA');
    expect(Colors.grey).toBe('#f9f9f9');
    expect(Colors.lightBlack).toBe('#404A5B');
    expect(Colors.evenDarkerGrey).toBe('#9B9B9B');
    expect(Colors.darkerGrey).toBe('#eeeeee');
    expect(Colors.darkGrey).toBe('#d8d8d8');
    expect(Colors.overlay).toBe('#edf6fd');
    expect(Colors.borderColor).toBe('#A2A6A9');
    expect(Colors.dotColor).toBe('rgba(100,100,100,0.5)');
    expect(Colors.dotSelectedColor).toBe('#010B06');
    expect(Colors.placeholderColor).toBe('rgba(45,76,128,0.8)');
    expect(Colors.imageOverlay).toBe('#d3d3d3');
    expect(Colors.crossColor).toBe('rgba(10,35,54,0.8)');
    expect(Colors.transparent).toBe('rgba(255, 255, 255, 0.5)');
    expect(Colors.fullTransparent).toBe('rgba(255, 255, 255, 0)');
    expect(Colors.modalBackgroundForSurveyList).toBe('#2c2b2c');
    expect(Colors.toggleButtonColor).toBe('#6DBEB7');
    expect(Colors.settingsBackground).toBe('#F5F5F5');
    expect(Colors.settingDividerColor).toBe('#E4E4E4');
    expect(Colors.success).toBe('#3FCA5A');
    expect(Colors.error).toBe('#E53251');
    expect(Colors.selectionColor).toBe('rgba(138, 192, 234,0.15)');
    expect(Colors.faceLandmarksBorderColor).toBe('#a6ffb4');
    expect(Colors.smileyOneColor).toBe('#f21c1c');
    expect(Colors.smileyTwoColor).toBe('#ea5614');
    expect(Colors.smileyThreeColor).toBe('#ffb80d');
    expect(Colors.smileyFourColor).toBe('#7cca53');
    expect(Colors.smileyFiveColor).toBe('#4cb714');
    expect(Colors.selectionGreyColor).toBe('#F7F8F9');
    expect(Colors.promoter).toBe('#3FCA5A');
    expect(Colors.promoter2).toBe('#1BA758');
    expect(Colors.detractor).toBe('#CE002A');
    expect(Colors.detractor2).toBe('#FF7681');
    expect(Colors.passive).toBe('#FFE300');
    expect(Colors.passive2).toBe('#FFCB47');
    expect(Colors.critical).toBe('#E53251');
    expect(Colors.critical2).toBe('#F85271');
    expect(Colors.high).toBe('#FF6103');
    expect(Colors.high2).toBe('#F69A79');
    expect(Colors.medium2).toBe('#F1DA7E');

    expect(Colors.low2).toBe('#42BD84');
    expect(Colors.negativePromter).toBe('#E8E8E8');
    expect(Colors.positivePromter).toBe('#90BA5B');
    expect(Colors.negativePassive).toBe('#CE3E3E');
    expect(Colors.positivePassive).toBe('#E8E8E8');
    expect(Colors.overdueBackgroundColor).toBe('#FFBABA');
    expect(Colors.overdueTextColor).toBe('#D8000C');
  });
});

describe('getPriorityBorderColor', () => {
  it('returns the correct color for "Critical" priority', () => {
    const color = getPriorityBorderColor('critical');
    expect(color).toBe('#DA2222');
  });

  it('returns the correct color for "High" priority', () => {
    const color = getPriorityBorderColor('high');
    expect(color).toBe('#E4632D');
  });

  it('returns the correct color for "Normal" priority', () => {
    const color = getPriorityBorderColor('medium');
    expect(color).toBe('#F6C140');
  });

  it('returns the correct color for "Low" priority', () => {
    const color = getPriorityBorderColor('low');
    expect(color).toBe('#42BD84');
  });

  it('returns the correct color for "Unassigned" priority', () => {
    const color = getPriorityBorderColor('unassigned');
    expect(color).toBe('#d8d8d8');
  });
});

describe('getPriorityBorderColorbyId', () => {
  it('returns the correct color for priority ID 1', () => {
    const color = getPriorityBorderColorbyId(1);
    expect(color).toBe('#F6C140');
  });

  it('returns the correct color for priority ID 2', () => {
    const color = getPriorityBorderColorbyId(2);
    expect(color).toBe('#E4632D');
  });

  it('returns the correct color for priority ID 3', () => {
    const color = getPriorityBorderColorbyId(3);
    expect(color).toBe('#DA2222');
  });

  it('returns the correct color for priority ID 4', () => {
    const color = getPriorityBorderColorbyId(4);
    expect(color).toBe('#d8d8d8');
  });

  it('returns the correct color for priority ID 0', () => {
    const color = getPriorityBorderColorbyId(0);
    expect(color).toBe('#42BD84');
  });
});
describe('getPriorityFillerColor', () => {
  it('returns the correct color for "Critical" priority', () => {
    const color = getPriorityFillerColor('critical');
    expect(color).toBe('#DA222236');
  });

  it('returns the correct color for "High" priority', () => {
    const color = getPriorityFillerColor('High');
    expect(color).toBe('#D8D8D833');
  });

  it('returns the correct color for "Medium" priority', () => {
    const color = getPriorityFillerColor('medium');
    expect(color).toBe('#D8D8D833');
  });

  it('returns the correct color for "Low" priority', () => {
    const color = getPriorityFillerColor('low');
    expect(color).toBe('#A6BE5433');
  });

  it('returns the correct color for "Unassigned" priority', () => {
    const color = getPriorityFillerColor('unassigned');
    expect(color).toBe('#D8D8D833');
  });
});

describe('getPriorityFillerColorbyId', () => {
  it('returns the correct color for priority ID 1', () => {
    const color = getPriorityFillerColorbyId(1);
    expect(color).toBe('#F6C14033');
  });

  it('returns the correct color for priority ID 2', () => {
    const color = getPriorityFillerColorbyId(2);
    expect(color).toBe('#E4632D33');
  });

  it('returns the correct color for priority ID 3', () => {
    const color = getPriorityFillerColorbyId(3);
    expect(color).toBe('#DA222236');
  });

  it('returns the correct color for priority ID 4', () => {
    const color = getPriorityFillerColorbyId(4);
    expect(color).toBe('#D8D8D833');
  });

  it('returns the correct color for priority ID 0', () => {
    const color = getPriorityFillerColorbyId(0);
    expect(color).toBe('#A6BE5433');
  });
});
describe('getStatusBorderColor', () => {
  it('returns the correct color for status "open"', () => {
    const color = getStatusBorderColor('open');
    expect(color).toBe('#40CA5A');
  });

  it('returns the correct color for status "closed"', () => {
    const color = getStatusBorderColor('closed');
    expect(color).toBe('#9B9B9B');
  });

  it('returns the correct color for status "escalated"', () => {
    const color = getStatusBorderColor('escalated');
    expect(color).toBe('#FF9145');
  });

  it('returns the correct color for status "overdue"', () => {
    const color = getStatusBorderColor('overdue');
    expect(color).toBe('#E53251');
  });

  it('returns the correct color for status "resolved"', () => {
    const color = getStatusBorderColor('resolved');
    expect(color).toBe('#1b87e6');
  });
});

describe('getStatusFillerColor', () => {
  it('returns the correct color for status "open"', () => {
    const color = getStatusFillerColor('open');
    expect(color).toBe('#9FE4AC');
  });

  it('returns the correct color for status "closed"', () => {
    const color = getStatusFillerColor('closed');
    expect(color).toBe('#d8d8d8');
  });

  it('returns the correct color for status "escalated"', () => {
    const color = getStatusFillerColor('escalated');
    expect(color).toBe('#FFC7A2');
  });

  it('returns the correct color for status "overdue"', () => {
    const color = getStatusFillerColor('overdue');
    expect(color).toBe('#F298A8');
  });

  it('returns the correct color for status "resolved"', () => {
    const color = getStatusFillerColor('resolved');
    expect(color).toBe('#8DC3F2');
  });
});
describe('getStatusFillerColorbyId', () => {
  it('returns the correct color for status ID 1', () => {
    const color = getStatusFillerColorbyId(1);
    expect(color).toBe('#9FE4AC');
  });

  it('returns the correct color for status ID 2', () => {
    const color = getStatusFillerColorbyId(2);
    expect(color).toBe('#FFC7A2');
  });

  it('returns the correct color for status ID 3', () => {
    const color = getStatusFillerColorbyId(3);
    expect(color).toBe('#F298A8');
  });

  it('returns the correct color for status ID 4', () => {
    const color = getStatusFillerColorbyId(4);
    expect(color).toBe('#8DC3F2');
  });

  it('returns the correct color for status ID 0', () => {
    const color = getStatusFillerColorbyId(0);
    expect(color).toBe('#ffffff');
  });
});

describe('statusColors', () => {
  it('has the correct values for statusColors', () => {
    expect(statusColors.openBorder).toBe('#40CA5A');
    expect(statusColors.openFiller).toBe('#9FE4AC');
    expect(statusColors.closedBorder).toBe('#9B9B9B');
    expect(statusColors.closedFiller).toBe('#d8d8d8');
    expect(statusColors.escalatedBorder).toBe('#FF9145');
    expect(statusColors.escalatedFiller).toBe('#FFC7A2');
    expect(statusColors.overDueBorder).toBe('#E53251');
    expect(statusColors.overDueFiller).toBe('#F298A8');
    expect(statusColors.resolvedBorder).toBe('#1b87e6');
    expect(statusColors.resolvedFiller).toBe('#8DC3F2');
  });
});

describe('priorityColors', () => {
  it('has the correct values for priorityColors', () => {
    expect(priorityColors.critical.border).toBe('#DA2222');
    expect(priorityColors.critical.filler).toBe('#DA222236');
    expect(priorityColors.high.border).toBe('#E4632D');
    expect(priorityColors.high.filler).toBe('#E4632D33');
    expect(priorityColors.normal.border).toBe('#F6C140');
    expect(priorityColors.normal.filler).toBe('#F6C14033');
    expect(priorityColors.low.border).toBe('#42BD84');
    expect(priorityColors.low.filler).toBe('#A6BE5433');
    expect(priorityColors.unassigned.border).toBe('#d8d8d8');
    expect(priorityColors.unassigned.filler).toBe('#D8D8D833');
  });
});

describe('getNPSColor', () => {
  it('returns the correct color for "Detractor" sentiment', () => {
    const color = getNPSColor('Detractor');
    expect(color).toBe('#F85271');
  });

  it('returns the correct color for "Passive" sentiment', () => {
    const color = getNPSColor('Passive');
    expect(color).toBe('#F1DA7E');
  });

  it('returns the correct color for "Promoter" sentiment', () => {
    const color = getNPSColor('Promoter');
    expect(color).toBe('#42BD84');
  });
});

describe('PROGRESS_COLOR_INCOMPLETE', () => {
  it('returns the correct color for "Detractor" sentiment', () => {
    const color = PROGRESS_COLOR_INCOMPLETE;
    expect(color).toBe('#DD4F43');
  });

  it('returns the correct color for "Passive" sentiment', () => {
    const color = PROGRESS_COLOR_INCOMPLETE;
    expect(color).toBe('#DD4F43');
  });

  it('returns the correct color for "Promoter" sentiment', () => {
    const color = PROGRESS_COLOR_INCOMPLETE;
    expect(color).toBe('#DD4F43');
  });
});

describe('PROGRESS_COLOR_TERMINATED', () => {
  it('returns the correct color for "Detractor" sentiment', () => {
    const color = PROGRESS_COLOR_TERMINATED;
    expect(color).toBe('#FFCE42');
  });

  it('returns the correct color for "Passive" sentiment', () => {
    const color = PROGRESS_COLOR_TERMINATED;
    expect(color).toBe('#FFCE42');
  });

  it('returns the correct color for "Promoter" sentiment', () => {
    const color = PROGRESS_COLOR_TERMINATED;
    expect(color).toBe('#FFCE42');
  });
});

describe('buttonColors', () => {
  it('has the correct values for buttonColors', () => {
    expect(buttonColors.positive).toBe('#1B3380');
    expect(buttonColors.negative).toBe('#909090');
  });
});

describe('textColors', () => {
  it('has the correct values for textColors', () => {
    expect(textColors.primary).toBe('#ffffff');
    expect(textColors.secondary).toBe('#909090');
    expect(textColors.accent).toBe('#193F8B');
  });
});

describe('getNameInitials', () => {
  it('returns the correct initials for a name', () => {
    const initials = getNameInitials('John Doe');
    expect(initials).toBe('JD');
  });
});

describe('getStatusById', () => {
  it('returns the correct status for a status ID', () => {
    const status = getStatusById(1);
    expect(status).toBe('Open');
  });
});

describe('getPriorityById', () => {
  it('returns the correct priority for a priority ID', () => {
    const priority = getPriorityById(1);
    expect(priority).toBe('Medium');
  });
});
