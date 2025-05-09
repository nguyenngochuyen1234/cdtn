import React, { useState, useEffect } from 'react';
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
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { ShopSearchResponse } from '@/models';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import favoritesApi from '@/api/favoritesApi';
import { toast } from 'react-toastify';

interface FavoriteShopCardProps {
    shop: ShopSearchResponse;
    onFavoriteChange: () => void; // Callback to refetch favorites after removal
}

const FavoriteShopCard: React.FC<FavoriteShopCardProps> = ({ shop, onFavoriteChange }) => {
    const [isFavorite, setIsFavorite] = useState(true); 
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false); 
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    const handleFavoriteClick = () => {
        if (!user) {
            setOpenDialog(true);
            return;
        }
        setOpenConfirmDialog(true); // Show confirmation popup
    };

    const handleConfirmRemove = async () => {
        try {
            const response = await favoritesApi.deleteFavorite({
                idShop: shop.id,
            });

            if (!response.data.success) {
                toast.error(response.data.message || 'Có lỗi xảy ra');
                return;
            } else {
                toast.success('Xóa cửa hàng yêu thích thành công');
                setIsFavorite(false);
                onFavoriteChange(); // Refetch the favorites list to update the UI
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast.error('Có lỗi xảy ra khi xóa cửa hàng yêu thích');
        } finally {
            setOpenConfirmDialog(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleLoginRedirect = () => {
        setOpenDialog(false);
        navigate('/auth/login');
    };

    // If the shop is no longer a favorite, don't render it (it will be removed after refetch)
    if (!isFavorite) {
        return null;
    }

    return (
        <>
            <Card
                sx={{
                    width: 300,
                    height: 350,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Link to={`/detailPost/${shop.id}`}>
                    <CardMedia
                        component="img"
                        image={shop.avatar || 'https://via.placeholder.com/300x140'}
                        alt={shop.name}
                        sx={{
                            height: 140,
                            width: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Link>

                <Box
                    sx={{
                        position: 'relative',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
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
                                {shop.name || 'Unknown Shop'}
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
                                    {shop.city || 'Unknown Location'}
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
                                    Đóng cửa {shop.openTimeResponses?.[0]?.closeTime || '20:00'}
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
                                height: 40,
                            }}
                        >
                            {shop.description || 'No description available.'}
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
                        <Tooltip title="Xóa khỏi yêu thích">
                            <Button onClick={handleFavoriteClick} sx={{ minWidth: 0, p: 0 }}>
                                <Favorite sx={{ color: 'red' }} />
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
            </Card>

            {/* Login Prompt Dialog */}
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

            {/* Confirmation Dialog for Removing Favorite */}
            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Xác nhận xóa cửa hàng yêu thích</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa cửa hàng "{shop.name}" khỏi danh sách yêu thích
                        không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmRemove} color="error" variant="contained">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FavoriteShopCard;
