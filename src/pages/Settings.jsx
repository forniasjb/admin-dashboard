import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  Snackbar,
  Switch,
  TextField,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PageHeader from '../components/common/PageHeader';
import useDocumentTitle from '../utils/useDocumentTitle';
import { useUnsavedChanges } from '../utils/unsavedChanges';

const DEFAULT_SETTINGS = {
  name: 'Juan Bautista',
  email: 'juan.bautista@example.com',
  emailNotifications: true,
  weeklyDigest: false,
  securityAlerts: true,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ name, email }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Full name is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address';
  return errors;
};

export default function Settings() {
  useDocumentTitle('Settings');
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [savedForm, setSavedForm] = useState(DEFAULT_SETTINGS); // last saved values, used to detect changes
  const [touched, setTouched] = useState({});
  const [saved, setSaved] = useState(false);

  const errors = validate(form);
  const dirty = Object.keys(DEFAULT_SETTINGS).some((key) => form[key] !== savedForm[key]);
  useUnsavedChanges(dirty);

  const showError = (field) => Boolean(touched[field] && errors[field]);

  const handleText = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleSwitch = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.checked }));
  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const handleSave = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true });
    if (Object.keys(errors).length > 0) return;
    // TODO: send "form" to the backend.
    setSavedForm(form);
    setSaved(true);
  };

  const handleDiscard = () => {
    setForm(savedForm);
    setTouched({});
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Update your profile and notification preferences." />

      <Box component="form" noValidate onSubmit={handleSave}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Profile" titleTypographyProps={{ variant: 'h6' }} />
              <Divider />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Full name"
                  value={form.name}
                  onChange={handleText('name')}
                  onBlur={handleBlur('name')}
                  error={showError('name')}
                  helperText={showError('name') ? errors.name : ' '}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleText('email')}
                  onBlur={handleBlur('email')}
                  error={showError('email')}
                  helperText={showError('email') ? errors.email : ' '}
                  fullWidth
                  required
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Notifications" titleTypographyProps={{ variant: 'h6' }} />
              <Divider />
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormControlLabel
                  control={<Switch checked={form.emailNotifications} onChange={handleSwitch('emailNotifications')} />}
                  label="Email notifications"
                />
                <FormControlLabel
                  control={<Switch checked={form.weeklyDigest} onChange={handleSwitch('weeklyDigest')} />}
                  label="Weekly digest"
                />
                <FormControlLabel
                  control={<Switch checked={form.securityAlerts} onChange={handleSwitch('securityAlerts')} />}
                  label="Security alerts"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', gap: 1.5 }}>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={!dirty}>
              Save Changes
            </Button>
            {dirty && (
              <Button variant="outlined" onClick={handleDiscard}>
                Discard
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)}>
        <Alert severity="success" variant="filled" onClose={() => setSaved(false)}>
          Settings saved
        </Alert>
      </Snackbar>
    </>
  );
}
