import logo from '@/assets/images/logo.svg';
import { Avatar, Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useNavigate } from 'react-router-dom';
import { colors } from '@/themes/colors';
import { deepOrange } from '@mui/material/colors';
import { useState } from 'react';
import { MenuItem, User } from '@/models';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import ProfileMenu from './user/ProfilteMenu';

export const HeaderComponent = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Dưới 600px
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = (item: MenuItem) => {
        setOpenMenu(false); // Đóng menu khi chọn một mục
        navigate(item.link);
    };

    // Hàm xử lý bật/tắt menu khi bấm vào nút Profile
    const handleProfileClick = () => {
        setOpenMenu((prev) => !prev); // Chuyển đổi trạng thái từ true sang false và ngược lại
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
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, md: 2 },
                boxShadow: '-1px -1px 7px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* Logo */}
            <Link to="/">
                <img
                    src="/Bright Web.png"
                    alt="Logo"
                    style={{
                        height: isMobile ? '14px' : '18px',
                        width: 'auto',
                    }}
                />
            </Link>

            {/* Các nút bên phải */}
            <Stack direction="row" alignItems="center" spacing={isMobile ? 1 : 2}>
                {/* Nút "Bắt đầu tạo cửa hàng" */}
                <Button
                    variant="contained"
                    onClick={() => navigate('biz/register-shop')}
                    startIcon={
                        <NotificationsIcon
                            sx={{ color: '#fff', fontSize: isMobile ? '16px' : '20px' }}
                        />
                    }
                    sx={{
                        textTransform: 'none',
                        py: isMobile ? 0.5 : 1,
                        px: isMobile ? 1 : 2,
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            display: isMobile ? 'none' : 'block',
                        }}
                    >
                        Bắt đầu tạo cửa hàng
                    </Typography>
                </Button>

                {!isMobile && <Box sx={{ width: '1px', height: '16px', bgcolor: 'black' }} />}

                {user ? (
                    <>
                        {/* Nút "Cửa Hàng Yêu Thích" */}
                        <Button
                            sx={{
                                textTransform: 'none',
                                py: isMobile ? 0.5 : 1,
                                px: isMobile ? 1 : 2,
                            }}
                            onClick={() => navigate('/favorites')}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: colors.textColor,
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    display: isMobile ? 'none' : 'block',
                                }}
                            >
                                Cửa Hàng Yêu Thích
                            </Typography>
                            {isMobile && (
                                <FavoriteIcon sx={{ color: colors.textColor, fontSize: '16px' }} />
                            )}
                        </Button>

                        {!isMobile && (
                            <Box sx={{ width: '1px', height: '16px', bgcolor: 'black' }} />
                        )}

                        {/* Nút "Viết bài đánh giá" */}
                        <Button
                            sx={{
                                textTransform: 'none',
                                py: isMobile ? 0.5 : 1,
                                px: isMobile ? 1 : 2,
                            }}
                            onClick={() => navigate('/search')}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: colors.textColor,
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    display: isMobile ? 'none' : 'block',
                                }}
                            >
                                Viết bài đánh giá
                            </Typography>
                            {isMobile && (
                                <FavoriteIcon sx={{ color: colors.textColor, fontSize: '16px' }} />
                            )}
                        </Button>

                        {!isMobile && (
                            <Box sx={{ width: '1px', height: '16px', bgcolor: 'black' }} />
                        )}

                        {/* Nút Profile */}
                        <Button
                            startIcon={
                                <Avatar
                                    sx={{
                                        bgcolor: deepOrange[500],
                                        width: isMobile ? 24 : 32,
                                        height: isMobile ? 24 : 32,
                                    }}
                                >
                                    N
                                </Avatar>
                            }
                            sx={{
                                textTransform: 'none',
                                position: 'relative',
                                py: isMobile ? 0.5 : 1,
                                px: isMobile ? 1 : 2,
                            }}
                            onClick={handleProfileClick}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: colors.textColor,
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    display: isMobile ? 'none' : 'block',
                                }}
                            >
                                {user.username}
                            </Typography>
                        </Button>

                        {/* Profile Menu */}
                        {openMenu && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: isMobile ? '48px' : '60px',
                                    right: isMobile ? 8 : 16,
                                    zIndex: 10,
                                    width: isMobile ? '200px' : '330px',
                                }}
                            >
                                <ProfileMenu user={user} onMenuItemClick={handleNavigate} />
                            </Box>
                        )}
                    </>
                ) : (
                    <>
                        {/* Nút "Đăng ký" */}
                        <Button
                            startIcon={
                                <NotificationsIcon
                                    sx={{
                                        color: colors.textColor,
                                        fontSize: isMobile ? '16px' : '20px',
                                    }}
                                />
                            }
                            sx={{
                                textTransform: 'none',
                                py: isMobile ? 0.5 : 1,
                                px: isMobile ? 1 : 2,
                            }}
                            onClick={() => navigate('/auth/signup')}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: colors.textColor,
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    display: isMobile ? 'none' : 'block',
                                }}
                            >
                                Đăng ký
                            </Typography>
                        </Button>

                        {!isMobile && (
                            <Box sx={{ width: '1px', height: '16px', bgcolor: 'black' }} />
                        )}

                        {/* Nút "Đăng nhập" */}
                        <Button
                            startIcon={
                                <FavoriteIcon
                                    sx={{
                                        color: colors.textColor,
                                        fontSize: isMobile ? '16px' : '20px',
                                    }}
                                />
                            }
                            sx={{
                                textTransform: 'none',
                                py: isMobile ? 0.5 : 1,
                                px: isMobile ? 1 : 2,
                            }}
                            onClick={() => navigate('auth/login')}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: colors.textColor,
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    display: isMobile ? 'none' : 'block',
                                }}
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

export default HeaderComponent;
