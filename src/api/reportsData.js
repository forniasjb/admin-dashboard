// Dummy data for the Reports page. Replace with real API calls later.
import { isoDaysAgo } from '../utils/formatters';

export const REPORT_CATEGORIES = ['All', 'Sales', 'Users', 'Traffic'];

// Dates are relative to "today" so the "Generated This Month" card stays meaningful.
export const reports = [
  { id: 'RPT-001', name: 'Monthly Sales Summary', category: 'Sales', dateCreated: isoDaysAgo(1), status: 'Completed' },
  { id: 'RPT-002', name: 'User Growth Analysis', category: 'Users', dateCreated: isoDaysAgo(2), status: 'Completed' },
  { id: 'RPT-003', name: 'Traffic Source Breakdown', category: 'Traffic', dateCreated: isoDaysAgo(3), status: 'Pending' },
  { id: 'RPT-004', name: 'Quarterly Revenue Forecast', category: 'Sales', dateCreated: isoDaysAgo(5), status: 'Failed' },
  { id: 'RPT-005', name: 'Active Users by Region', category: 'Users', dateCreated: isoDaysAgo(8), status: 'Completed' },
  { id: 'RPT-006', name: 'Bounce Rate Report', category: 'Traffic', dateCreated: isoDaysAgo(12), status: 'Completed' },
  { id: 'RPT-007', name: 'Top Selling Products', category: 'Sales', dateCreated: isoDaysAgo(20), status: 'Pending' },
  { id: 'RPT-008', name: 'User Retention Cohorts', category: 'Users', dateCreated: isoDaysAgo(35), status: 'Completed' },
  { id: 'RPT-009', name: 'Campaign Performance', category: 'Traffic', dateCreated: isoDaysAgo(48), status: 'Completed' },
  { id: 'RPT-010', name: 'Refunds & Returns', category: 'Sales', dateCreated: isoDaysAgo(60), status: 'Failed' },
  { id: 'RPT-011', name: 'New Signups per Week', category: 'Users', dateCreated: isoDaysAgo(75), status: 'Completed' },
  { id: 'RPT-012', name: 'Organic Search Trends', category: 'Traffic', dateCreated: isoDaysAgo(90), status: 'Completed' },
];

// Sample report cards (alternative view). "icon" is resolved inside Reports.jsx.
export const reportTemplates = [
  {
    id: 'tpl-sales',
    title: 'Sales Report',
    description: 'Revenue, orders and best-selling products for the selected period.',
    category: 'Sales',
    icon: 'sales',
    color: 'primary',
  },
  {
    id: 'tpl-users',
    title: 'User Report',
    description: 'New signups, active users and retention across all segments.',
    category: 'Users',
    icon: 'users',
    color: 'secondary',
  },
  {
    id: 'tpl-traffic',
    title: 'Traffic Report',
    description: 'Visitors, page views and acquisition channels at a glance.',
    category: 'Traffic',
    icon: 'traffic',
    color: 'success',
  },
  {
    id: 'tpl-forecast',
    title: 'Revenue Forecast',
    description: 'Projected revenue based on the latest sales trends.',
    category: 'Sales',
    icon: 'forecast',
    color: 'warning',
  },
];
