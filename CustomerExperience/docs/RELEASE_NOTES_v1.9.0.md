# Release Notes — Pearl CX v1.9.0

**Period:** January 2026 – April 2026

---

## App Store / Play Store Release Note

```
What's New in v1.9.0

1. AI-powered email drafting with tone and length refinement
2. Redesigned ticket cards with improved layout
3. Filter tickets by AI tags
4. Animated dashboard charts with accurate data display
5. Login keeps you signed in across sessions
6. Bug fixes and performance improvements
```

---

## Full Release Notes

### New Features

- **AI Email Drafting** — Generate a reply email in one tap from the ticket email composer. Choose a tone (formal / casual / empathetic) and length (short / medium / detailed) before sending. A full-screen overlay confirms send success or failure.
- **AI Tags Ticket Filter** — Filter tickets by AI-generated tags using a new chip-based filter UI inside the Filter Tickets sheet.
- **Reply Context in Comments** — When replying to a ticket comment, the original message appears as a quoted preview above the input box.

### Dashboard

- NPS scores now display with two decimal places and an animated gauge.
- Donut charts show a center label and animate on load.
- Zero-count segments are no longer hidden from the chart legend.
- Side drawer now shows your workspace name and logo, with active-state icons highlighting the current screen.

### UI Improvements

- Ticket list cards have been redesigned with cleaner spacing and proper layout on small-screen devices (iPhone SE, compact Android phones).
- CSAT toggle button styling improved.
- SVG icons used throughout charts and the drawer for sharper visuals.

### Login

- The app now keeps you signed in across sessions — no need to re-enter credentials every time.
- Forgot Password flow has clearer error messages and smoother navigation.

### Bug Fixes

- Logout dialog no longer appears after logging out.
- Segment selection fixed when creating a ticket.
- Ticket detail screen load issues resolved.
- Email body text now visible in email history.
- Dashboard legend correctly shows zero counts.

### Under the Hood

- React Native upgraded from 0.67 → 0.77 (Hermes engine — faster startup, lower memory).
- Android 16 KB page-size support for Play Store compliance.
- Firebase SDK updated to 10.7.0.
- Build stability fixes for Xcode 16 and Android AGP 8.2.
