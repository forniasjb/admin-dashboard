import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h1" color="primary" fontWeight={800} sx={{ fontSize: { xs: 80, sm: 120 } }}>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Back to Dashboard
      </Button>
    </Box>
  );
}
