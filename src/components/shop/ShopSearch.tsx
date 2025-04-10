'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CardMedia, Typography, Button, Rating, Tooltip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { ShopSearchResponse } from '@/models';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import favoritesApi from '@/api/favoritesApi';
import { toast } from 'react-toastify';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

interface ShopSearchProps {
    shops: ShopSearchResponse[];
}

export default function ShopSearch({ shops }: ShopSearchProps) {
    const [favorites, setFavorites] = useState<string[]>([]); // Danh sách ID cửa hàng yêu thích
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    // Lấy danh sách yêu thích khi component mount nếu đã đăng nhập
    useEffect(() => {
        const fetchFavorites = async () => {
            if (user) {
                try {
                    const response = await favoritesApi.getAllFavorite('createdAt', 1, 100);
                    const favoriteShops = response.data?.data?.map((fav: any) => fav.idShop) || [];
                    setFavorites(favoriteShops);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            }
        };
        fetchFavorites();
    }, [user]);

    // Cập nhật danh sách yêu thích khi danh sách cửa hàng thay đổi
    useEffect(() => {
        if (user && shops.length > 0) {
            const fetchFavorites = async () => {
                try {
                    const response = await favoritesApi.getAllFavorite('createdAt', 1, 100);
                    const favoriteShops = response.data?.data?.map((fav: any) => fav.idShop) || [];
                    setFavorites(favoriteShops);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            };
            fetchFavorites();
        }
    }, [shops, user]);

    const handleFavoriteClick = async (shopId: string) => {
        if (!user) {
            setOpenDialog(true);
            return;
        }

        const isCurrentlyFavorite = favorites.includes(shopId);

        try {
            if (isCurrentlyFavorite) {
                const response = await favoritesApi.deleteFavorite({ idShop: shopId });
                if (!response.data.success) {
                    toast.error(response.data.message || 'Có lỗi xảy ra');
                    return;
                }
                toast.success('Xóa cửa hàng yêu thích thành công');
                setFavorites((prev) => prev.filter((id) => id !== shopId));
            } else {
                const response = await favoritesApi.addFavorite({ idShop: shopId });
                if (!response.data.success) {
                    toast.error(response.data.message || 'Có lỗi xảy ra');
                    return;
                }
                toast.success('Thêm cửa hàng yêu thích thành công');
                setFavorites((prev) => [...prev, shopId]);
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

    const handleCardClick = (id:string) => {
        navigate(`/detailPost/${id}`, { state: { from: 'sponsored' } })
    }
    return ( 
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {shops.map((shop) => {
                const isFavorite = favorites.includes(shop.id); // Kiểm tra từng shop có trong favorites không
                return (
                    <Card
                        key={shop.id}
                        sx={{
                            display: 'flex',
                            width: '100%',
                            height: { xs: 'auto', sm: 200 },
                            borderRadius: 1,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                            overflow: 'hidden',
                            p: { xs: 1.5, sm: 2 },
                            flexDirection: { xs: 'column', sm: 'row' },
                        }}
                        onClick={() => handleCardClick(shop.id)} // Thêm sự kiện click
                    >
                        <Box
                            sx={{
                                width: { xs: '100%', sm: 120 },
                                height: { xs: 120, sm: 150 },
                                borderRadius: 1,
                                bgcolor: '#f5f5f5',
                                mb: { xs: 1.5, sm: 0 },
                                position: 'relative',
                                overflow: 'hidden',
                                flexShrink: 0,
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                image={shop.avatar || 'https://via.placeholder.com/150'}
                                alt={shop.name}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                                pl: { xs: 0, sm: 2 },
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: '500',
                                            mb: 0.5,
                                            fontSize: { xs: '1rem', sm: '1.25rem' },
                                        }}
                                    >
                                        {shop.name}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            ml: { xs: 0, md: 2 },
                                            mt: { xs: 0.5, md: 0 },
                                            width: { xs: '100%', md: 'auto' },
                                        }}
                                    >
                                        <VisibilityOutlinedIcon
                                            sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {shop.countReview || 0} + lượt đánh giá
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        }}
                                    >
                                        Danh mục: {shop.categoryResponse?.name || 'Không xác định'}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: { xs: 'flex-start', sm: 'center' },
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            mb: { xs: 1, sm: 0 },
                                            mt: { xs: 1, sm: 0 },
                                        }}
                                    >
                                        <LocationOnIcon
                                            fontSize="small"
                                            sx={{
                                                fontSize: 18,
                                                color: 'text.secondary',
                                                mr: 0.5,
                                                mt: { xs: 0.5, sm: 0 },
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            }}
                                        >
                                            {shop.city || 'Không có địa chỉ'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                                    flexDirection={{ xs: 'column', sm: 'row' }}
                                    mb={1}
                                >
                                    <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                                        <Rating
                                            value={shop.point || 0}
                                            readOnly
                                            size="small"
                                            sx={{ color: '#FF5252', fontSize: { xs: 16, sm: 18 } }}
                                        />
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{ ml: 0.5 }}
                                        >
                                            {shop.point || 0} sao
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <VisibilityOutlinedIcon
                                            sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {shop.view || 10} + lượt xem
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    }}
                                >
                                    {shop.description || 'Không có mô tả'}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: { xs: 1, sm: 0 },
                                    gap: 1,
                                }}
                            >
                                <Tooltip
                                    title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                                >
                                    <Button
                                        onClick={() => handleFavoriteClick(shop.id)}
                                        sx={{ minWidth: 0, p: 0 }}
                                    >
                                        {isFavorite ? (
                                            <Favorite sx={{ color: 'red' }} />
                                        ) : (
                                            <FavoriteBorder sx={{ color: 'grey' }} />
                                        )}
                                    </Button>
                                </Tooltip>
                                <Link to={`/write-review/shop/${shop.id}`}>
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
                                        Viết đánh giá
                                    </Button>
                                </Link>
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
                );
            })}
        </Box>
    );
}
