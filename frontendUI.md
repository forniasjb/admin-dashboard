# Frontend UI – Admin Dashboard

React 18 (Vite) + Material UI v5 + React Router v6 + Recharts. JavaScript (`.jsx`) only.

_Last updated: 2026-11-11 (all suggested UI improvements done; Users dialogs, breadcrumbs and Back/Forward guard added)_

## Completed Tasks

### Project setup
- [x] Vite + React 18 project scaffolded (`admin-dashboard`)
- [x] Dependencies installed: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `react-router-dom@6`, `recharts`
- [x] Folder structure created: `api/`, `assets/`, `components/layout`, `components/common`, `pages/`, `utils/`
- [x] Vite boilerplate removed; Inter font, favicon and page title configured in `index.html`
- [x] ESLint passes (`react/prop-types` rule disabled for this plain-JS project) – re-verified after the Report Generation page was added
- [x] Production build passes (`npm run build`) – re-verified after the Report Generation page was added

### Theme (`src/theme.js`)
- [x] `ThemeProvider` + `CssBaseline` in `main.jsx`
- [x] Primary `#1976d2`, secondary `#9c27b0`, light mode only
- [x] `borderRadius: 12`, soft shadows, component overrides (Card, Paper, Button, Chip, TableCell)

### Layout (`components/layout/`)
- [x] `Layout.jsx` – app shell using `<Outlet />`, responsive sidebar state
- [x] `Sidebar.jsx` – permanent drawer, 260px collapsible to 70px with smooth animation
- [x] Sidebar navigation items: Dashboard, Reports, Report Generation, Users, Settings
- [x] Active route highlighting, tooltips when collapsed, logo at top
- [x] Auto-collapse to icons on tablet; temporary overlay drawer on mobile
- [x] Desktop collapsed/expanded choice remembered in `localStorage`
- [x] Unsaved-changes guard (`useBlocker` in `Layout.jsx`, `utils/unsavedChanges.js`): leaving Settings or Report Generation with unsaved input – via sidebar, breadcrumb, topbar menu or the browser Back/Forward buttons – shows a "Leave this page?" dialog; closing or reloading the tab shows the browser warning
- [x] `PageBreadcrumbs.jsx` – "Dashboard / <page>" trail above each page (hidden on the dashboard and the 404 page; labels in `ROUTE_LABELS` in `utils/constants.js`)
- [x] `Topbar.jsx` – fixed 64px bar with hamburger, title, search bar (with clear button), notification bell + badge, avatar menu (Profile, Settings, Logout)

### Common components (`components/common/`)
- [x] `StatCard.jsx` – icon, value and trend chip
- [x] `PageHeader.jsx` – title, subtitle and optional actions
- [x] `SearchField.jsx` – search input with a clear (x) button (used on Users and Reports)
- [x] `EmptyState.jsx` and `TableSkeleton.jsx` – shared empty and loading states

### Pages (`pages/`)
- [x] `Dashboard.jsx`
  - 4 stat cards (Total Users, Total Revenue, Orders, Conversion Rate) with trend %
  - Line chart: Revenue Over Time (6 months)
  - Bar chart: Sales by Category
  - Pie chart: Traffic Sources
  - Recent Activity table with status chips
  - Skeleton loading and empty states for the charts and the activity table
- [x] `Reports.jsx`
  - Page header with "Download PDF" button (uses `window.print()`; chrome hidden via `.no-print`)
  - Filter bar: date range, category dropdown, search, Apply Filter, Reset
  - Summary cards: Total Reports, Generated This Month, Pending Reports (computed from data)
  - Reports table: Report ID, Name, Category, Date Created, Status chip, Actions (View / Download / Delete)
  - Pagination (5 / 10 / 25 rows per page)
  - View dialog, delete confirmation dialog, toast notifications
  - Report card grid (4 cards) with "View Report" filtering the table by category
  - Export CSV button (exports the rows matching the applied filters), sticky table header, skeleton loading, empty state with "Clear filters"
- [x] `Users.jsx` – searchable users table with pagination (5 / 10 / 25), sticky header, skeleton loading, empty state (extra page, dummy data)
  - Add User button and per-row Edit / Delete actions (`components/users/UserFormDialog.jsx` + delete confirmation, success toast); local state only, no backend
  - Add/Edit validation: name required, valid email, duplicate emails rejected (a user's own email stays allowed when editing)
  - Page index is clamped when deleting removes the last row of the last page
- [x] `Settings.jsx` – profile form + notification switches with inline validation (name required, valid email), Save disabled until something changes, Discard button, save toast (extra page, local state only)
- [x] `NotFound.jsx` – 404 page
- [x] `ReportGeneration.jsx` – "Report Generation" sidebar item and page (`/report-generation`) with a working Jasper Report dropdown (Activity Report, Ticket) and a description of the selected report; options and their parameter fields live in `api/reportGenerationData.js`
  - Parameter form per report (Activity Report: From/To dates with date-order check; Ticket: ticket number), inline required-field errors
  - Generate (disabled until a report is chosen, spinner while running) and Reset buttons; success result and error (with Retry) placeholders
  - UI only: the request is a simulated delay, no backend

### Routing (`App.jsx`)
- [x] Routes declared with `<Route>` inside `createBrowserRouter` + `RouterProvider` (a data router, needed for `useBlocker`); all pages wrapped in `Layout`
- [x] Routes: `/`, `/reports`, `/report-generation`, `/users`, `/settings`, `*` (404)

### Data and utilities
- [x] Dummy data: `api/dashboardData.js`, `api/reportsData.js`, `api/usersData.js`
- [x] `utils/constants.js` (layout sizes, app name) and `utils/formatters.js` (dates, currency, numbers, status colors)
- [x] `utils/csv.js` (CSV export), `utils/useDocumentTitle.js` (per-route tab title), `utils/useSimulatedLoading.js` (temporary skeleton delay for dummy data – replace with real request state when the API is connected)

### Responsiveness
- [x] Stat cards stack on mobile (1 col → 2 col → 4 col)
- [x] Tables scroll horizontally on small screens

### Verification
- [x] Dashboard and Reports pages opened in a browser: layout, stat cards, all three charts and tables render
- [x] Report Generation page opened in a browser: sidebar item appears, dropdown lists Activity Report and Ticket, selecting an option shows its description
- [x] Sidebar auto-collapse to icons observed at a tablet-sized viewport (Reports page)
- [x] UI improvements checked with a scripted Chrome run: skeletons, empty states, clear buttons, CSV download, Users pagination, sticky header, saved sidebar state, Settings validation, leave-page dialog (desktop and mobile drawer), Report Generation validation/loading/result/Reset, per-route titles; no console errors
- [x] Users Add / Edit / Delete (validation, duplicate email, page clamp), breadcrumbs, and the leave-page dialog on Back/Forward, sidebar, breadcrumb and mobile drawer links checked with a scripted Chrome run; no console errors
- [x] `npm run lint` and `npm run build` pass after these changes

---

## Pending Tasks

### Priority overview
- **P1 – Next (UI only, no backend):** mobile search icon; mobile browser QA
- **P2 – Core flows:** Login/protected routes/real Logout; Profile page; notifications list and mark-as-read; Reports sorting and detail view; error boundary and global snackbar
- **P3 – Needs backend:** real API calls, report download/delete, Jasper report list and output, Settings save, server-side filter/pagination
- **P4 – Quality and polish:** unit tests, accessibility audit, code-splitting, Router v7 flags, deployment config, optional dark mode

### UI improvements (suggested, from review)
- [x] Report Generation: Generate and Reset buttons, Generate disabled until a report is selected, loading / result / error placeholders _(done – see Completed Tasks)_
- [x] Loading skeletons and empty states for the Reports and Users tables, the Dashboard charts and the activity table
- [x] Form validation with inline errors in Settings and Report Generation
- [x] Form validation in the Users Add/Edit dialogs
- [x] Pagination on the Users table
- [x] `document.title` updated per route
- [x] Breadcrumbs
- [x] Sidebar collapsed state persisted in `localStorage`
- [x] Clear (x) button on the search fields
- [x] Sticky table headers (Reports and Users)
- [x] Reports: CSV export in addition to `window.print()`
- [x] Warn before leaving a page with unsaved form changes
- [x] Unsaved-changes warning for the browser Back/Forward buttons (data router + `useBlocker`)

### Backend integration
- [ ] Replace dummy data in `src/api/` with real API calls (e.g. `fetch`/axios) including loading and error states
- [ ] Real report download (PDF/CSV file) – currently the Download icon only shows a toast
- [ ] Persist report deletion to the backend – currently it only updates local state

### Authentication
- [ ] Login page and protected routes
- [ ] Wire up Logout in the Topbar (currently only logs to the console)
- [ ] Use real user data for the avatar and name in the Topbar

### Features
- [ ] Topbar search: make it functional (currently visual only)
- [ ] Topbar: the search bar and app title are hidden on mobile (`xs`); add a search icon that expands the search field
- [ ] Topbar: "Profile" menu item currently opens `/settings`; add a dedicated Profile page
- [ ] Notifications: connect to real data; "mark as read" and a dedicated notification list
- [ ] Users page: persist Add / Edit / Delete to the backend (the dialogs and validation are done; changes currently only update local state)
- [ ] Report Generation: send the parameters to the backend and preview/download the real output (the form, Generate button and result placeholder are done; the request is currently a simulated delay in `api/reportGenerationData.js`)
- [ ] Report Generation: load the list of Jasper reports from the API instead of the static list
- [ ] Settings page: save to backend, change password, avatar upload
- [ ] Reports: sorting by column, and a server-side filter/pagination option
- [ ] Reports: "View" should open a real report detail page or preview instead of a basic dialog

### Quality and testing
- [ ] Manual QA of the mobile drawer (hamburger → overlay → closes on navigation) and the Users, Settings, Report Generation and 404 pages at mobile width. Not yet checked in the browser; tablet collapse has been seen on Reports only
- [ ] Unit tests (Vitest + React Testing Library) for components and utilities
- [ ] Accessibility audit (keyboard navigation, focus, contrast)

### Performance and polish
- [ ] Code-split routes with `React.lazy` / dynamic `import()` (bundle is about 940 kB; Vite warns above 500 kB)
- [ ] Opt in to React Router v7 future flags to remove the console warnings
- [ ] Dark mode (out of scope for now – the theme is light only)
- [ ] Error boundary and global snackbar/notification handling
- [ ] Deployment configuration (SPA fallback rewrite for `createBrowserRouter`, environment variables)

---

## Run locally

```powershell
cd D:\ReactProjects\admin-dashboard
npm install
npm run dev      # development server
npm run build    # production build
npm run lint     # ESLint
```
