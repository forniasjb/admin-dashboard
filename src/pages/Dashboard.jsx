import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PercentIcon from '@mui/icons-material/Percent';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import EmptyState from '../components/common/EmptyState';
import TableSkeleton from '../components/common/TableSkeleton';
import {
  recentActivity,
  revenueOverTime,
  salesByCategory,
  statCards,
  trafficSources,
} from '../api/dashboardData';
import { formatCurrency, formatDate, formatNumber, statusColor } from '../utils/formatters';
import useDocumentTitle from '../utils/useDocumentTitle';
import useSimulatedLoading from '../utils/useSimulatedLoading';

const ICONS = {
  users: <PeopleIcon />,
  revenue: <AttachMoneyIcon />,
  orders: <ShoppingCartIcon />,
  conversion: <PercentIcon />,
};

const formatStatValue = ({ value, format }) => {
  if (format === 'currency') return formatCurrency(value);
  if (format === 'percent') return `${value}%`;
  return formatNumber(value);
};

/**
 * Card wrapper with a fixed-height area so Recharts' ResponsiveContainer can measure it.
 * Shows a skeleton while loading and an empty state when there is no data.
 */
function ChartCard({ title, children, height = 300, loading = false, empty = false }) {
  let content = (
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  );
  if (loading) content = <Skeleton variant="rounded" width="100%" height="100%" />;
  else if (empty) content = <EmptyState title="No data to display" description="There is nothing to chart yet." />;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent sx={{ pt: 0, height }}>{content}</CardContent>
    </Card>
  );
}

export default function Dashboard() {
  useDocumentTitle('Dashboard');
  const loading = useSimulatedLoading();
  const theme = useTheme();
  const pieColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." />

      {/* Stat cards: 1 column on mobile, 2 on tablet, 4 on desktop */}
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} lg={3} key={card.id}>
            <StatCard
              title={card.title}
              value={formatStatValue(card)}
              trend={card.trend}
              color={card.color}
              icon={ICONS[card.icon]}
            />
          </Grid>
        ))}

        {/* Revenue line chart */}
        <Grid item xs={12} lg={8}>
          <ChartCard title="Revenue Over Time (Last 6 Months)" loading={loading} empty={revenueOverTime.length === 0}>
            <LineChart data={revenueOverTime} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartCard>
        </Grid>

        {/* Traffic pie chart */}
        <Grid item xs={12} md={6} lg={4}>
          <ChartCard title="Traffic Sources" loading={loading} empty={trafficSources.length === 0}>
            <PieChart>
              <Pie data={trafficSources} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {trafficSources.map((entry, i) => (
                  <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatNumber(v)} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ChartCard>
        </Grid>

        {/* Sales bar chart */}
        <Grid item xs={12} md={6} lg={5}>
          <ChartCard title="Sales by Category" loading={loading} empty={salesByCategory.length === 0}>
            <BarChart data={salesByCategory} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(v) => formatNumber(v)} />
              <Bar dataKey="sales" name="Sales" fill={theme.palette.secondary.main} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartCard>
        </Grid>

        {/* Recent activity table (scrolls horizontally on small screens) */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Recent Activity" titleTypographyProps={{ variant: 'h6' }} />
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 520 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && <TableSkeleton rows={recentActivity.length || 5} columns={4} />}
                  {!loading &&
                    recentActivity.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{row.user}</TableCell>
                        <TableCell>{row.action}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(row.date)}</TableCell>
                        <TableCell>
                          <Chip size="small" label={row.status} color={statusColor(row.status)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  {!loading && recentActivity.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ borderBottom: 0 }}>
                        <EmptyState title="No recent activity" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
