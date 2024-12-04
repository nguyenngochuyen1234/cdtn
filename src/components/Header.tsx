import logo from '@/assets/images/logo.svg';
import { Avatar, Box, Button, Divider, Stack, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import { colors } from '@/themes/colors';
import { deepOrange } from '@mui/material/colors';
import { useState } from 'react';
import ProfileMenu from './user/ProfilteMenu';
import { MenuItem, User } from '@/models';

export const HeaderComponent = () => {
    const handleSearch = (value: string) => {
        console.log('Search:', value);
    };
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();
    const user: User = {
        id: "user001",
        username: "coffeelover99",
        avatar: "https://source.unsplash.com/random/100x100?person",
        email: "coffeelover99@example.com",
        role: ["user"],
        phone: "0123456789",
        statusUser: "ACTIVE",
        city: "Ho Chi Minh City",
        district: "District 1",
        ward: "Ward 4",
        ratingUser: 4.7,
        quantityImage: 10,
        helpful: 120,
        notLike: 5,
        like: 200,
        firstName: "Linh",
        lastName: "Nguyen",
        activeCode: "ABC123",
        dateOfBirth: new Date("1995-08-12"),
    };
    const handelNavigate = (item: MenuItem) => {
        setOpenMenu(false);
        navigate(item.link);
    };

    return (
        <Box
            sx={{
                background: '#fff',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                zIndex: 10,
                px: 4,
                py: 2,
                boxShadow: '-1px -1px 7px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography variant="h6">Logo</Typography>
            <Stack direction="row" spacing={2}>
                <Button startIcon={<NotificationsIcon sx={{ color: colors.textColor }} />} sx={{ textTransform: 'none' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textColor }}>Đăng ký</Typography>
                </Button>
                <div className='w-[1px] h-4 bg-black'></div>
                <Button startIcon={<FavoriteIcon sx={{ color: colors.textColor }} />} sx={{ textTransform: 'none' }} onClick={() => navigate("auth/login")}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textColor }}>Đăng nhập</Typography>
                </Button>
                <div className='w-[1px] h-4 bg-black'></div>
                <Button startIcon={<Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>} sx={{ textTransform: 'none', position: "relative" }} onClick={() => setOpenMenu(true)}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textColor }}>User 1</Typography>
                </Button>
                {openMenu && <div className='absolute top-20 right-1 z-10 w-[330px]'>
                    <ProfileMenu user={user} onMenuItemClick={handelNavigate} />
                </div>}
            </Stack>
        </Box>
    );
};
