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
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/admin/Header';
import {
    Dashboard,
    Person,
    Business,
    RoomService,
    AccessTime,
    RateReview,
    Lock,
    AccountCircle,
    AdUnits,
} from '@mui/icons-material';
import { HistoryIcon } from 'lucide-react';

// Navigation Menu
const NAVIGATION = [
    { segment: '', title: 'Tổng quan', icon: <Dashboard sx={{ color: '#4CAF50' }} /> },

    {
        segment: 'services',
        title: 'Danh sách dịch vụ',
        icon: <RoomService sx={{ color: '#FF9800' }} />,
    },

    {
        segment: 'reviews',
        title: 'Quản lý danh sách đánh giá',
        icon: <RateReview sx={{ color: '#009688' }} />,
    },
    {
        segment: 'advertisement',
        title: 'Quản lý gói quảng cáo',
        icon: <AdUnits sx={{ color: '#009688' }} />,
    },
    {
        segment: 'history',
        title: 'Lịch sử giao dịch',
        icon: <HistoryIcon />,
    },
    { segment: 'profile', title: 'Thông tin cá nhân', icon: <Person sx={{ color: '#9C27B0' }} /> },
    {
        segment: 'business-info',
        title: 'Thông tin doanh nghiệp',
        icon: <Business sx={{ color: '#FF9888' }} />,
    },
    {
        segment: 'opening-hours',
        title: 'Giờ mở cửa',
        icon: <AccessTime sx={{ color: '#F44336' }} />,
    },
    { segment: 'user-page', title: 'Trang người dùng', icon: <AccountCircle /> },
];

const AdminPage = () => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation(); // To track the current route

    const toggleSidebar = () => setOpen(!open);

    const handleNavigation = (segment: string) => {
        if (segment === 'user-page') {
            navigate('/'); // Navigate to root URL (http://localhost:5173/)
        } else {
            navigate(`/owner/${segment}`); // Navigate to owner routes
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
                    {/* <ListItem sx={{ padding: '10px 20px' }}>
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
                    </ListItem> */}

                    {/* Navigation Items */}
                    {NAVIGATION.map((item) => {
                        const isActive =
                            location.pathname === `/owner/${item.segment}` ||
                            (item.segment === '' && location.pathname === '/owner') ||
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
