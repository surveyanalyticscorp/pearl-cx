# Action Email Feature

Compose and send emails directly from a ticket. Managers can write a message, apply an AI-generated draft, attach files, and view the ticket's prior email history — all within a single bottom sheet flow.

---

## Navigation Entry Points

Both screens are registered in `app/routes/CommonScreen.js`:

| Route name | Component | Params |
|---|---|---|
| `sendEmail` | `SendEmail` | `ticketId: number`, `toEmail?: string` |
| `actionEmailHistory` | `ActionEmailHistory` | `ticketId: number` |

Navigate to the compose screen from `TIcketTakeAction.js` or anywhere that has a ticket context.

---

## Screen Inventory

| File | Purpose |
|---|---|
| `SendEmail.js` | Main compose screen — owns refs, wires 3 hooks, renders composite components. |
| `ActionEmailHistory.js` | Shows all prior emails sent for a ticket (full email body + attachments). |

---

## Component Tree

```
SendEmail
  EmailEditorContext.Provider
    SafeAreaView
      EmailComposerBody                  ← KeyboardAwareScrollView wrapper
        RenderHeader                     ← "Respond via email" + close button
        EmailOptions                     ← toolbar row (ticket ID, AI, template, attach, send)
          RenderTicketId (TicketId.js)
          AiDraftButton
          TemplateIcon
          AttachmentUploadIcon
          SendEmailButton
        SendEmailTo                      ← read-only "To: email" field
        EmailSubject                     ← subject TextInput
        RichEditor                       ← react-native-pell-rich-editor
        AttachmentView                   ← FlatList of AttachmentItem
        ActionHistory                    ← shows prior action summary
          ActionHistoryItem
      EmailTemplateSheet                 ← QPBottomSheet > SelectEmailTemplate
      AIEmailDraftSheet                  ← QPBottomSheet > AIEmailDraftModal
        AIEmailDraftModal
          RenderLoadingSpinner
          RenderAILogo
          AiEmailBodyTextView
          EmailActionBar
            RefineButton
            RegenerateButton
          InsertButton
          QPBottomSheet > RefineOptionsSheet
      CustomKeyboardToolbar              ← appears above keyboard when visible
      InsertLinkModal                    ← Modal for hyperlink insertion
      EmailSentOverlay                   ← full-screen success/error overlay
```

---

## Hooks

All hooks live in `hooks/`:

| Hook | Purpose |
|---|---|
| `useEmailBody` | Manages body state (`{ ticketId, subject, toEmail, emailBody, attachments }`). Resets `emailBody` when `defaultEmail` changes. |
| `useKeyboardState` | Tracks keyboard visibility and height for toolbar positioning. |
| `useEmailScreenActions` | Orchestrates all screen-level actions: overlay lifecycle, bottom sheet visibility, template/AI draft application, link insertion, history dispatch on mount. |
| `useEmailDraft` | Manages AI draft state: calls `useDraftGeneration`, handles insert/regenerate/refine options. |
| `useDraftGeneration` | Dispatches `generateEmailDraft` / `generateRefineEmailDraft` and tracks loading + current draft. |
| `useSendEmail` | Dispatches `sendEmail` action with validation (empty subject / body guards). Reads `blurEditor` from `EmailEditorContext`. |

---

## Redux State

All state lives under `state.dashboard.*` (DashboardReducer):

| Key | Used by | Purpose |
|---|---|---|
| `emailData.defaultTemplate` | `useEmailBody` | Triggers body reset when template changes |
| `emailData.emailTemplates` | `useEmailScreenActions` | Populates the template picker list |
| `emailData.emailSentResponse` | `useEmailScreenActions` | Triggers success overlay + `goBack()` after 2s |
| `emailData.emailSendError` | `useEmailScreenActions` | Triggers error overlay after 2s |
| `mediaFileList` | `AttachmentView`, `useSendEmail` | Attached file list — cleared on screen exit |
| `ticketActionHistory.summary` | `ActionHistory`, `ActionHistoryItem` | Whether to show the prior-action section |
| `ticketActionHistory.details` | `ActionEmailHistory` | Full history list data |
| `generatedEmailDraftResponse` | `useDraftGeneration` | AI draft response (`{ response, context }`) |
| `ticket.id` | `TicketId`, `ActionHistoryItem` | Ticket ID display and navigation |
| `ticket.panelMember.email` | `SendEmailTo` | "To" field display |

### Redux Actions Used

From `app/redux/actions/closedloop.actions.js`:
- `sendEmail` — submits the email
- `postUploadFile` — uploads an attachment file
- `getActionHistorySummary(authToken, ticketId)` — fetched on screen mount
- `getActionHistoryDetails(authToken, ticketId)` — fetched on screen mount
- `resetSendEmailResponse` — clears success state after overlay
- `resetSendEmailError` — clears error state after overlay
- `generateEmailDraft` — triggers AI draft generation
- `generateRefineEmailDraft` — triggers AI draft refinement

From `app/redux/actions/email.actions.js`:
- `setTemplateBottomSheetState` — imported in `TemplateIcon` (verify if still needed)

---

## AI Draft Flow

```
User taps AI button (AiDraftButton)
  → onPressAiButton (useEmailScreenActions)
  → isEmailDraftBottomSheetVisible = true
  → AIEmailDraftSheet opens

AIEmailDraftModal mounts
  → useDraftGeneration: dispatches generateEmailDraft on mount
  → Spinner shown while isLoading
  → On response: AiEmailBodyTextView renders HTML draft

User taps Refine
  → RefineButton opens RefineOptionsSheet (nested QPBottomSheet)
  → User selects tone/intent chips → Apply
  → useDraftGeneration: dispatches generateRefineEmailDraft

User taps Insert
  → useEmailDraft.onPressInsert
  → setAIEmailDraft (useEmailScreenActions): sets body state + calls richTextRef.setContentHTML
  → AIEmailDraftSheet closes
```

---

## Shared Dependencies

`QPBottomSheet` and `QPBottomSheetHeader` live in `app/widgets/QPBottomSheet/`. Import them as:

```js
import {QPBottomSheet, QPBottomSheetHeader} from '../../../widgets/QPBottomSheet';
```

`DropDownButton` (used by `RefineDropDown`) is still in `takeaction/`:

```js
import DropDownButton from '../takeaction/DropDownButton';
```

---

## Known Constraints

- `CustomKeyboardToolbar` uses `position: absolute` — it must be rendered outside `KeyboardAwareScrollView` to float above the keyboard.
- `EmailSentOverlay` uses `position: absolute` with `zIndex: 999` — it covers the entire screen until the 2-second timer fires.
- `RichEditor` (`react-native-pell-rich-editor`) requires `androidHardwareAccelerationDisabled: true` to avoid rendering glitches on Android.
- `QPBottomSheet` uses `maxHeight: 80%` by default — `AIEmailDraftSheet` passes `bottomSheetHeight="90%"` and `EmailTemplateSheet` passes `bottomSheetHeight="40%"` to ensure correct scroll bounds.
