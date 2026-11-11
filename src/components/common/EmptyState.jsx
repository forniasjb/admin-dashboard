import { Box, Button, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

/** Centered "nothing here" message with an optional action button. */
export default function EmptyState({ title, description, actionLabel, onAction, icon = <InboxIcon fontSize="large" /> }) {
  return (
    <Box sx={{ py: 5, px: 2, textAlign: 'center', color: 'text.secondary' }}>
      <Box sx={{ mb: 1, opacity: 0.6, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
      <Typography variant="subtitle1" color="text.primary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button size="small" variant="outlined" sx={{ mt: 2 }} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
