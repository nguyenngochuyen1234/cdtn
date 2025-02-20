import {
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { AccountCircle, Article, ChevronRight, HelpOutline, Logout } from '@mui/icons-material';
import { MenuItem, User } from '@/models';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';

interface ProfileMenuProps {
    user: User;
    onMenuItemClick: (item: MenuItem) => void;
}

export default function ProfileMenu({ user, onMenuItemClick }: ProfileMenuProps) {
    const dispatch = useDispatch();

    const handleMenuItemClick = (item: MenuItem) => {
        if (item.id === 'logout') {
            localStorage.clear();
            sessionStorage.clear();
            dispatch(setUser(null));
        }
        onMenuItemClick(item);
    };

    const menuItems = [
        {
            id: 'account',
            label: 'Tài khoản',
            icon: <AccountCircle sx={{ color: '#000' }} />,
            link: '/profile',
        },
        {
            id: 'posts',
            label: 'Bài viết của bạn',
            icon: <Article sx={{ color: '#000' }} />,
            link: '/',
        },
        {
            id: 'support',
            label: 'Hỗ trợ',
            icon: <HelpOutline sx={{ color: '#000' }} />,
            link: '/',
        },
        {
            id: 'logout',
            label: 'Đăng xuất',
            icon: <Logout sx={{ color: '#000' }} />,
            link: '/',
        },
    ];

    return (
        <Paper sx={{ width: '100%', maxWidth: 360 }}>
            <List disablePadding>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography variant="subtitle1" fontWeight={500}>
                                {user.username}
                            </Typography>
                        }
                        secondary={
                            <Box
                                component="span"
                                sx={{ color: user.statusUser ? 'success.main' : 'text.secondary' }}
                            >
                                {user.statusUser ? 'Online' : 'Offline'}
                            </Box>
                        }
                    />
                </ListItem>

                <Divider />

                {menuItems.map((item) => (
                    <ListItemButton
                        sx={{ color: '#000' }}
                        key={item.id}
                        onClick={() => handleMenuItemClick(item)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{ sx: { color: '#000' } }}
                            primary={item.label}
                        />
                        <ChevronRight sx={{ color: '#000' }} />
                    </ListItemButton>
                ))}
            </List>
        </Paper>
    );
}
