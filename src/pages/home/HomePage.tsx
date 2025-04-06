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
const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '80vh',
    objectFit: 'cover',
    borderRadius: 10,
};
const HomePage = () => {
    const [dataReviews, setDataReview] = useState<Review[] | null>(null);
    const [shops, setShops] = useState([]);
    const navigate = useNavigate();
    const fetchReviewRecently = async () => {
        try {
            const response = await reviewApi.getAllReviewRecently();
            setDataReview(response.data.data); // Lưu dữ liệu từ API vào state
        } catch (error) {
            console.error('Error fetching recent reviews:', error);
            setDataReview([]); // Nếu lỗ
        }
    };
    useEffect(() => {
        fetchReviewRecently();
    }, []);
    console.log(dataReviews);
    useEffect(() => {
        const fetchSuggestedShops = async () => {
            try {
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
                // Tạo body request
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

                const response = await shopApi.suggestShop(requestBody);
                if (response.data.success) {
                    setShops(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching suggested shops:', error);
            }
        };

        fetchSuggestedShops();
    }, []);

    // Handle search from SearchBarComponent
    const handleSearch = (keyword: string) => {
        // Chuyển hướng sang SearchPage và truyền keyword qua state thay vì URL params
        navigate('/search', { state: { keyword } });
    };
    return (
        <div className="px-[50px] py-[30px] bg-[#FAFBFC]">
            <div className="relative">
                <div className="hidden md:block">
                    <Carousel autoplay>
                        <div>
                            <img
                                style={imageStyle}
                                src="https://i.pinimg.com/736x/f8/a7/01/f8a70144eb881afe78df0164e657e966.jpg"
                            />
                        </div>
                        <div>
                            <img
                                style={imageStyle}
                                src="https://i.pinimg.com/736x/89/39/17/893917edbcc0fee101262b467aada93d.jpg"
                            />
                        </div>
                        <div>
                            <img
                                style={imageStyle}
                                src="https://i.pinimg.com/736x/b7/b4/24/b7b4243f97193771177c5986b4b44614.jpg"
                            />
                        </div>
                    </Carousel>
                </div>

                {/* Phiên bản cho màn hình nhỏ */}
                <div className="block md:hidden">
                    <img
                        style={imageStyle}
                        src="https://i.pinimg.com/736x/f8/a7/01/f8a70144eb881afe78df0164e657e966.jpg"
                    />
                </div>

                {/* Search component */}
                <div
                    className="absolute bg-[#fff] rounded-md shadow-lg p-4 bottom-[-40px] left-1/2 transform -translate-x-1/2"
                    style={{ width: 'min(90%, 800px)' }}
                >
                    <SearchBarComponent onSearch={handleSearch} isSearchPage={false} />{' '}
                </div>
            </div>
            <main className="mt-[30px]">
                {/* Tiêu đề phần cửa hàng */}
                <Box
                    justifyContent="space-between"
                    display="flex"
                    alignItems="center"
                    sx={{
                        mb: 1,
                        flexDirection: { xs: 'column', md: 'row' }, // Cột trên mobile, hàng trên desktop
                        textAlign: { xs: 'center', md: 'left' }, // Căn giữa trên mobile
                    }}
                >
                    <div>
                        <h2>Các cửa hàng bạn nên đến</h2>
                        <span>Gợi ý những cửa hàng phù hợp</span>
                    </div>
                    <Link to={'/shops'}>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ mt: { xs: 2, md: 0 } }} // Thêm khoảng cách trên mobile
                        >
                            Xem thêm
                        </Button>
                    </Link>
                </Box>

                {/* Danh sách cửa hàng */}
                <Grid container spacing={3} sx={{ pb: 1 }}>
                    {shops && shops.length > 0 ? (
                        shops.map((shop, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <ShopCard shop={shop} />
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', width: '100%' }}>
                            Đang tải đánh giá hoặc không có đánh giá nào...
                        </Typography>
                    )}
                </Grid>
            </main>
            <main>
                {/* Tiêu đề phần bài viết */}
                <Box
                    justifyContent="space-between"
                    display="flex"
                    alignItems="center"
                    sx={{
                        mb: 1,
                        flexDirection: { xs: 'column', md: 'row' }, // Chuyển về cột trên màn hình nhỏ
                        textAlign: { xs: 'center', md: 'left' }, // Căn giữa text trên màn hình nhỏ
                    }}
                >
                    <div>
                        <h2>Các bài viết gần đây</h2>
                        <span>Tổng hợp các bài viết review</span>
                    </div>
                    <Link to={'/reviews'}>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ mt: { xs: 2, md: 0 } }} // Thêm margin trên màn hình nhỏ để không bị dính
                        >
                            Xem thêm
                        </Button>
                    </Link>
                </Box>

                <Grid container spacing={2}>
                    {dataReviews && dataReviews.length > 0 ? (
                        dataReviews.map((review, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <ReviewCard review={review} />
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', width: '100%' }}>
                            Đang tải đánh giá hoặc không có đánh giá nào...
                        </Typography>
                    )}
                </Grid>
            </main>
        </div>
    );
};

export default HomePage;
