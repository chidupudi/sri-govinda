// src/components/dashboard/DashboardLayout.js
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  Paper,
  Collapse,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  MoneyOff as MoneyOffIcon,
  PointOfSale as PointOfSaleIcon,
  Assessment as AssessmentIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { logoutUser } from '../../features/auth/authSlice';

const drawerWidth = 280;

const menuItems = [
  { 
    path: '/', 
    label: 'Dashboard', 
    icon: <DashboardIcon />,
    color: '#1976d2'
  },
  { 
    path: '/products', 
    label: 'Products', 
    icon: <InventoryIcon />,
    color: '#9c27b0'
  },
  { 
    path: '/customers', 
    label: 'Customers', 
    icon: <PeopleIcon />,
    color: '#2e7d32'
  },
  { 
    path: '/billing', 
    label: 'Billing', 
    icon: <PointOfSaleIcon />,
    color: '#ed6c02'
  },
  { 
    path: '/orders', 
    label: 'Orders', 
    icon: <ReceiptIcon />,
    color: '#0288d1'
  },
  { 
    path: '/expenses', 
    label: 'Expenses', 
    icon: <MoneyOffIcon />,
    color: '#d32f2f'
  },
  { 
    path: '/reports', 
    label: 'Reports', 
    icon: <AssessmentIcon />,
    color: '#7b1fa2'
  },
];

const DashboardLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [reportsExpanded, setReportsExpanded] = useState(false);

  const { user } = useSelector(state => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleProfileMenuClose();
  };

  const handleReportsToggle = () => {
    setReportsExpanded(!reportsExpanded);
  };

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 80
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StoreIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
              Sri Govinda
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              POS System
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main,
              width: 40,
              height: 40,
              fontSize: '1.2rem'
            }}
          >
            {(user?.displayName || user?.email)?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user?.displayName || 'User'}
            </Typography>
            <Typography 
              variant="caption" 
              color="textSecondary"
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block'
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <React.Fragment key={item.path}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => {
                    if (isMobile) handleDrawerToggle();
                    if (item.label === 'Reports') handleReportsToggle();
                  }}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    ...(isActive ? {
                      backgroundColor: alpha(item.color, 0.12),
                      color: item.color,
                      boxShadow: `0 2px 8px ${alpha(item.color, 0.3)}`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        backgroundColor: item.color,
                        borderRadius: '0 4px 4px 0'
                      },
                      '& .MuiListItemIcon-root': {
                        color: item.color,
                        transform: 'scale(1.1)'
                      },
                      '& .MuiListItemText-primary': {
                        fontWeight: 600
                      }
                    } : {
                      '&:hover': {
                        backgroundColor: alpha(item.color, 0.08),
                        transform: 'translateX(4px)',
                        '& .MuiListItemIcon-root': {
                          color: item.color,
                          transform: 'scale(1.05)'
                        }
                      }
                    })
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      transition: 'all 0.3s ease',
                      color: isActive ? item.color : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400
                    }}
                  />
                  {item.label === 'Reports' && (
                    reportsExpanded ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>

              {/* Sub-menu for Reports */}
              {item.label === 'Reports' && (
                <Collapse in={reportsExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {[
                      { path: '/reports/sales', label: 'Sales Report', icon: <TrendingUpIcon /> },
                      { path: '/reports/inventory', label: 'Inventory', icon: <InventoryIcon /> },
                      { path: '/reports/customers', label: 'Customers', icon: <PeopleIcon /> },
                      { path: '/reports/expenses', label: 'Expenses', icon: <MoneyOffIcon /> }
                    ].map((subItem) => (
                      <ListItem key={subItem.path} disablePadding>
                        <ListItemButton
                          component={Link}
                          to={subItem.path}
                          sx={{
                            pl: 6,
                            py: 1,
                            mx: 2,
                            borderRadius: 1,
                            fontSize: '0.85rem',
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05)
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={subItem.label}
                            primaryTypographyProps={{ fontSize: '0.85rem' }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="textSecondary" align="center" display="block">
          Version 1.0.0
        </Typography>
        <Typography variant="caption" color="textSecondary" align="center" display="block">
          © 2024 Sri Govinda
        </Typography>
      </Box>
    </Box>
  );

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationOpen = Boolean(notificationAnchor);

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id="profile-menu"
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleProfileMenuClose}
      PaperProps={{
        elevation: 8,
        sx: {
          mt: 1,
          minWidth: 200,
          borderRadius: 2,
          '& .MuiMenuItem-root': {
            py: 1.5,
            px: 2
          }
        }
      }}
    >
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <Box>
          <Typography variant="subtitle2">Profile</Typography>
          <Typography variant="caption" color="textSecondary">
            Manage your account
          </Typography>
        </Box>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <Box>
          <Typography variant="subtitle2">Settings</Typography>
          <Typography variant="caption" color="textSecondary">
            App preferences
          </Typography>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <Box>
          <Typography variant="subtitle2">Logout</Typography>
          <Typography variant="caption" color="textSecondary">
            Sign out of your account
          </Typography>
        </Box>
      </MenuItem>
    </Menu>
  );

  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationOpen}
      onClose={handleNotificationMenuClose}
      PaperProps={{
        elevation: 8,
        sx: {
          mt: 1,
          minWidth: 320,
          maxWidth: 400,
          borderRadius: 2
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Notifications</Typography>
      </Box>
      <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">Low Stock Alert</Typography>
            <Typography variant="body2" color="textSecondary">
              5 products are running low on stock
            </Typography>
            <Typography variant="caption" color="textSecondary">
              2 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">New Order</Typography>
            <Typography variant="body2" color="textSecondary">
              Order #ORD-1234 has been placed
            </Typography>
            <Typography variant="caption" color="textSecondary">
              1 day ago
            </Typography>
          </Box>
        </MenuItem>
      </Box>
      <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
          View All Notifications
        </Typography>
      </Box>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          color: theme.palette.text.primary,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                {getPageTitle()}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Quick Actions */}
            <Tooltip title="New Sale">
              <IconButton 
                color="primary"
                onClick={() => navigate('/billing')}
                sx={{ 
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2)
                  }
                }}
              >
                <PointOfSaleIcon />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationMenuOpen}
              >
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile */}
            <Tooltip title="Account">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    width: 36, 
                    height: 36,
                    fontSize: '1rem'
                  }}
                >
                  {(user?.displayName || user?.email)?.charAt(0)?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {renderProfileMenu}
      {renderNotificationMenu}

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 } 
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                width: drawerWidth, 
                boxSizing: 'border-box',
                backgroundImage: 'none'
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                width: drawerWidth, 
                boxSizing: 'border-box',
                borderRight: `1px solid ${theme.palette.divider}`,
                backgroundImage: 'none'
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        <Toolbar />
        <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;