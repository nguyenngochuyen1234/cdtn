import { Box, Grid, Typography, Pagination, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import ReviewCard from '@/components/ReviewCard';
import commentApi from '@/api/comment'; // API để lấy comment
import reviewApi from '@/api/reviewApi'; // API để lấy review
import shopApi from '@/api/shopApi'; // API để lấy thông tin cửa hàng
import { Review } from '@/models'; // Import interface Review từ @/models
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import ReviewCardList from './shop/ReviewCardList';

// Định nghĩa interface tạm thời cho dữ liệu thô từ API (trước khi ánh xạ)
interface RawReview {
    id: string;
    idShop: string; // Thêm idShop để lấy thông tin cửa hàng
    user: { name: string; location: string; profileImage?: string };
    review: { rating: number; date: Date; text: string; images: string[], createAt: Date };
    reactions: { like: number; helpful: number; notLike: number; selectedReaction: string | null };
    comment?: { id: string; content: string; idReview: string; idShop: string; comment: boolean };
}

// Định nghĩa props cho ReviewList
interface ReviewListProps {
    shopId: string;
    searchKeyword: string;
    filter: number | null;
}

const ReviewList = ({ shopId, searchKeyword, filter }: ReviewListProps) => {
    // Trạng thái cho danh sách review, phân trang, loading, lỗi, và thông tin cửa hàng
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shopNames, setShopNames] = useState<{ [key: string]: string }>({}); // Lưu tên cửa hàng theo idShop

    const reviewsPerPage = 5; // Số bài viết trên mỗi trang
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    // Hàm lấy thông tin cửa hàng từ idShop
    const fetchShopName = async (idShop: string) => {
        try {
            const response = await shopApi.getShopById(idShop);
            if (response?.data?.data) {
                return response.data.data.name || 'Unknown Shop';
            }
            return 'Unknown Shop';
        } catch (error) {
            console.error(`Error fetching shop info for idShop ${idShop}:`, error);
            return 'Unknown Shop';
        }
    };

    // Hàm gọi API để lấy danh sách review
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    idShop: shopId,
                    keyword: searchKeyword,
                    page: page - 1,
                    size: reviewsPerPage,
                    sort: 'desc',
                    filter: filter || 0,
                };
                const response = await reviewApi.getAllReviewRecently(params);
                if (response?.data?.data) {
                    const reviewsWithReactionsAndComments: RawReview[] = await Promise.all(
                        response.data.data.map(async (item: any) => {
                            let comment = null;
                            try {
                                const commentResponse = await commentApi.getCommentByIdReview(
                                    item.id
                                );
                                if (commentResponse?.data?.success && commentResponse.data.data) {
                                    comment = commentResponse.data.data;
                                }
                            } catch (error) {
                                console.error(
                                    `Error fetching comment for review ${item.id}:`,
                                    error
                                );
                            }

                            return {
                                id: item.id,
                                idShop: item.idShop || shopId, // Lấy idShop từ dữ liệu review hoặc props
                                user: {
                                    name:
                                        item.userReviewInfo?.firstName ||
                                        item.userReviewInfo?.lastName
                                            ? `${item.userReviewInfo.firstName || ''} ${item.userReviewInfo.lastName || ''}`.trim()
                                            : item.userReviewInfo?.username?.includes('@gmail')
                                              ? item.userReviewInfo.username.replace(
                                                    '@gmail.com',
                                                    ''
                                                )
                                              : item.userReviewInfo?.username || 'Unknown',
                                    location: item.userReviewInfo
                                        ? `${item.userReviewInfo.ward || ''}, ${item.userReviewInfo.district || ''}, ${item.userReviewInfo.city || ''}`.trim()
                                        : 'Unknown',
                                    profileImage: item.userReviewInfo?.avatar,
                                },
                                review: {
                                    rating: item.rating || 0,
                                    date: new Date(item.createdAt).toLocaleDateString(),
                                    text: item.reviewContent || '',
                                    images:
                                        item.mediaUrlReview?.filter(
                                            (url: string | null) => url !== null
                                        ) || [],
                                },
                                reactions: {
                                    like: item.like || 0,
                                    helpful: item.helpful || 0,
                                    notLike: item.notLike || 0,
                                    selectedReaction: null,
                                },
                                comment,
                            };
                        })
                    );
                    // Lấy tên cửa hàng cho từng review
                    const shopNamePromises = reviewsWithReactionsAndComments.map(async (review) => {
                        if (review.idShop && !shopNames[review.idShop]) {
                            const shopName = await fetchShopName(review.idShop);
                            return { idShop: review.idShop, name: shopName };
                        }
                        return null;
                    });

                    const shopNameResults = await Promise.all(shopNamePromises);
                    const newShopNames = shopNameResults.reduce(
                        (acc: { [key: string]: string }, result) => {
                            if (result) {
                                acc[result.idShop] = result.name;
                            }
                            return acc;
                        },
                        { ...shopNames }
                    );

                    setShopNames(newShopNames);

                    // Ánh xạ dữ liệu sang định dạng mà ReviewCard mong đợi
                    const mappedReviews: Review[] = reviewsWithReactionsAndComments.map(
                        (rawReview) => ({
                            id: rawReview.id,
                            idService: '', // Thuộc tính thiếu, cung cấp giá trị mặc định
                            idUser: rawReview.user.name || 'Anh AN', // Giả sử idUser là tên người dùng
                            idShop: rawReview.idShop || shopId,
                            dateReview: rawReview.review.date, // Ánh xạ từ review.date
                            createdAt: rawReview.review.date, // Dùng review.date làm createdAt
                            reviewTitle: rawReview.user.name + ' - ' + rawReview.user.location, // Tạo tiêu đề từ user info
                            reviewContent: rawReview.review.text,
                            rating: rawReview.review.rating,
                            mediaUrlReview: rawReview.review.images,
                            like: rawReview.reactions.like,
                            helpful: rawReview.reactions.helpful,
                            notlike: rawReview.reactions.notLike,
                            userReviewInfo: {
                                avatar: rawReview.user.profileImage,
                                firstName: rawReview.user.name.split(' ')[0] || '',
                                lastName: rawReview.user.name.split(' ')[1] || '',
                                username: rawReview.user.name,
                            },
                            // Các thuộc tính còn thiếu, cung cấp giá trị mặc định
                            updatedAt: rawReview.review.date,
                            status: 'ACTIVE',
                            isDeleted: false,
                            comment: rawReview.comment?.content || '',
                            commentCreatedAt: rawReview.comment ? rawReview.review.date : '',
                            commentUpdatedAt: rawReview.comment ? rawReview.review.date : '',
                            commentStatus: rawReview.comment ? 'ACTIVE' : 'INACTIVE',
                            commentIsDeleted: rawReview.comment ? false : true,
                            commentUser: rawReview.comment ? 'Shop Owner' : '',
                            commentUserAvatar: '',
                            commentUserRole: rawReview.comment ? 'OWNER' : 'USER',
                        })
                    );

                    setReviews(mappedReviews);
                    setTotalPages(response.data.meta.totalPage || 1);
                } else {
                    setReviews([]);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setError('Không thể tải danh sách đánh giá. Vui lòng thử lại sau.');
                setReviews([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [shopId, page, searchKeyword, filter]); // Thêm các dependency vào useEffect

    // Xử lý thay đổi trang
    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

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

            {/* Hiển thị trạng thái loading hoặc lỗi */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            {/* Danh sách tất cả đánh giá */}
            {!loading && !error && (
                <>
                    <Grid container spacing={2}>
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    {/* Truyền thêm shopName vào ReviewCard nếu cần */}
                                    <ReviewCardList review={review} />
                                </Grid>
                            ))
                        ) : (
                            <Box sx={{ width: '100%', textAlign: 'center', my: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                    Không có đánh giá nào để hiển thị.
                                </Typography>
                            </Box>
                        )}
                    </Grid>

                    {/* Phân trang */}
                    {reviews.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewList;
