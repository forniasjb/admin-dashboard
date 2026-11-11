import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { USER_ROLES, USER_STATUSES } from '../../api/usersData';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_USER = { name: '', email: '', role: 'Viewer', status: 'Invited' };

/**
 * Add / Edit user dialog. Pass "user" to edit, omit it to add.
 * "existingEmails" (lower-case) is used to reject duplicates. Mount it only while it is open so the form resets.
 */
export default function UserFormDialog({ user, existingEmails, onSave, onClose }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState(user ?? EMPTY_USER);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = {};
  if (!form.name.trim()) errors.name = 'Full name is required';
  const email = form.email.trim();
  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address';
  else if (existingEmails.includes(email.toLowerCase())) errors.email = 'This email is already in use';

  const showError = (field) => Boolean((submitted || touched[field]) && errors[field]);
  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSave({ ...form, name: form.name.trim(), email });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Edit user' : 'Add user'}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}>
          <TextField
            autoFocus
            required
            label="Full name"
            value={form.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            error={showError('name')}
            helperText={showError('name') ? errors.name : ' '}
            fullWidth
          />
          <TextField
            required
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={showError('email')}
            helperText={showError('email') ? errors.email : ' '}
            fullWidth
          />
          <TextField select label="Role" value={form.role} onChange={handleChange('role')} fullWidth>
            {USER_ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Status" value={form.status} onChange={handleChange('status')} fullWidth>
            {USER_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEdit ? 'Save changes' : 'Add user'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
