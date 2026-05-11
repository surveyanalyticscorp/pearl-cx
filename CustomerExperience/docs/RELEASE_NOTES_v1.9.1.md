# Release Notes — Pearl CX v1.9.1

**Period:** May 2026

---

## App Store / Play Store Release Note

```
What's New in v1.9.1

1. Email history now displays message body text correctly
2. Fixed a crash when viewing comments with no author avatar
3. Filter sheet label corrected to "Filter by"
4. Bug fixes and stability improvements
```

---

## Full Release Notes

### Bug Fixes

- **Email Body Visible in History** — Email history no longer shows a blank area where the message body should appear. The HTML content is now wrapped in a `<span>` so colour and font styles are applied correctly by the renderer.
- **Null Avatar Crash Guard** — The response activity feed no longer crashes when a comment has no `commentBy` value. The avatar is safely skipped when the author field is absent.
- **Filter Sheet Header Label** — The sort / filter bottom sheet now shows "Filter by" as its header instead of the incorrect "Status" label.

### Under the Hood

- **CommonUI Component Split** — The monolithic `CommonUI.js` barrel has been refactored into individual focused files (`ApplyButton`, `Avatar`, `CalendarIcon`, `ChipItem`, `CloseButton`, `CopyIcon`, `DateIcon`, `ExclaimationIcon`, `FilterIcon`, `NoItemsFound`, `PriorityUI`, `RenderPriorityIcon`, `RenderRoundImageOrColor`, `RenderSpinner`, `ResponsesIcon`, `SaveDashboardDate`, `SearchIcon`, `SearchTextInput`, `SortIcon`, `StatusIcon`) with organised subdirectories for `checkbox/`, `filter/`, and `status/` components. Public API is unchanged.
- **ResponseProfile Text Standardisation** — Replaced raw `<Text>` elements with the project-wide `<TextLabel>` component throughout `ResponseProfile`. Fixed `secondaryTextBold` in `text.styles.js` to use `FontFamily.bold` + `FontWeight.bold` instead of an inline `fontWeight` value.
- **CLF Backend URL Corrected** — Development environment now correctly targets the `clfqa` backend (was `clfqa1`).
- **InfoIcon SVG Import Fixed** — Corrected filename casing to `Info.svg` to prevent build failures on case-sensitive file systems.
- **Xcode Build Phase Cleanup** — Removed empty `inputPaths` / `outputPaths` arrays from three Xcode build phases (RNFB Core Config, Copy Pods Resources, Embed Pods Frameworks) to silence Xcode 16 sandbox warnings.
- **iOS Build Number Bumped to 4.**
