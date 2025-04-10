import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Rating,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { ShopSearchResponse } from '@/models';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import favoritesApi from '@/api/favoritesApi';
import { toast } from 'react-toastify';

export interface ShopCardProps {
    shop: ShopSearchResponse;
}

const ShopCard = ({ shop }: ShopCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (user) {
                try {
                    const response = await favoritesApi.getAllFavorite('createdAt', 1, 100);
                    const favorites = response.data?.data || [];
                    const isShopFavorite = favorites.some((fav: any) => fav.idShop === shop.id);
                    setIsFavorite(isShopFavorite);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            }
        };
        checkFavoriteStatus();
    }, [user, shop.id]);

    const handleFavoriteClick = async () => {
        if (!user) {
            setOpenDialog(true);
            return;
        }

        try {
            if (isFavorite) {
                const response = await favoritesApi.deleteFavorite({
                    idShop: shop.id,
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
                    idShop: shop.id,
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
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleLoginRedirect = () => {
        setOpenDialog(false);
        navigate('/auth/login');
    };

    return (
        <Card
            sx={{
                width: 300, // Fixed width
                height: 350, // Fixed height
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Link to={`/detailPost/${shop.id}`} state={{ from: 'suggest' }}>
                <CardMedia
                    component="img"
                    image={shop.avatar || 'https://via.placeholder.com/300x140'}
                    alt={shop.name}
                    sx={{
                        height: 140, // Fixed image height
                        width: '100%',
                        objectFit: 'cover',
                    }}
                />
            </Link>

            <Box
                sx={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
                <CardContent sx={{ pb: 2, flexGrow: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 0.5,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {shop.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Rating
                                value={shop.countReview > 0 ? shop.point / shop.countReview : 1}
                                readOnly
                                size="small"
                                precision={0.5}
                            />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {shop.countReview > 0
                                    ? (shop.point / shop.countReview).toFixed(0)
                                    : '1'}
                            </Typography>
                        </Box>
                    </Box>
                    <Stack
                        direction={'row'}
                        spacing={1}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnOutlinedIcon
                                fontSize="small"
                                color="action"
                                sx={{ mr: 0.5 }}
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {shop.city}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTimeOutlinedIcon
                                fontSize="small"
                                color="action"
                                sx={{ mr: 0.5 }}
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Đóng cửa lúc {shop.openTimeResponses[0]?.closeTime || '10.00PM'}
                            </Typography>
                        </Box>
                    </Stack>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1,
                            mt: 2,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            height: 40, // Fixed height for description
                        }}
                    >
                        {shop.description}
                    </Typography>
                </CardContent>

                <Divider />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                    }}
                >
                    <Tooltip title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}>
                        <Button onClick={handleFavoriteClick} sx={{ minWidth: 0, p: 0 }}>
                            {isFavorite ? (
                                <Favorite sx={{ color: 'red' }} />
                            ) : (
                                <FavoriteBorder sx={{ color: 'grey' }} />
                            )}
                        </Button>
                    </Tooltip>
                    <Link to={`/detailPost/${shop.id}`}>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{
                                textTransform: 'none',
                                px: 2,
                                boxShadow: 'none',
                                borderRadius: '50px',
                            }}
                        >
                            Xem chi tiết
                        </Button>
                    </Link>
                </Box>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Bạn cần đăng nhập</DialogTitle>
                <DialogContent>
                    <Typography>
                        Vui lòng đăng nhập để thêm cửa hàng vào danh sách yêu thích.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Tiếp tục sử dụng không đăng nhập
                    </Button>
                    <Button onClick={handleLoginRedirect} color="primary" variant="contained">
                        Đăng nhập
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default ShopCard;
