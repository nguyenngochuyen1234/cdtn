// Footer.tsx
import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    Divider,
    Stack,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ width: '100%', bgcolor: '#FFFFFF', color: 'black', pt: 4, pb: 1 }}>
            <Box className="px-[50px]">
                <Grid container spacing={4}>
                    {/* Logo and description */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 3 }}>
                            <Link to="/">
                                <img
                                    src="/Bright Web.png"
                                    alt="Logo"
                                    style={{ height: '18px', width: 'auto' }}
                                    
                                />
                            </Link>
                            <Typography
                                variant="body2"
                                sx={{ mb: 2, color: 'text.secondary', mt: 2 }} // Màu xám đậm cho mô tả
                            >
                                Nền tảng đánh giá hàng đầu Việt Nam, giúp người dùng khám phá và
                                chia sẻ trải nghiệm về nhà hàng, quán cà phê, và các địa điểm du
                                lịch.
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <IconButton
                                    aria-label="facebook"
                                    size="small"
                                    sx={{ color: 'black' }} // Icon màu đen
                                >
                                    <FacebookIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="twitter"
                                    size="small"
                                    sx={{ color: 'black' }}
                                >
                                    <TwitterIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="instagram"
                                    size="small"
                                    sx={{ color: 'black' }}
                                >
                                    <InstagramIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="linkedin"
                                    size="small"
                                    sx={{ color: 'black' }}
                                >
                                    <LinkedInIcon />
                                </IconButton>
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Quick links */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}
                        >
                            Liên kết nhanh
                        </Typography>
                        <Stack spacing={1}>
                            <Link
                                component={RouterLink}
                                to="/"
                                color="inherit"
                                underline="hover"
                                sx={{ color: 'text.secondary' }} // Màu xám đậm cho link
                            >
                                Trang chủ
                            </Link>
                            <Link
                                component={RouterLink}
                                to="/about"
                                color="inherit"
                                underline="hover"
                                sx={{ color: 'text.secondary' }}
                            >
                                Về chúng tôi
                            </Link>
                        </Stack>
                    </Grid>

                    {/* Support */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Link
                            component={RouterLink}
                            to="/about"
                            color="inherit"
                            underline="hover"
                            sx={{ color: 'text.secondary' }}
                        >
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}
                            >
                                Hỗ trợ
                            </Typography>
                        </Link>

                        <Stack spacing={1}>
                            <Link
                                component={RouterLink}
                                to="/about"
                                color="inherit"
                                underline="hover"
                                sx={{ color: 'text.secondary' }}
                            >
                                Liên hệ
                            </Link>
                            <Link
                                component={RouterLink}
                                to="/policy"
                                color="inherit"
                                underline="hover"
                                sx={{ color: 'text.secondary' }}
                            >
                                Chính sách
                            </Link>
                        </Stack>
                    </Grid>

                    {/* Contact */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}
                        >
                            Liên hệ với chúng tôi
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    250 Kim Giang, Đại Kim, Hoàng Mai, Hà Nội
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    +84 975245621
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} /> {/* Màu divider nhạt hơn */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'center', // Đảm bảo căn giữa theo chiều ngang
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '100%', // Đảm bảo phần tử con nằm giữa
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        © {new Date().getFullYear()} WebSReview. Tất cả các quyền được bảo lưu.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;
