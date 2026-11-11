import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

/**
 * Metric card with a colored icon and a trend indicator.
 * Props: title, value (already formatted), icon (element), color (theme palette key), trend (%, optional)
 */
export default function StatCard({ title, value, icon, color = 'primary', trend }) {
  const hasTrend = typeof trend === 'number';
  const positive = hasTrend && trend >= 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, mb: 1.5 }}>
            {value}
          </Typography>
          {hasTrend && (
            <Chip
              size="small"
              color={positive ? 'success' : 'error'}
              variant="outlined"
              icon={positive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${positive ? '+' : ''}${trend}%`}
            />
          )}
        </Box>

        <Box
          sx={{
            width: 52,
            height: 52,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            color: `${color}.main`,
            bgcolor: (t) => `${t.palette[color].main}1A`, // ~10% opacity tint
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
}
