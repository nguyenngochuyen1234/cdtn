import * as React from 'react';
import {
    Avatar,
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Dashboard,
    Article,
    BarChart,
    AdminPanelSettings,
    RateReview,
    DesignServices,
    Business,
    Person,
} from '@mui/icons-material';
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/admin/Header';

// Tạo Theme cho MUI
const demoTheme = {
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
};

// Navigation Menu
const NAVIGATION = [
    { segment: 'profile', title: 'Thông tin cá nhân', icon: <Person /> },
    { segment: 'business-info', title: 'Thông tin doanh nghiệp', icon: <Business /> },
    { segment: 'services', title: 'Danh sách dịch vụ', icon: <DesignServices /> },
    { segment: 'statistics', title: 'Thống kê', icon: <BarChart /> },
    { segment: 'reviews', title: 'Quản lý danh sách đánh giá', icon: <RateReview /> },
];
const AdminPage = () => {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();

    // Hàm toggle mở/đóng sidebar
    const toggleSidebar = () => setOpen(!open);

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
                    {NAVIGATION.map((item) => (
                        <ListItem
                            key={item.segment}
                            component={Link}
                            to={`http://localhost:5173/owner/${item.segment}`}
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
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, minHeight: '100vh' }}>
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
