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
import { getAvatarByToken, getLastNameByToken, logoutAPI } from '@/utils/JwtService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

interface ProfileMenuProps {
    user: User;
    onMenuItemClick: (item: MenuItem) => void;
}

export default function ProfileMenu({ user, onMenuItemClick }: ProfileMenuProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook for navigation

    const handleMenuItemClick = (item: MenuItem) => {
        if (item.id === 'logout') {
            // Call logoutAPI instead of manual logout logic
            logoutAPI(navigate);
            // Dispatch setUser(null) is already handled in logoutAPI (if needed)
            // localStorage and sessionStorage clearing is handled in logoutAPI
        } else {
            onMenuItemClick(item);
        }
    };

    const menuItems = [
        {
            id: 'account',
            label: 'Tài khoản',
            icon: <AccountCircle sx={{ color: '#000' }} />,
            link: '/profile',
        },
        {
            id: 'logout',
            label: 'Đăng xuất',
            icon: <Logout sx={{ color: '#000' }} />,
            link: '/', // This will be overridden by logoutAPI
        },
    ];

    return (
        <Paper sx={{ width: '100%', maxWidth: 360 }}>
            <List disablePadding>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar
                            src={
                                getAvatarByToken() ||
                                'http://res.cloudinary.com/dbk09oy6h/image/upload/v1745074840/IMAGE_USER/68036fd9e50e7d57aa4b353e/1745074841434.png.png'
                            }
                            sx={{ width: 40, height: 40 }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography variant="subtitle1" fontWeight={500}>
                                {getLastNameByToken()}
                            </Typography>
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
