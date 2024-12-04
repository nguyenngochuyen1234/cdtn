import SearchComponent from '@/components/home/SearchComponent';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import { Carousel } from 'antd';
import React, { useState } from 'react'
import TravelCard from '@/components/TravelCard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FlightIcon from '@mui/icons-material/Flight';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import HotelIcon from '@mui/icons-material/Hotel';
import DestinationsCard from '@/components/DestinationsCard';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/models';
import { useNavigate } from "react-router-dom"

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
    height: '100vh',
    objectFit: 'cover',
    borderRadius: 30
};
const HomePage = () => {
    const [dataReviews, setDataReview] = useState<Review[] | null>(null)
    const navigate = useNavigate()

    const cardReviews = [
        {
            id: 1,
            idUser: 1,
            idShop: 1,
            reviewTitle: "Amazing coffee shop!",
            reviewContent: "The coffee here is absolutely fantastic, and the ambiance is very cozy.",
            dateReview: "2024-11-20",
            rating: 4.5,
            mediaUrlReview: [
                "https://www.posist.com/restaurant-times/wp-content/uploads/2023/07/How-To-Start-A-Coffee-Shop-Business-A-Complete-Guide.jpg"
            ]
        },
        {
            id: 2,
            idUser: 2,
            idShop: 2,
            reviewTitle: "Great place to relax",
            reviewContent: "I really enjoyed my time here. The service is excellent!",
            dateReview: "2024-11-21",
            rating: 5.0,
            mediaUrlReview: [
                "https://www.posist.com/restaurant-times/wp-content/uploads/2023/07/How-To-Start-A-Coffee-Shop-Business-A-Complete-Guide.jpg"
            ]
        },
        {
            id: 3,
            idUser: 3,
            idShop: 3,
            reviewTitle: "Good but could be better",
            reviewContent: "The drinks are nice, but the place was a bit too crowded for my liking.",
            dateReview: "2024-11-22",
            rating: 3.5,
            mediaUrlReview: [
                "https://www.posist.com/restaurant-times/wp-content/uploads/2023/07/How-To-Start-A-Coffee-Shop-Business-A-Complete-Guide.jpg"
            ]
        }
    ];

    const travelData = [
        {
            imageUrl: 'https://mia.vn/media/uploads/blog-du-lich/danh-lam-thang-canh-viet-nam-01-1710680490.jpeg',
            locationName: 'Vịnh Hạ Long',
        },
        {
            imageUrl: 'https://mia.vn/media/uploads/blog-du-lich/danh-lam-thang-canh-viet-nam-01-1710680490.jpeg',
            locationName: 'Phú Quốc',
        },
        {
            imageUrl: 'https://mia.vn/media/uploads/blog-du-lich/danh-lam-thang-canh-viet-nam-01-1710680490.jpeg',
            locationName: 'Sapa',
        },
        {
            imageUrl: 'https://mia.vn/media/uploads/blog-du-lich/danh-lam-thang-canh-viet-nam-01-1710680490.jpeg',
            locationName: 'Ninh Bình',
        },
        {
            imageUrl: 'https://mia.vn/media/uploads/blog-du-lich/danh-lam-thang-canh-viet-nam-01-1710680490.jpeg',
            locationName: 'Đà Lạt',
        },
        {
            imageUrl: 'https://mia.vn/media/uploads/blog-du-lich/danh-lam-thang-canh-viet-nam-01-1710680490.jpeg',
            locationName: 'Hội An',
        },

    ];

    return (

        <div className='px-[50px] py-[30px] bg-[#FAFBFC]'>
            <div>
                <Carousel autoplay className='relative'>
                    <div>
                        <img style={imageStyle} src='https://tl.cdnchinhphu.vn/Uploads/images/Ha%20Noi(19).jpg' />
                    </div>
                    <div>
                        <img style={imageStyle} src='https://i.pinimg.com/originals/cb/88/9c/cb889c6fb0faa4aed170de4454340f31.jpg' />
                    </div>
                    <div>
                        <img style={imageStyle} src='https://wallpapers.com/images/hd/hanoi-retains-its-traditional-traits-meba8ch7tnlz4k4i.jpg' />
                    </div>

                </Carousel>
                <div className='absolute bottom-0 bg-[#fff] rounded-md p-8 bottom-[-30%] right-[20%]'>
                    <p>Bạn đang tìm kiếm thứ gì</p>
                    <SearchComponent />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button startIcon={<AddIcon />}>Xem thêm review </Button>
                        <Button color="error" variant="contained" onClick={() => navigate("/search")} startIcon={<SendIcon />} className=''>
                            Đến ngay
                        </Button>
                    </Stack>
                </div>
            </div>

            <main className='mt-[30px]'>
                <Box justifyContent="space-between" display="flex" alignItems="center">
                    <div>
                        <h2>Các địa điểm bạn n  ên đến</h2>
                        <span>Tổng hợp các địa điểm du lịch nổi tiếng và những nhà hàng sang trọng</span>
                    </div>
                    <Button variant="outlined" color='error'>Xem thêm</Button>
                </Box>
                <div>
                    <Grid container spacing={2}>
                        {travelData.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <TravelCard imageUrl={item.imageUrl} locationName={item.locationName} />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </main>

            <main className='mt-[30px]'>
                <div className='mb-4'>
                    <h2>Danh mục bạn quan tâm</h2>
                    <span>Tổng hợp danh mục bài viết</span>
                </div>
                <div>
                    <Grid container spacing={2}>
                        {categories.map((category, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ textAlign: 'center', padding: 2 }}>
                                    {category.icon}
                                    <CardContent>
                                        <Typography variant="h6">
                                            {category.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </main>
            <main className='mt-[30px]'>
                <DestinationsCard />
            </main>
            <main className='mt-[30px]' >
                <Box justifyContent="space-between" display="flex" alignItems="center">
                    <div>
                        <h2>Các bài viết gần đây</h2>
                        <span>Tổng hợp các bài viết review </span>
                    </div>
                    <Button variant="outlined" color='error'>Xem thêm</Button>
                </Box>
                <Container>
                    <Grid container spacing={2}>
                        {cardReviews.map((review, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <ReviewCard review={review} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </div>


    )
}

export default HomePage