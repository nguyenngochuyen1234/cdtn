import logo from '@/assets/images/logo.svg';
import { Avatar, Box, Button, Divider, Stack, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { colors } from '@/themes/colors';
import { deepOrange } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import ProfileMenu from './user/ProfilteMenu';
import { MenuItem, User } from '@/models';
import userApi from '@/api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
export const HeaderComponent = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const handleSearch = (value: string) => {
        console.log('Search:', value);
    };
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();
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
            <Button onClick={() => navigate('/')}>
                <Typography variant="h6">Logo</Typography>
            </Button>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                    variant="contained"
                    onClick={() => navigate('biz/register-shop')}
                    startIcon={<NotificationsIcon sx={{ color: '#fff' }} />}
                    sx={{ textTransform: 'none' }}
                >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Bắt đầu tạo cửa hàng
                    </Typography>
                </Button>
                <div className="w-[1px] h-4 bg-black "></div>
                <Button sx={{ textTransform: 'none' }} onClick={() => navigate('/writeareview')}>
                    <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: colors.textColor }}
                    >
                        Viết bài đánh giá
                    </Typography>
                </Button>
                <div className="w-[1px] h-4 bg-black "></div>
                {user ? (
                    <>
                        <Button
                            startIcon={<Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>}
                            sx={{ textTransform: 'none', position: 'relative' }}
                            onClick={() => setOpenMenu(true)}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: colors.textColor }}
                            >
                                {user.username}
                            </Typography>
                        </Button>
                        {openMenu && (
                            <div className="absolute top-20 right-1 z-10 w-[330px]">
                                <ProfileMenu user={user} onMenuItemClick={handelNavigate} />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <Button
                            startIcon={<NotificationsIcon sx={{ color: colors.textColor }} />}
                            sx={{ textTransform: 'none' }}
                            onClick={() => navigate('/auth/register')}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: colors.textColor }}
                            >
                                Đăng ký
                            </Typography>
                        </Button>
                        <div className="w-[1px] h-4 bg-black "></div>
                        <Button
                            startIcon={<FavoriteIcon sx={{ color: colors.textColor }} />}
                            sx={{ textTransform: 'none' }}
                            onClick={() => navigate('auth/login')}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: colors.textColor }}
                            >
                                Đăng nhập
                            </Typography>
                        </Button>
                    </>
                )}
            </Stack>
        </Box>
    );
};
