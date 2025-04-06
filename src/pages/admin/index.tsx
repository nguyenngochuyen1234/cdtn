import { Header } from '@/components/admin/Header';
import {
    AdminPanelSettings,
    BarChart,
    Category,
    Dashboard,
    Logout,
    People,
} from '@mui/icons-material';
import { AppBar, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import * as React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
const NAVIGATION = [
    { segment: '', title: 'Tổng quan', icon: <Dashboard /> },
    { segment: 'statistics', title: 'Thống kê', icon: <BarChart /> },
    { segment: 'moderation', title: 'Kiểm duyệt', icon: <AdminPanelSettings /> },
    { segment: 'categories', title: 'Danh mục', icon: <Category /> },
    { segment: 'users', title: 'Người dùng', icon: <People /> },
    { segment: 'advertisement', title: 'Quảng cáo', icon: <Category /> },

    { segment: 'logout', title: 'Đăng xuất', icon: <Logout /> },
];

const AdminPage = () => {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();

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
                            onClick={() => {
                                if (item.segment === 'logout') {
                                    localStorage.removeItem('token');
                                    sessionStorage.clear();

                                    navigate(`/auth/login`);
                                } else {
                                    navigate(`/admin/${item.segment}`);
                                }
                            }}
                            // to={`http://localhost:5173/admin/${item.segment}`}
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
            <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, height: '100vh' }}>
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
