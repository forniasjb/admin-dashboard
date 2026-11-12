import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Toolbar, Tooltip, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { APP_NAME, DRAWER_COLLAPSED_WIDTH, DRAWER_WIDTH, TOPBAR_HEIGHT } from '../../utils/constants';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Reports', path: '/reports', icon: <BarChartIcon /> },
  { label: 'Generate Reports', path: '/report-generation', icon: <PictureAsPdfIcon /> },
  { label: 'Users', path: '/users', icon: <PeopleIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

/** Contents shared by the permanent (desktop/tablet) and temporary (mobile) drawers. */
function SidebarContent({ collapsed, onNavigate }) {
  const { pathname } = useLocation();

  const isActive = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

  return (
    <>
      {/* Logo */}
      <Toolbar
        sx={{
          minHeight: `${TOPBAR_HEIGHT}px !important`,
          px: collapsed ? 0 : 2.5,
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 1.5,
        }}
      >
        <Box component="img" src={logo} alt={APP_NAME} sx={{ width: 36, height: 36, flexShrink: 0 }} />
        {!collapsed && (
          <Typography variant="h6" noWrap color="primary" fontWeight={700}>
            {APP_NAME}
          </Typography>
        )}
      </Toolbar>

      {/* Navigation */}
      <List sx={{ px: 1.5, pt: 2 }}>
        {NAV_ITEMS.map(({ label, path, icon }) => {
          const active = isActive(path);
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5, display: 'block' }}>
              <Tooltip title={collapsed ? label : ''} placement="right" arrow>
                <ListItemButton
                  component={NavLink}
                  to={path}
                  end={path === '/'}
                  selected={active}
                  onClick={onNavigate}
                  sx={{
                    minHeight: 46,
                    borderRadius: 2,
                    px: collapsed ? 0 : 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: 'center',
                      color: active ? 'inherit' : 'text.secondary',
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 600, noWrap: true }} />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}

/**
 * Sidebar
 * - Desktop/tablet: permanent drawer that animates between 260px and 70px.
 * - Mobile: temporary drawer with overlay.
 */
export default function Sidebar({ collapsed, isMobile, mobileOpen, onMobileClose }) {
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }} // better open performance on mobile
        PaperProps={{ className: 'no-print' }}
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
      >
        <SidebarContent collapsed={false} onNavigate={onMobileClose} />
      </Drawer>
    );
  }

  const width = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      className="no-print"
      sx={(theme) => ({
        width,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.shorter,
        }),
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
        },
      })}
    >
      <SidebarContent collapsed={collapsed} />
    </Drawer>
  );
}
