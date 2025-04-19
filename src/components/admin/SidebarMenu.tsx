import { useState } from 'react';
import {
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from '@mui/material';
import {
    Dashboard,
    Article,
    BarChart,
    AdminPanelSettings,
    Category,
    People,
    Settings,
    Logout,
} from '@mui/icons-material';
import { SearchBar } from './searchBar';
import { MenuAdminItem } from '@/models';
import { colors } from '@/themes/colors';
import { useNavigate } from 'react-router-dom';
import { logoutAPI } from '@/utils/JwtService';

// Import the logoutAPI function

const DRAWER_WIDTH = 280;

const MENU_ITEMS: MenuAdminItem[] = [
    { key: 'overview', label: 'Tổng quan', icon: <Dashboard />, path: '/' },
    { key: 'posts', label: 'Bài đăng', icon: <Article />, path: '/posts' },
    { key: 'statistics', label: 'Thống kê', icon: <BarChart />, path: '/statistics' },
    { key: 'moderation', label: 'Kiểm duyệt', icon: <AdminPanelSettings />, path: '/moderation' },
    { key: 'categories', label: 'Danh mục', icon: <Category />, path: '/categories' },
    { key: 'users', label: 'Người dùng', icon: <People />, path: '/users' },
];

const BOTTOM_MENU_ITEMS: MenuAdminItem[] = [
    { key: 'logout', label: 'Đăng xuất', icon: <Logout />, path: '/logout' },
];

export function SidebarMenu() {
    const theme = useTheme();
    const [selectedKey, setSelectedKey] = useState('overview');
    const navigate = useNavigate();

    // Handle logout action
    const handleLogout = () => {
        setSelectedKey('logout'); // Update selected state for UI consistency
        logoutAPI(navigate); // Call the logoutAPI function
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    borderRight: `1px solid ${theme.palette.divider}`,
                },
            }}
        >
            <Button onClick={() => navigate('/')}>
                <Typography variant="h4" fontWeight="bold">
                    Logo
                </Typography>
            </Button>

            <Box sx={{ overflow: 'auto', flex: 1 }}>
                <List>
                    {MENU_ITEMS.map((item) => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton
                                selected={selectedKey === item.key}
                                onClick={() => {
                                    setSelectedKey(item.key);
                                    navigate(`/admin${item.path}`);
                                }}
                                sx={{
                                    mx: 1,
                                    borderRadius: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: 'secondary.main',
                                        color: 'secondary.contrastText',
                                        '&:hover': {
                                            backgroundColor: 'secondary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'inherit',
                                        },
                                    },
                                    '&:not(.Mui-selected)': {
                                        color: 'secondary.dark',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color:
                                            selectedKey === item.key ? 'white' : 'secondary.dark',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        style: {
                                            color: selectedKey === item.key ? '#fff' : '#202224',
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ mt: 'auto' }}>
                <List>
                    {BOTTOM_MENU_ITEMS.map((item) => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton
                                selected={selectedKey === item.key}
                                onClick={() => {
                                    if (item.key === 'logout') {
                                        handleLogout(); // Call logout handler for logout item
                                    } else {
                                        setSelectedKey(item.key);
                                        navigate(`/admin${item.path}`);
                                    }
                                }}
                                sx={{
                                    mx: 1,
                                    borderRadius: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: 'secondary.main',
                                        color: 'secondary.contrastText',
                                        '&:hover': {
                                            backgroundColor: 'secondary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'inherit',
                                        },
                                    },
                                    '&:not(.Mui-selected)': {
                                        color: 'secondary.dark',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        style: {
                                            color: selectedKey === item.key ? '#fff' : '#202224',
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}
