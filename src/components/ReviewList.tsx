import { Box, Grid, Typography, Pagination } from '@mui/material';
import React, { useState } from 'react';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/models';
import Footer from '@/components/Footer';

const ReviewList = () => {
    const [dataReviews] = useState<Review[]>([
        {
            id: 1,
            idUser: 1,
            idShop: 1,
            reviewTitle: 'Amazing coffee shop!',
            reviewContent:
                'The coffee here is absolutely fantastic, and the ambiance is very cozy.',
            dateReview: '2024-11-20',
            rating: 4.5,
            mediaUrlReview: [
                'https://www.posist.com/restaurant-times/wp-content/uploads/2023/07/How-To-Start-A-Coffee-Shop-Business-A-Complete-Guide.jpg',
            ],
        },
        {
            id: 2,
            idUser: 2,
            idShop: 2,
            reviewTitle: 'Great place to relax',
            reviewContent: 'I really enjoyed my time here. The service is excellent!',
            dateReview: '2024-11-21',
            rating: 5.0,
            mediaUrlReview: [
                'https://www.posist.com/restaurant-times/wp-content/uploads/2023/07/How-To-Start-A-Coffee-Shop-Business-A-Complete-Guide.jpg',
            ],
        },
        {
            id: 3,
            idUser: 3,
            idShop: 3,
            reviewTitle: 'Good but could be better',
            reviewContent:
                'The drinks are nice, but the place was a bit too crowded for my liking.',
            dateReview: '2024-11-22',
            rating: 3.5,
            mediaUrlReview: [
                'https://www.posist.com/restaurant-times/wp-content/uploads/2023/07/How-To-Start-A-Coffee-Shop-Business-A-Complete-Guide.jpg',
            ],
        },
        // Tạo thêm nhiều đánh giá để kiểm tra phân trang
        ...Array.from({ length: 30 }, (_, index) => ({
            id: index + 4,
            idUser: index + 4,
            idShop: index + 4,
            reviewTitle: `Review ${index + 4}`,
            reviewContent: `This is a sample review content for review ${index + 4}.`,
            dateReview: '2024-11-23',
            rating: 4.0,
            mediaUrlReview: [
                'https://www.posist.com/restaurant-times/wp-content/uploads/2023/07/How-To-Start-A-Coffee-Shop-Business-A-Complete-Guide.jpg',
            ],
        })),
    ]);

    const itemsPerPage = 8; // Số bài viết trên mỗi trang
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(dataReviews.length / itemsPerPage);

    // Cắt dữ liệu theo trang hiện tại
    const displayedReviews = dataReviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="px-[50px] py-[30px] bg-[#FAFBFC]">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2">
                    Tất cả bài viết đánh giá
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Xem toàn bộ các bài viết review từ cộng đồng
                </Typography>
            </Box>

            {/* Danh sách tất cả đánh giá */}
            <Grid container spacing={2}>
                {displayedReviews.map((review, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <ReviewCard review={review} />
                    </Grid>
                ))}
            </Grid>

            {/* Phân trang */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                />
            </Box>
        </div>
    );
};

export default ReviewList;
