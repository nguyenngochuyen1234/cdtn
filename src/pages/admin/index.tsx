import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Stack,
    Avatar,
    Typography,
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/admin/Header';
import {
    AdminPanelSettings,
    Category,
    Dashboard,
    Logout,
    People,
    Lock, // For change password
    AccountCircle, // For user page
} from '@mui/icons-material';

// Updated Navigation Menu
const NAVIGATION = [
    { segment: '', title: 'Tổng quan', icon: <Dashboard /> },
    { segment: 'moderation', title: 'Kiểm duyệt', icon: <AdminPanelSettings /> },
    { segment: 'categories', title: 'Danh mục', icon: <Category /> },
    { segment: 'users', title: 'Người dùng', icon: <People /> },
    { segment: 'advertisement', title: 'Quảng cáo', icon: <Category /> },
    { segment: 'change-password', title: 'Đổi mật khẩu', icon: <Lock /> },
    { segment: 'user-page', title: 'Trang người dùng', icon: <AccountCircle /> },
];

const AdminPage = () => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation(); // To track the current route

    const toggleSidebar = () => setOpen(!open);

    const handleNavigation = (segment: string) => {
        if (segment === 'logout') {
            localStorage.removeItem('token');
            sessionStorage.clear();
            navigate('/auth/login');
        } else if (segment === 'user-page') {
            navigate('/'); // Navigate to root URL (http://localhost:5173/)
        } else {
            navigate(`/admin/${segment}`); // Navigate to admin routes
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <List>
                    {/* User Info */}
                    <ListItem sx={{ padding: '10px 20px' }}>
                        <Stack flexDirection="row" sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar
                                    src="/placeholder.svg?height=32&width=32"
                                    alt="User Avatar"
                                    sx={{ width: 32, height: 32 }}
                                />
                                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <Typography variant="subtitle2">User A</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Quản trị
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </ListItem>

                    {/* Navigation Items */}
                    {NAVIGATION.map((item) => {
                        const isActive =
                            location.pathname === `/admin/${item.segment}` ||
                            (item.segment === '' && location.pathname === '/admin') ||
                            (item.segment === 'user-page' && location.pathname === '/');
                        return (
                            <ListItem
                                key={item.segment}
                                onClick={() => handleNavigation(item.segment)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px 20px',
                                    textDecoration: 'none',
                                    backgroundColor: isActive ? '#E6E8EA' : 'inherit',
                                    color: isActive ? '#1976d2' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: isActive ? '#E6E8EA' : '#f0f0f0',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? '#1976d2' : 'inherit' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>
            <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
                <AppBar position="fixed" sx={{ width: `calc(100% - 240px)`, ml: '240px' }}>
                    <Header />
                </AppBar>

                <Box component="main" sx={{ pt: 8 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminPage;
