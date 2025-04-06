import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, CircularProgress } from '@mui/material';
import CustomPagination from './CustomPagination';
import favoritesApi from '@/api/favoritesApi';
import shopApi from '@/api/shopApi';
import { ShopSearchResponse } from '@/models';
import { Link } from 'react-router-dom';
import FavoriteShopCard from './FavoriteShopCard';

const FavoriteStores: React.FC = () => {
    const [favorites, setFavorites] = useState<ShopSearchResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const limit = 12;

    useEffect(() => {
        fetchFavorites();
    }, [page]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const favoritesResponse = await favoritesApi.getAllFavorite('createdAt', page, limit);
            if (favoritesResponse.data?.success) {
                const favoriteShops = favoritesResponse.data?.data || [];

                const shopDetailsPromises = favoriteShops.map((favorite: any) =>
                    shopApi.getShopById(favorite.idShop)
                );
                const shopDetailsResults = await Promise.all(shopDetailsPromises);
                const shopDetails = shopDetailsResults
                    .filter((result: any) => result.data.success)
                    .map((result: any) => result.data.data);

                const shopsWithOpenTimes = await Promise.all(
                    shopDetails.map(async (shop: ShopSearchResponse) => {
                        let openTimeResponses = [];
                        if (shop.listIdOpenTime && Array.isArray(shop.listIdOpenTime)) {
                            try {
                                const openTimePromises = shop.listIdOpenTime.map((id: string) =>
                                    shopApi.getOpenTimeById(id)
                                );
                                const openTimeResults = await Promise.all(openTimePromises);
                                openTimeResponses = openTimeResults
                                    .filter((result: any) => result.data.success)
                                    .map((result: any) => ({
                                        closeTime: result.data.data.closeTime || '20:00',
                                    }));
                            } catch (error) {
                                console.error(
                                    `Error fetching open time for shop ${shop.id}:`,
                                    error
                                );
                            }
                        }
                        return {
                            ...shop,
                            openTimeResponses,
                            point: shop.point ?? 0,
                            countReview: shop.countReview ?? 0,
                        };
                    })
                );

                setFavorites(shopsWithOpenTimes);
                setTotalItems(favoritesResponse.data?.meta.total || 0);
                setTotalPages(favoritesResponse.data?.meta.totalPage || 1);
            } else {
                console.error('Failed to fetch favorites:', favoritesResponse.data?.message);
                setFavorites([]);
                setTotalItems(0);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setFavorites([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Container maxWidth="lg" sx={{ py: 2 }}>
                <Box
                    sx={{
                        mb: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="bold"
                        sx={{
                            mb: 1,
                            color: '#d32f2f',
                            textAlign: 'center',
                        }}
                    >
                        Cửa Hàng Yêu Thích
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textAlign: 'center', maxWidth: 600 }}
                    >
                        Danh sách các cửa hàng bạn đã đánh dấu yêu thích
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                        <CircularProgress color="error" />
                    </Box>
                ) : favorites.length > 0 ? (
                    <>
                        <Grid container spacing={2} justifyContent="start">
                            {favorites.map((shop) => (
                                <Grid
                                    item
                                    key={shop.id}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    sx={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <FavoriteShopCard
                                        shop={shop}
                                        onFavoriteChange={fetchFavorites}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CustomPagination
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            my: 8,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                            Bạn chưa có cửa hàng yêu thích nào
                        </Typography>
                        <Link to="/search">
                            <Typography variant="body2" color="text.secondary">
                                Hãy khám phá các cửa hàng và thêm vào danh sách yêu thích của bạn
                            </Typography>
                        </Link>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default FavoriteStores;
