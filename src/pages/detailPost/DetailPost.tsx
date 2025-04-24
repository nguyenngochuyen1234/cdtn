'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Breadcrumbs,
    Typography,
    Grid,
    Button,
    Container,
    Stack,
    Divider,
    Paper,
    useMediaQuery,
    useTheme,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import type { Shop } from '@/models';
import shopApi from '@/api/shopApi';
import favoritesApi from '@/api/favoritesApi'; // Giả định bạn có API này
import MenuSection from '@/components/detailPost/MenuSection';
import BusinessHoursSection from '@/components/detailPost/BusinessHoursSection';
import ReviewFilter from '@/components/detailPost/ReviewFilter';
import ReviewCardPost from '@/components/detailPost/ReviewCardPost';
import Sponsored from '@/components/detailPost/Sponsored';
import SuggestShops from '@/components/detailPost/SuggestShops';
import ImageGallery from '@/components/detailPost/ImageGallery';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import { toast } from 'react-toastify'; // Giả định bạn sử dụng react-toastify để hiển thị thông báo
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';

function DetailPost() {
    const [detailShop, setDetailShop] = useState<Shop | null>(null);
    const [filter, setFilter] = useState<number | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [isFavorite, setIsFavorite] = useState<boolean>(false); // Trạng thái yêu thích
    const [openDialog, setOpenDialog] = useState<boolean>(false); // Trạng thái dialog đăng nhập

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Giả định bạn có biến user để kiểm tra trạng thái đăng nhập
    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        const fetchDataShop = async () => {
            setLoading(true);
            try {
                if (id) {
                    const response = await shopApi.getShopById(id);
                    if (response?.data?.data) {
                        setDetailShop(response.data.data);
                        // Kiểm tra xem cửa hàng có trong danh sách yêu thích không
                        // Giả định bạn có API để kiểm tra trạng thái yêu thích
                        const favoriteResponse = await favoritesApi.getFavoriteById(id);
                        setIsFavorite(favoriteResponse?.data?.isFavorite || false);
                    }
                }
            } catch (error) {
                console.error('Error fetching shop details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataShop();
    }, [id]);

    useEffect(() => {
        if (id) {
            const isFromSponsored = location.state?.from === 'sponsored';
            const idAdvertisement = location.state?.idAdvertisement || ''; // Lấy idAdvertisement từ state, mặc định là chuỗi rỗng nếu không có
            const body = {
                idShop: id,
                type: isFromSponsored ? 'ads' : '',
                idAdvertisement: idAdvertisement
            };
            shopApi.increView(body);
        }
    }, [id, location.state]);

    const handleReview = (idShop: string) => {
        navigate(`/write-review/shop/${idShop}`);
    };

    const handleFavoriteClick = async () => {
        if (!user) {
            setOpenDialog(true);
            return;
        }

        try {
            if (isFavorite) {
                const response = await favoritesApi.deleteFavorite({
                    idShop: detailShop?.id,
                });

                if (!response.data.success) {
                    toast.error(response.data.message || 'Có lỗi xảy ra');
                    return;
                } else {
                    toast.success('Xóa cửa hàng yêu thích thành công');
                }
                setIsFavorite(false);
            } else {
                const response = await favoritesApi.addFavorite({
                    idShop: detailShop?.id,
                });
                if (!response.data.success) {
                    toast.error(response.data.message || 'Có lỗi xảy ra');
                    return;
                } else {
                    toast.success('Thêm cửa hàng yêu thích thành công');
                }
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error handling favorite:', error);
            toast.error('Có lỗi xảy ra khi xử lý yêu thích');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleLoginRedirect = () => {
        setOpenDialog(false);
        navigate('/auth/login');
    };

    const breadcrumbs = [
        <Link key="1" to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Trang chủ
        </Link>,
        <Link key="2" to="/shops" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cửa hàng
        </Link>,
        <Typography key="3" color="text.primary">
            {detailShop?.name || 'Chi tiết cửa hàng'}
        </Typography>,
    ];

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Typography variant="h6">Đang tải...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#FAFBFC' }}>
            {/* Breadcrumbs */}
            <Paper
                elevation={0}
                sx={{ width: '100%', px: { xs: 2, sm: 3, lg: 4 }, py: 2, borderRadius: 0 }}
            >
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>
            </Paper>

            {/* Image Gallery */}
            {id && detailShop && (
                <Box sx={{ width: '100%' }}>
                    <ImageGallery
                        avatar={detailShop?.avatar || '/placeholder.svg?height=300&width=300'}
                        images={detailShop?.mediaUrls || []}
                        shopId={id}
                        shop={detailShop}
                    />
                </Box>
            )}

            {/* Action Buttons */}
            <Paper
                elevation={1}
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    borderBottom: 1,
                    borderColor: 'divider',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}
            >
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#d32323',
                                '&:hover': { bgcolor: '#b91c1c' },
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }}
                            onClick={() => id && handleReview(id)}
                        >
                            Viết đánh giá
                        </Button>
                        <Button variant="outlined" sx={{ textTransform: 'none' }}>
                            {isMobile ? 'Ảnh' : 'Thêm ảnh'}
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ textTransform: 'none' }}
                            onClick={handleFavoriteClick}
                            startIcon={
                                isFavorite ? (
                                    <FavoriteIcon sx={{ color: '#d32323' }} />
                                ) : (
                                    <FavoriteBorderIcon />
                                )
                            }
                        >
                            {isMobile ? 'Yêu thích' : 'Thêm vào yêu thích'}
                        </Button>
                    </Box>
                </Container>
            </Paper>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: 3 }}>
                <Grid container spacing={3}>
                    {/* Left Column - Main Content */}
                    <Grid item xs={12} lg={8}>
                        <Stack spacing={3}>
                            {/* Shop Info */}
                            <Card elevation={1}>
                                <CardContent sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {/* Shop Name, Rating, and Services */}
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">
                                                {detailShop?.name || 'Tên cửa hàng'}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mt: 1,
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            sx={{
                                                                color:
                                                                    i <
                                                                    Math.floor(
                                                                        detailShop?.point || 0
                                                                    )
                                                                        ? '#f59e0b'
                                                                        : '#e5e7eb',
                                                                fontSize: 20,
                                                            }}
                                                        />
                                                    ))}
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight="medium"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        {detailShop?.countReview > 0
                                                            ? (
                                                                  detailShop.point /
                                                                  detailShop.countReview
                                                              ).toFixed(1)
                                                            : 5}{' '}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        ({detailShop?.countReview || 0} đánh giá)
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    $$$
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    {detailShop ? (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                px: 1,
                                                                py: 0.5,
                                                                bgcolor: '#f1f5f9',
                                                                borderRadius: 1,
                                                            }}
                                                        >
                                                            {detailShop.categoryName !== ''
                                                                ? detailShop.categoryName
                                                                : 'Nhà Hàng'}
                                                        </Typography>
                                                    ) : (
                                                        'Nhà Hàng'
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Shop Details */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <EmailIcon
                                                    sx={{ color: 'text.secondary', fontSize: 20 }}
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Email:</strong>{' '}
                                                    {detailShop?.email || 'example@gmail.com'}
                                                </Typography>
                                            </Box>

                                            {/* Address */}
                                            {/* <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <LocationOnIcon
                                                    sx={{ color: 'text.secondary', fontSize: 20 }}
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Địa chỉ:</strong>{' '}
                                                    {detailShop?.address ||
                                                        '123 Đại Từ, Hoàng Mai, Hà Nội'}
                                                </Typography>
                                            </Box> */}

                                            {/* Website */}
                                            {detailShop?.urlWebsite && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <LanguageIcon
                                                        sx={{
                                                            color: 'text.secondary',
                                                            fontSize: 20,
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        <strong>Website:</strong>{' '}
                                                        <a
                                                            href={detailShop.urlWebsite}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: '#ef4444',
                                                                textDecoration: 'none',
                                                            }}
                                                        >
                                                            {detailShop.urlWebsite}
                                                        </a>
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Description */}
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" mb={1}>
                                                Giới thiệu
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {detailShop?.description ||
                                                    'Chuyên cung cấp dịch vụ làm đẹp chất lượng cao, tập trung vào nối mi, chăm sóc da và trang điểm vĩnh viễn.'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Existing Sections */}
                            {id && <MenuSection shopId={id} />}
                            {id && detailShop && (
                                <BusinessHoursSection shop={detailShop} shopId={id} />
                            )}
                            {id && (
                                <ReviewFilter
                                    shopId={id}
                                    filter={filter}
                                    setFilter={setFilter}
                                    searchKeyword={searchKeyword}
                                    setSearchKeyword={setSearchKeyword}
                                />
                            )}
                            {id && (
                                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                                    <ReviewCardPost
                                        shopId={id}
                                        filter={filter}
                                        searchKeyword={searchKeyword}
                                    />
                                </Paper>
                            )}
                        </Stack>
                    </Grid>

                    {/* Right Column - Sidebar */}
                    <Grid item xs={12} lg={4}>
                        <Stack spacing={3}>
                            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                                <Sponsored type="ads" />
                            </Paper>
                            <Divider />
                            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                                <SuggestShops type="forme" />
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* Dialog yêu cầu đăng nhập */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn cần đăng nhập để thêm cửa hàng vào danh sách yêu thích.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleLoginRedirect} color="primary" variant="contained">
                        Đăng nhập
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default DetailPost;
