// Dummy data for the Dashboard page. Replace with real API calls later.
import { isoDaysAgo } from '../utils/formatters';

export const statCards = [
  { id: 'users', title: 'Total Users', value: 12847, format: 'number', trend: 12.5, icon: 'users', color: 'primary' },
  { id: 'revenue', title: 'Total Revenue', value: 84250, format: 'currency', trend: 8.2, icon: 'revenue', color: 'success' },
  { id: 'orders', title: 'Orders', value: 3482, format: 'number', trend: -3.1, icon: 'orders', color: 'warning' },
  { id: 'conversion', title: 'Conversion Rate', value: 4.6, format: 'percent', trend: 1.9, icon: 'conversion', color: 'secondary' },
];

export const revenueOverTime = [
  { month: 'Jun', revenue: 9800 },
  { month: 'Jul', revenue: 12400 },
  { month: 'Aug', revenue: 11200 },
  { month: 'Sep', revenue: 15600 },
  { month: 'Oct', revenue: 17900 },
  { month: 'Nov', revenue: 21350 },
];

export const salesByCategory = [
  { category: 'Electronics', sales: 4200 },
  { category: 'Fashion', sales: 3100 },
  { category: 'Home', sales: 2400 },
  { category: 'Beauty', sales: 1800 },
  { category: 'Sports', sales: 2700 },
];

export const trafficSources = [
  { name: 'Organic', value: 4200 },
  { name: 'Direct', value: 2800 },
  { name: 'Social', value: 1900 },
  { name: 'Referral', value: 1100 },
];

export const recentActivity = [
  { id: 1, user: 'Maria Santos', action: 'Placed an order #10234', date: isoDaysAgo(0), status: 'Completed' },
  { id: 2, user: 'John Reyes', action: 'Requested a refund', date: isoDaysAgo(0), status: 'Pending' },
  { id: 3, user: 'Ana Cruz', action: 'Updated profile', date: isoDaysAgo(1), status: 'Completed' },
  { id: 4, user: 'Mark Dela Cruz', action: 'Payment failed #10229', date: isoDaysAgo(2), status: 'Failed' },
  { id: 5, user: 'Liza Garcia', action: 'Created a new account', date: isoDaysAgo(3), status: 'Completed' },
  { id: 6, user: 'Paolo Mendoza', action: 'Submitted support ticket', date: isoDaysAgo(4), status: 'Pending' },
];
