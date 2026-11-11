import { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Outlet, useBlocker } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageBreadcrumbs from './PageBreadcrumbs';
import { DRAWER_COLLAPSED_WIDTH, DRAWER_WIDTH, TOPBAR_HEIGHT } from '../../utils/constants';
import { UnsavedChangesContext } from '../../utils/unsavedChanges';

const SIDEBAR_KEY = 'sidebarCollapsed';

const readStoredCollapsed = () => {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === 'true';
  } catch {
    return false;
  }
};

const storeCollapsed = (value) => {
  try {
    localStorage.setItem(SIDEBAR_KEY, String(value));
  } catch {
    // Storage unavailable (e.g. private mode): the preference just isn't remembered.
  }
};

/**
 * App shell: sidebar + topbar + routed page content (<Outlet />).
 * - Mobile (< md): temporary drawer opened by the hamburger button.
 * - Tablet (md – lg): sidebar auto-collapses to icons.
 * - Desktop (>= lg): full sidebar, collapsible manually (the choice is remembered in localStorage).
 * - Pages can flag unsaved changes with useUnsavedChanges(); any navigation away (links, Back/Forward,
 *   navigate()) then asks for confirmation, and closing or reloading the tab shows the browser warning.
 */
export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [collapsed, setCollapsed] = useState(() => isTablet || readStoredCollapsed());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Blocks navigation to a different page while there are unsaved changes.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname,
  );

  // Collapse automatically on tablet, restore the saved preference on desktop.
  useEffect(() => {
    setCollapsed(isTablet || readStoredCollapsed());
  }, [isTablet]);

  // Make sure the mobile drawer is closed when leaving the mobile breakpoint.
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  // Warn before the tab is closed or reloaded with unsaved changes.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen((open) => !open);
      return;
    }
    const next = !collapsed;
    setCollapsed(next);
    if (!isTablet) storeCollapsed(next);
  };

  const confirmLeave = () => {
    setMobileOpen(false);
    blocker.proceed?.();
  };

  const sidebarWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <UnsavedChangesContext.Provider value={setDirty}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Topbar sidebarWidth={sidebarWidth} isMobile={isMobile} onToggleSidebar={handleToggle} />

        <Sidebar
          collapsed={collapsed}
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0, // lets wide children (tables) scroll instead of stretching the layout
            mt: `${TOPBAR_HEIGHT}px`,
            p: { xs: 2, sm: 3 },
            bgcolor: 'background.default',
            minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          }}
        >
          <PageBreadcrumbs />
          <Outlet />
        </Box>
      </Box>

      <Dialog open={blocker.state === 'blocked'} onClose={() => blocker.reset?.()}>
        <DialogTitle>Leave this page?</DialogTitle>
        <DialogContent>
          <DialogContentText>You have unsaved changes. If you leave now, they will be lost.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => blocker.reset?.()}>Stay</Button>
          <Button color="error" variant="contained" onClick={confirmLeave}>
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </UnsavedChangesContext.Provider>
  );
}
