import React, { useEffect, useState } from 'react';
import {
    Breadcrumbs,
    Typography,
    Grid,
    Button,
    Container,
    Box,
    Stack,
    Divider,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ImageGallery from '@/components/detailPost/ImageGallery';
import MenuSection from '@/components/detailPost/MenuSection';
import ReviewCardPost from '@/components/detailPost/ReviewCardPost';
import BusinessHoursSection from '@/components/detailPost/BusinessHoursSection';
import SuggestShops from '@/components/detailPost/SuggestShops';
import ReviewFilter from '@/components/detailPost/ReviewFilter';
import type { Shop } from '@/models';
import shopApi from '@/api/shopApi';
import Sponsored from '@/components/detailPost/Sponsored';

function DetailPost() {
    const [detailShop, setDetailShop] = useState<Shop | null>(null);
    const [filter, setFilter] = useState<number | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataShop = async () => {
            try {
                if (id) {
                    const response = await shopApi.getShopById(id);
                    if (response?.data?.data) {
                        setDetailShop(response.data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching shop details:', error);
            }
        };
        fetchDataShop();
    }, [id]);

    const handleReview = (idShop: string) => {
        navigate(`/write-review/shop/${idShop}`);
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

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#FAFBFC' }}>
            {/* Breadcrumbs - Full Width */}
            <Box sx={{ width: '100%', px: { xs: 2, sm: 3, lg: 4 }, py: 2 }}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>
            </Box>

            {/* Image Gallery - Full Width */}
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
            <Box
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#d32323',
                                '&:hover': { bgcolor: '#b91c1c' },
                            }}
                            onClick={() => id && handleReview(id)}
                        >
                            Viết đánh giá
                        </Button>
                        <Button variant="outlined">Thêm ảnh</Button>
                        <Button variant="outlined">Thêm vào yêu thích</Button>
                    </Box>
                </Container>
            </Box>

            {/* Main Content - Narrower Width */}
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: 1 }}>
                <Grid container spacing={2}>
                    {/* Left Column (2/3 width) */}
                    <Grid item xs={12} lg={8}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {/* Menu Section */}
                            {id && <MenuSection shopId={id} />}

                            {/* Business Hours Section */}
                            {id && detailShop && (
                                <BusinessHoursSection shop={detailShop} shopId={id} />
                            )}

                            {/* Review Filter */}
                            {id && (
                                <ReviewFilter
                                    shopId={id}
                                    filter={filter}
                                    setFilter={setFilter}
                                    searchKeyword={searchKeyword}
                                    setSearchKeyword={setSearchKeyword}
                                />
                            )}

                            {/* Review Cards */}
                            {id && (
                                <ReviewCardPost
                                    shopId={id}
                                    filter={filter}
                                    searchKeyword={searchKeyword}
                                />
                            )}
                        </Box>
                    </Grid>

                    {/* Right Column (1/3 width) */}
                    <Grid item xs={12} lg={4}>
                        <Stack direction="column" spacing={2}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Sponsored type="forme" />
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <SuggestShops type="forme" />
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default DetailPost;
