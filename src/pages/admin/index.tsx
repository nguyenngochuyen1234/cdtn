import * as React from 'react';
import { Avatar, Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Article, BarChart, AdminPanelSettings, Category, People, Settings, Logout } from '@mui/icons-material';
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
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
    { segment: '', title: 'Tổng quan', icon: <Dashboard /> },
    { segment: 'posts', title: 'Bài đăng', icon: <Article /> },
    { segment: 'statistics', title: 'Thống kê', icon: <BarChart /> },
    { segment: 'moderation', title: 'Kiểm duyệt', icon: <AdminPanelSettings /> },
    { segment: 'categories', title: 'Danh mục', icon: <Category /> },
    { segment: 'users', title: 'Người dùng', icon: <People /> },
    { segment: 'logout', title: 'Đăng xuất', icon: <Logout /> },
];

const AdminPage = () => {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate()

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
                            to={`http://localhost:5173/admin/${item.segment}`}
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
            <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, height:"100vh" }}>
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
export default AdminPage