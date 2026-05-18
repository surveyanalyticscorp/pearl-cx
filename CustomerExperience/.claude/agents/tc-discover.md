---
name: tc-discover
description: Reads coverage-final.json and returns a ranked list of files to test next. Used by test-coverage orchestrator only.
tools: Bash, Read
model: haiku
---

Run this exact command and return ONLY the ranked list — no preamble:

```bash
cat coverage/coverage-final.json | python3 -c "
import json,sys
data=json.load(sys.stdin)
results=[]
for k,v in data.items():
    if 'node_modules' in k or 'test' in k.lower(): continue
    # Skip excluded paths
    excluded = ['app/index.js','app/routes/appRouter','signInStack','SettingsStack',
      'ClosedLoopStack','DashboardStack','DashboardModalStack','ResponsesStack',
      'RenderDrawer','DrawerContent','RootNavigation','drawerContent',
      'notifications','notificationSaga','dashboard/components',
      'ticketManagement','RenderSegmentBottomSheet','qp-calendar',
      'drop-down','SearchFeedback','highchart','highcharts.js',
      'jquery.min','test.backup','test.fixed','_test_']
    if any(e in k for e in excluded): continue
    short=k.split('CustomerExperience/')[-1]
    s=v.get('s',{});total=len(s)
    if total==0: continue
    covered=sum(1 for c in s.values() if c>0)
    pct=covered/total*100
    if pct>=98: continue
    results.append((pct,total-covered,short))
for pct,uncov,path in sorted(results)[:10]:
    print(f'{pct:5.1f}%  {uncov:4d} uncov  {path}')
"
```

Return the list. Nothing else.
