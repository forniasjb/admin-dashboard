import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ROUTE_LABELS } from '../../utils/constants';

/** "Dashboard / Reports" trail above the page content. Hidden on the dashboard and on unknown routes (404). */
export default function PageBreadcrumbs() {
  const { pathname } = useLocation();
  const label = ROUTE_LABELS[pathname];
  if (!label) return null;

  return (
    <Breadcrumbs
      className="no-print"
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 1.5 }}
    >
      <Link component={RouterLink} to="/" underline="hover" color="text.secondary" variant="body2">
        Dashboard
      </Link>
      <Typography variant="body2" color="text.primary" aria-current="page">
        {label}
      </Typography>
    </Breadcrumbs>
  );
}
