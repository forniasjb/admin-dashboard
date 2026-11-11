import { Box, Typography } from '@mui/material';

/** Page title + optional subtitle on the left, optional actions (buttons) on the right. */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Box
      className="page-header"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box className="no-print">{actions}</Box>}
    </Box>
  );
}
