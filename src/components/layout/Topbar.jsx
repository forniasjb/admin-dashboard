import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { APP_NAME, TOPBAR_HEIGHT } from '../../utils/constants';

const NOTIFICATIONS = [
  'New order #10234 received',
  'Report RPT-004 failed to generate',
  'Maria Santos joined the team',
  'Server usage is above 80%',
];

/** Fixed top bar. "sidebarWidth" offsets it so it never overlaps the permanent drawer. */
export default function Topbar({ sidebarWidth, isMobile, onToggleSidebar }) {
  const navigate = useNavigate();
  const [userAnchor, setUserAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [search, setSearch] = useState('');

  const goTo = (path) => {
    setUserAnchor(null);
    navigate(path);
  };

  const handleLogout = () => {
    setUserAnchor(null);
    // TODO: clear auth state / tokens and redirect to the login page.
    console.info('Logout clicked');
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      className="no-print"
      sx={(theme) => ({
        width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
        ml: isMobile ? 0 : `${sidebarWidth}px`,
        height: TOPBAR_HEIGHT,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.shorter,
        }),
      })}
    >
      <Toolbar sx={{ minHeight: `${TOPBAR_HEIGHT}px !important`, gap: 1 }}>
        <IconButton edge="start" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap color="text.primary" sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
          {APP_NAME}
        </Typography>

        {/* Search bar */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            width: { sm: 200, md: 320 },
            px: 1.5,
            borderRadius: 3,
            bgcolor: (t) => alpha(t.palette.text.primary, 0.05),
            '&:focus-within': { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <InputBase
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputProps={{ 'aria-label': 'search' }}
            sx={{ ml: 1, flex: 1, height: 40 }}
          />
          {search && (
            <IconButton size="small" aria-label="Clear search" onClick={() => setSearch('')}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Notifications */}
        <IconButton aria-label="Notifications" onClick={(e) => setNotifAnchor(e.currentTarget)}>
          <Badge badgeContent={NOTIFICATIONS.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={() => setNotifAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {NOTIFICATIONS.map((n) => (
            <MenuItem key={n} onClick={() => setNotifAnchor(null)}>
              {n}
            </MenuItem>
          ))}
        </Menu>

        {/* User menu */}
        <IconButton aria-label="Account menu" onClick={(e) => setUserAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>JB</Avatar>
        </IconButton>
        <Menu
          anchorEl={userAnchor}
          open={Boolean(userAnchor)}
          onClose={() => setUserAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { sx: { minWidth: 180, mt: 1 } } }}
        >
          <MenuItem onClick={() => goTo('/settings')}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => goTo('/settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
