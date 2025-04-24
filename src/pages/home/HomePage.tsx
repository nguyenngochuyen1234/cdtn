import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import { Carousel } from 'antd';
import React, { useEffect, useState } from 'react';
import TravelCard from '@/components/TravelCard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FlightIcon from '@mui/icons-material/Flight';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import HotelIcon from '@mui/icons-material/Hotel';
import DestinationsCard from '@/components/DestinationsCard';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/models';
import { Link, useNavigate } from 'react-router-dom';
import CategorySection from './component/CategorySection';
import SearchBarComponent from '@/components/search/SearchBarComponent';
import ShopCard from '@/components/shop/ShopCard';
import reviewApi from '@/api/reviewApi';
import shopApi from '@/api/shopApi';
import axiosClient from '@/api/axiosClient';

const categories = [
    {
        icon: <RestaurantIcon fontSize="large" />,
        name: 'Nhà Hàng',
    },
    {
        icon: <FlightIcon fontSize="large" />,
        name: 'Du Lịch',
    },
    {
        icon: <LocalLaundryServiceIcon fontSize="large" />,
        name: 'Giặt Ủi',
    },
    {
        icon: <HotelIcon fontSize="large" />,
        name: 'Khách Sạn',
    },
];

const HomePage = () => {
    const [dataReviews, setDataReview] = useState<Review[] | null>(null);
    const [shops, setShops] = useState([]);
    const [initialLocation, setInitialLocation] = useState<
        { latitude: number; longitude: number } | undefined
    >(undefined);
    const navigate = useNavigate();

    // Fetch user location from localStorage
    useEffect(() => {
        const storedLocation = localStorage.getItem('userLocation');
        if (storedLocation) {
            const locationData = JSON.parse(storedLocation);
            setInitialLocation({
                latitude: locationData.lat,
                longitude: locationData.lng,
            });
        }
    }, []);

    // Fetch recent reviews
    const fetchReviewRecently = async () => {
        try {
            const response = await reviewApi.getAllReviewRecently();
            setDataReview(response.data.data);
        } catch (error) {
            console.error('Error fetching recent reviews:', error);
            setDataReview([]);
        }
    };

    useEffect(() => {
        fetchReviewRecently();
    }, []);

    // Fetch shops based on authentication status
    useEffect(() => {
        const fetchShops = async () => {
            // Kiểm tra trạng thái đăng nhập ngay trong useEffect này
            const accessToken = localStorage.getItem('access_token');
            const isAuthenticated = !!accessToken; // True nếu có token, false nếu không

            try {
                if (isAuthenticated) {
                    // Fetch personalized recommendations if authenticated
                    const userLocation = localStorage.getItem('userLocation');
                    let longitude = null;
                    let latitude = null;

                    if (userLocation) {
                        try {
                            const locationData = JSON.parse(userLocation);
                            longitude = locationData.lng;
                            latitude = locationData.lat;
                        } catch (error) {
                            console.error('Lỗi khi parse userLocation từ localStorage:', error);
                        }
                    }

                    const requestBody = {
                        page: 0,
                        size: 4,
                        checkType: 'forme',
                        ...(longitude &&
                            latitude && {
                                longitude: parseFloat(longitude),
                                latitude: parseFloat(latitude),
                            }),
                    };

                    const response = await shopApi.getShopsSuggest(requestBody);
                    if (response.data.success) {
                        setShops(response.data.data);
                    } else {
                        setShops([]);
                    }
                } else {
                    // Fetch sponsored shops if not authenticated
                    const response = await shopApi.getShopAds();
                    if (response.data.success) {
                        const sponsoredShops = response.data.data;
                        const shopsWithOpenTimes = await Promise.all(
                            sponsoredShops.map(async (shop: any) => {
                                let openTimeResponses = [];
                                if (shop.listIdOpenTime && Array.isArray(shop.listIdOpenTime)) {
                                    try {
                                        const openTimePromises = shop.listIdOpenTime.map(
                                            (id: string) => shopApi.getOpenTimeById(id)
                                        );
                                        const openTimeResults = await Promise.all(openTimePromises);
                                        openTimeResponses = openTimeResults
                                            .filter((result: any) => result.data.success)
                                            .map((result: any) => ({
                                                closeTime: result.data.data.closeTime || '10.00 PM',
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
                        setShops(shopsWithOpenTimes);
                    } else {
                        setShops([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching shops:', error);
                setShops([]);
            }
        };

        fetchShops();
    }, []); // Dependency array rỗng, chỉ chạy một lần khi component mount

    const handleSearch = (keyword: string, location?: { latitude: number; longitude: number }) => {
        navigate('/search', { state: { keyword, location } });
    };

    // Logic hiển thị giao diện giữ nguyên
    return (
        <div
            className="bg-[#FAFBFC]"
            style={{
                padding: '20px 15px',
                '@media (min-width: 600px)': {
                    padding: '30px 50px',
                },
            }}
        >
            {/* Carousel Section */}
            <div className="relative">
                <div className="hidden md:block">
                    <Carousel autoplay>
                        <div>
                            <img
                                style={{
                                    width: '100%',
                                    height: '80vh',
                                    objectFit: 'cover',
                                    borderRadius: 10,
                                }}
                                src="https://i.pinimg.com/736x/f8/a7/01/f8a70144eb881afe78df0164e657e966.jpg"
                                alt="Carousel Image 1"
                            />
                        </div>
                        <div>
                            <img
                                style={{
                                    width: '100%',
                                    height: '80vh',
                                    objectFit: 'cover',
                                    borderRadius: 10,
                                }}
                                src="https://i.pinimg.com/736x/89/39/17/893917edbcc0fee101262b467aada93d.jpg"
                                alt="Carousel Image 2"
                            />
                        </div>
                        <div>
                            <img
                                style={{
                                    width: '100%',
                                    height: '80vh',
                                    objectFit: 'cover',
                                    borderRadius: 10,
                                }}
                                src="https://i.pinimg.com/736x/b7/b4/24/b7b4243f97193771177c5986b4b44614.jpg"
                                alt="Carousel Image 3"
                            />
                        </div>
                    </Carousel>
                </div>

                <div className="block md:hidden">
                    <img
                        style={{
                            width: '100%',
                            height: '50vh',
                            objectFit: 'cover',
                            borderRadius: 10,
                        }}
                        src="https://i.pinimg.com/736x/f8/a7/01/f8a70144eb881afe78df0164e657e966.jpg"
                        alt="Mobile Carousel Image"
                    />
                </div>

                <div
                    className="absolute bg-[#fff] rounded-md shadow-lg p-4 bottom-[-40px] left-1/2 transform -translate-x-1/2 w-full"
                    style={{
                        width: 'min(90%, 800px)',
                        bottom: '-20px',
                        padding: '10px',
                        '@media (min-width: 600px)': {
                            bottom: '-40px',
                            padding: '15px',
                        },
                    }}
                >
                    <SearchBarComponent onSearch={handleSearch} isSearchPage={false} />
                </div>
            </div>

            {/* Main Content */}
            <main style={{ marginTop: '50px' }}>
                {/* Shop Section */}
                <Box
                    justifyContent="space-between"
                    display="flex"
                    alignItems="center"
                    sx={{
                        mb: 2,
                        flexDirection: { xs: 'column', md: 'row' },
                        textAlign: { xs: 'center', md: 'left' },
                        gap: { xs: 2, md: 0 },
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { xs: '1.25rem', md: '1.5rem' },
                                fontWeight: 'bold',
                            }}
                        >
                            {localStorage.getItem('access_token')
                                ? 'Đề xuất các cửa hàng bạn nên đến'
                                : 'Các cửa hàng được tài trợ'}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                        >
                            {localStorage.getItem('access_token')
                                ? 'Gợi ý những cửa hàng phù hợp'
                                : 'Các cửa hàng được quảng cáo'}
                        </Typography>
                    </Box>
                    <Link to={'/search'}>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{
                                mt: { xs: 0, md: 0 },
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                                padding: { xs: '4px 8px', md: '6px 16px' },
                            }}
                        >
                            Xem thêm
                        </Button>
                    </Link>
                </Box>

                <Grid container spacing={2} sx={{ pb: 2, mb: 3 }}>
                    {shops && shops.length > 0 ? (
                        shops.map((shop, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box sx={{ width: '100%', maxWidth: 300 }}>
                                    <ShopCard shop={shop} />
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Đang tải cửa hàng hoặc không có cửa hàng nào...
                            </Typography>
                        </Grid>
                    )}
                </Grid>

                {/* Review Section */}
                <Box
                    justifyContent="space-between"
                    display="flex"
                    alignItems="center"
                    sx={{
                        mb: 2,
                        flexDirection: { xs: 'column', md: 'row' },
                        textAlign: { xs: 'center', md: 'left' },
                        gap: { xs: 2, md: 0 },
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { xs: '1.25rem', md: '1.5rem' },
                                fontWeight: 'bold',
                            }}
                        >
                            Danh sách đánh giá gần đây
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                        >
                            Tổng hợp các bài viết review
                        </Typography>
                    </Box>
                    <Link to={'/reviews'}>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{
                                mt: { xs: 0, md: 0 },
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                                padding: { xs: '4px 8px', md: '6px 16px' },
                            }}
                        >
                            Xem thêm
                        </Button>
                    </Link>
                </Box>

                <Grid container spacing={2} sx={{ pb: 2 }}>
                    {dataReviews && dataReviews.length > 0 ? (
                        dataReviews.map((review, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box sx={{ width: '100%', maxWidth: 300 }}>
                                    <ReviewCard review={review} />
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Đang tải đánh giá hoặc không có đánh giá nào...
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </main>
        </div>
    );
};

export default HomePage;
