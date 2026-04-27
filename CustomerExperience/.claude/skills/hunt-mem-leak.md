# hunt-mem-leak

Hunt the next memory leak segment in the CX app.

## Instructions

You are executing one iteration of the memory leak hunt. Follow these steps precisely.

### Step 1 — Read the tracker

Read `doc/MEMORY_LEAK_HUNT.md` in full. Find the **first segment** in the Segment Registry whose Status is `⬜ Not Started`. That is your target for this session.

If a segment is marked `🔄 In Progress`, resume that one instead — it was started but not completed.

If all segments are `✅ Done` or `✅ Cleared`, report that the hunt is complete and stop.

### Step 2 — Mark the segment In Progress

Update the segment's Status in the registry table from `⬜ Not Started` to `🔄 In Progress` and set the Date to today.

### Step 3 — Hunt the segment

Read every file listed under that segment's Key Files column. For large segments with a sub-priority list (Segments 3 and 14), follow the P1 → P2 → P3 → P4 priority order defined in the tracker.

For each file, scan against **every pattern** in the Known Leak Patterns Cheatsheet:
- Listener & Subscription Patterns
- Timer Patterns
- Animation Patterns
- Saga Patterns
- Component & Closure Patterns
- List & State Growth Patterns

Be thorough. Read the actual code — do not guess. If a pattern is absent, note it explicitly as "not present."

### Step 4 — Write the Daily Hunt Log entry

Append a new entry to the **Daily Hunt Log** section of `doc/MEMORY_LEAK_HUNT.md` using this format:

```
---

### Day N — Segment [#] — [Segment Name] ([date])

**Files reviewed:**
- path/to/file.js — [one-line summary of what was found or cleared]

**Findings:**

#### Finding X — [Short title]
- **File:** `path/to/file.js` line N
- **Pattern:** [Which pattern from the cheatsheet]
- **Code:** (paste the specific lines)
- **Why it leaks:** [explain clearly]
- **Fix direction:** [concrete fix — what to change and how]
- **Status:** `⬜ Not Fixed`

*(Repeat for each finding. If nothing found, write "No issues found — segment cleared.")*

**Runtime test needed:**
[Describe exactly which screen to open, what interactions to perform, and what to look for in Flipper/Instruments to confirm the leak at runtime.]
```

### Step 5 — Update the Segment Registry

In the Segment Registry table, update the segment row:
- **Status:** `✅ Done` (or `✅ Cleared` if no issues were found)
- **Date:** today's date
- **Outcome:** one-line summary (e.g. "2 leaks found — listeners not unsubscribed" or "No issues — cleared")

### Step 6 — Stop

Do NOT proceed to the next segment. Do NOT fix anything unless explicitly asked. Your job in this session is hunt + document only.

Report to the user:
- Which segment was just completed
- How many findings were recorded
- What the next segment will be when `/hunt-mem-leak` is run again
