import React, { useState, useEffect } from 'react';
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
    CircularProgress,
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/admin/Header';
import {
    AdminPanelSettings,
    Category,
    Dashboard,
    Logout,
    People,
    Lock,
    AccountCircle,
} from '@mui/icons-material';
import axios from 'axios';
import userApi from '@/api/userApi';

// Navigation Menu
const NAVIGATION = [
    { segment: '', title: 'Tổng quan', icon: <Dashboard sx={{ color: '#4CAF50' }} /> },
    {
        segment: 'moderation',
        title: 'Quản lý cửa hàng',
        icon: <AdminPanelSettings sx={{ color: '#FF9800' }} />,
    },
    { segment: 'categories', title: 'Danh mục', icon: <Category sx={{ color: '#2196F3' }} /> },
    { segment: 'users', title: 'Người dùng', icon: <People sx={{ color: '#9C27B0' }} /> },
    { segment: 'advertisement', title: 'Quảng cáo', icon: <Category sx={{ color: '#F44336' }} /> },
    {
        segment: 'user-page',
        title: 'Trang người dùng',
        icon: <AccountCircle sx={{ color: '#009688' }} />,
    },
];

const AdminPage = () => {
    const [open, setOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userApi.getUser();
                setUser(response.data.data);
            } catch (err) {
                // setError('Không thể tải thông tin người dùng');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const toggleSidebar = () => setOpen(!open);

    const handleNavigation = (segment) => {
        if (segment === 'logout') {
            localStorage.removeItem('token');
            sessionStorage.clear();
            navigate('/auth/login');
        } else if (segment === 'user-page') {
            navigate('/');
        } else {
            navigate(`/admin/${segment}`);
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
                                    {loading ? (
                                        <CircularProgress size={20} />
                                    ) : error ? (
                                        <Typography variant="subtitle2" color="error">
                                            {error}
                                        </Typography>
                                    ) : (
                                        <>
                                            <Typography variant="subtitle2">
                                                {user?.firstName && user?.lastName
                                                    ? `${user.firstName} ${user.lastName}`
                                                    : 'Bảo Đức'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Quản trị viên
                                            </Typography>
                                        </>
                                    )}
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
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? '#1976d2' : '#757575', // Active: blue, Inactive: grey
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItem>
                        );
                    })}
                    {/* Logout Item */}
                    {/* <ListItem
                        onClick={() => handleNavigation('logout')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 20px',
                            textDecoration: 'none',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: '#757575' }}>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Đăng xuất" />
                    </ListItem> */}
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
