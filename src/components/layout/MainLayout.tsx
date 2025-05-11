import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store';
import { UserRole } from '../../types';

const drawerWidth = 240;

const MainLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await dispatch(logout());
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      roles: [UserRole.ADMIN, UserRole.AGENT],
    },
    {
      text: 'Tickets',
      icon: <AssignmentIcon />,
      path: '/tickets',
      roles: [UserRole.ADMIN, UserRole.AGENT, UserRole.CUSTOMER],
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/users',
      roles: [UserRole.ADMIN],
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      roles: [UserRole.ADMIN],
    },
  ];

  const filteredNavItems = navigationItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const drawer = (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'space-between' : 'center',
          p: 2,
        }}
      >
        <Typography variant='h6' fontWeight='bold' noWrap>
          Support System
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />

      <List>
        {filteredNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path)
                    ? 'primary.contrastText'
                    : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          fullWidth
          onClick={() => handleNavigate('/tickets/new')}
        >
          New Ticket
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position='fixed'
        sx={{
          width: { md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: drawerOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/tickets' && 'Tickets'}
            {location.pathname === '/users' && 'Users'}
            {location.pathname === '/settings' && 'Settings'}
            {location.pathname.startsWith('/tickets/') &&
              location.pathname !== '/tickets/new' &&
              'Ticket Details'}
            {location.pathname === '/tickets/new' && 'New Ticket'}
          </Typography>

          <IconButton color='inherit' onClick={handleNotificationMenuOpen}>
            <Badge badgeContent={unreadCount} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationMenuAnchorEl}
            open={Boolean(notificationMenuAnchorEl)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { width: 320, maxHeight: 500, mt: 1 },
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant='subtitle1' fontWeight='bold'>
                Notifications
              </Typography>
              <Button size='small'>Mark all as read</Button>
            </Box>
            <Divider />
            <MenuItem>
              <Box sx={{ width: '100%' }}>
                <Typography variant='body2' fontWeight='bold'>
                  New ticket assigned to you
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  5 minutes ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box sx={{ width: '100%' }}>
                <Typography variant='body2' fontWeight='bold'>
                  Ticket #1234 has been updated
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  2 hours ago
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size='small' onClick={() => navigate('/notifications')}>
                View All Notifications
              </Button>
            </Box>
          </Menu>

          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Typography
              variant='body1'
              sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}
            >
              {user?.name || 'User'}
            </Typography>
            <IconButton
              onClick={handleUserMenuOpen}
              color='inherit'
              sx={{ p: 0 }}
            >
              <Avatar
                alt={user?.name || 'User'}
                src={user?.avatar}
                sx={{ width: 32, height: 32 }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleUserMenuClose();
                navigate('/profile');
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Profile' />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Logout' />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component='nav'
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={drawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          // ml: { md: drawerOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: '54px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
