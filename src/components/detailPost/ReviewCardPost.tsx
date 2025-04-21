import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Stack, Box, Grid, Modal, Tooltip, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import reviewApi from '@/api/reviewApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import commentApi from '@/api/comment';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import CustomPagination from '../shop/CustomPagination';

interface ReviewCardPostProps {
    shopId: string;
    filter: number | null;
    searchKeyword: string;
}

interface Review {
    id: string;
    user: { name: string; location: string; profileImage?: string };
    review: { rating: number; date: string; text: string; images: string[] };
    reactions: { like: number; helpful: number; notLike: number; selectedReaction: string | null };
    comment?: { id: string; content: string; idReview: string; idShop: string; comment: boolean };
}

function ReviewCardPost({ shopId, filter, searchKeyword }: ReviewCardPostProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);

    const reviewsPerPage = 5; // Changed from 6 to 5 as per requirement
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const params = {
                    idShop: shopId,
                    keyword: searchKeyword,
                    page: page - 1,
                    size: reviewsPerPage,
                    sort: 'desc',
                    filter: filter || 0,
                };
                const response = await reviewApi.getAllReviewByIdShop(shopId, params);
                if (response?.data?.data) {
                    const reviewsWithReactionsAndComments = await Promise.all(
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
                                user: {
                                    name:
                                        item.userReviewInfo.firstName ||
                                        item.userReviewInfo.lastName
                                            ? `${item.userReviewInfo.firstName || ''} ${item.userReviewInfo.lastName || ''}`.trim()
                                            : item.userReviewInfo.username?.includes('@gmail')
                                              ? item.userReviewInfo.username.replace(
                                                    '@gmail.com',
                                                    ''
                                                )
                                              : item.userReviewInfo.username,
                                    location: `${item.userReviewInfo.ward}, ${item.userReviewInfo.district}, ${item.userReviewInfo.city}`,
                                    profileImage: item.userReviewInfo.avatar,
                                },
                                review: {
                                    rating: item.rating,
                                    date: new Date(item.createdAt).toLocaleDateString(),
                                    text: item.reviewContent,
                                    images: item.mediaUrlReview.filter(
                                        (url: string | null) => url !== null
                                    ),
                                },
                                reactions: {
                                    like: item.like,
                                    helpful: item.helpful,
                                    notLike: item.notLike,
                                    selectedReaction: null,
                                },
                                comment,
                            };
                        })
                    );
                    setReviews(reviewsWithReactionsAndComments);

                    // Ensure total is a valid number, default to 0 if undefined
                    const totalReviews = response.data.meta.total ?? 0;
                    const calculatedTotalPages = response.data.meta.totalPage; // Default to 1 if calculation fails
                    setTotalPages(calculatedTotalPages);
                } else {
                    setReviews([]);
                    setTotalPages(1); // Default to 1 if no data
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setReviews([]);
                setTotalPages(1); // Default to 1 on error
            }
        };
        fetchReviews();
    }, [shopId, page, filter, searchKeyword]);

    const handleSeeAllImages = (images: string[]) => {
        setSelectedImages(images);
        setShowModal(true);
    };

    const handlePageChange = (value: number) => {
        setPage(value);
    };

    const handleReaction = (reviewId: string) => async (type: 'LIKE' | 'HELPFUL' | 'NOTLIKE') => {
        if (!user) {
            toast.info('Vui lòng đăng nhập để thực hiện hành động này!');
            navigate('/auth/login');
            return;
        }

        const review = reviews.find((r) => r.id === reviewId);
        if (!review) return;

        const isRemoving = review.reactions.selectedReaction === type;

        try {
            const body = {
                type,
                remove: isRemoving,
            };
            const result = await reviewApi.updateReactionById(reviewId, body);
            if (!result.data.success) {
                toast.error(result.data.message || 'Có lỗi xảy ra');
                return;
            }

            toast.success(result.data.message || 'Cập nhật thành công!');
            setReviews((prev) =>
                prev.map((r) => {
                    if (r.id !== reviewId) return r;
                    if (isRemoving) {
                        return {
                            ...r,
                            reactions: {
                                ...r.reactions,
                                like: type === 'LIKE' ? r.reactions.like - 1 : r.reactions.like,
                                helpful:
                                    type === 'HELPFUL'
                                        ? r.reactions.helpful - 1
                                        : r.reactions.helpful,
                                notLike:
                                    type === 'NOTLIKE'
                                        ? r.reactions.notLike - 1
                                        : r.reactions.notLike,
                                selectedReaction: null,
                            },
                        };
                    } else if (!r.reactions.selectedReaction) {
                        return {
                            ...r,
                            reactions: {
                                ...r.reactions,
                                like: type === 'LIKE' ? r.reactions.like + 1 : r.reactions.like,
                                helpful:
                                    type === 'HELPFUL'
                                        ? r.reactions.helpful + 1
                                        : r.reactions.helpful,
                                notLike:
                                    type === 'NOTLIKE'
                                        ? r.reactions.notLike + 1
                                        : r.reactions.notLike,
                                selectedReaction: type,
                            },
                        };
                    }
                    return r;
                })
            );
        } catch (error) {
            console.error('Error updating reaction:', error);
            toast.error('Có lỗi xảy ra khi cập nhật phản hồi!');
        }
    };

    return (
        <>
            {reviews.length > 0 ? (
                <>
                    {reviews.map((item, index) => (
                        <Stack key={index} direction="row" spacing={2} sx={{ mb: 4 }}>
                            <Avatar src={item.user.profileImage} alt={item.user.name} />
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {item.user.name}
                                </Typography>
                                {/* {item.user.location && (
                                    <Typography variant="body2" color="text.secondary">
                                        {item.user.location}
                                    </Typography>
                                )} */}
                                <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                                    {[...Array(5)].map((_, index) => (
                                        <StarIcon
                                            key={index}
                                            sx={{
                                                color:
                                                    index < item.review.rating
                                                        ? '#f44336'
                                                        : '#e0e0e0',
                                                fontSize: 20,
                                            }}
                                        />
                                    ))}
                                    <Typography variant="body2" color="text.secondary">
                                        {item.review.date}
                                    </Typography>
                                </Stack>
                                <Typography variant="body1" mt={1}>
                                    {item.review.text}
                                </Typography>
                                {item.review.images.length > 0 && (
                                    <Stack direction="row" spacing={1} mt={2}>
                                        {item.review.images.slice(0, 3).map((image, imgIndex) => (
                                            <Box
                                                key={imgIndex}
                                                component="img"
                                                src={image}
                                                alt={`Review image ${imgIndex + 1}`}
                                                sx={{
                                                    width: 150,
                                                    height: 150,
                                                    objectFit: 'cover',
                                                    borderRadius: 1,
                                                }}
                                            />
                                        ))}
                                        {item.review.images.length > 3 && (
                                            <Typography
                                                variant="body2"
                                                color="primary"
                                                sx={{ cursor: 'pointer', alignSelf: 'center' }}
                                                onClick={() =>
                                                    handleSeeAllImages(item.review.images)
                                                }
                                            >
                                                Xem tất cả {item.review.images.length} ảnh
                                            </Typography>
                                        )}
                                    </Stack>
                                )}
                                {/* Reaction Buttons */}
                                <Box display="flex" gap={1} mt={2}>
                                    <Tooltip title="Hữu ích">
                                        <span>
                                            <IconButton
                                                onClick={() => handleReaction(item.id)('HELPFUL')}
                                                disabled={!user}
                                            >
                                                {item.reactions.selectedReaction === 'HELPFUL' ? (
                                                    <LightbulbIcon
                                                        sx={{ color: '#e91e63' }}
                                                        fontSize="small"
                                                    />
                                                ) : (
                                                    <LightbulbOutlinedIcon fontSize="small" />
                                                )}
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                    {item.reactions.helpful}
                                                </Typography>
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="Thích">
                                        <span>
                                            <IconButton
                                                onClick={() => handleReaction(item.id)('LIKE')}
                                                disabled={!user}
                                            >
                                                {item.reactions.selectedReaction === 'LIKE' ? (
                                                    <HandshakeIcon
                                                        sx={{ color: '#4caf50' }}
                                                        fontSize="small"
                                                    />
                                                ) : (
                                                    <HandshakeOutlinedIcon fontSize="small" />
                                                )}
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                    {item.reactions.like}
                                                </Typography>
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="Không thích">
                                        <span>
                                            <IconButton
                                                onClick={() => handleReaction(item.id)('NOTLIKE')}
                                                disabled={!user}
                                            >
                                                {item.reactions.selectedReaction === 'NOTLIKE' ? (
                                                    <ThumbDownIcon
                                                        sx={{ color: '#f44336' }}
                                                        fontSize="small"
                                                    />
                                                ) : (
                                                    <ThumbDownOutlinedIcon fontSize="small" />
                                                )}
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                    {item.reactions.notLike}
                                                </Typography>
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Box>
                                {/* Shop Owner's Comment - Only render if comment exists */}
                                {item.comment && item.comment.content && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            Phản hồi của cửa hàng
                                        </Typography>
                                        <Typography variant="body2">
                                            {item.comment.content}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    ))}
                    <Stack direction="row" justifyContent="center" mt={3}>
                        <CustomPagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </Stack>
                </>
            ) : (
                <Typography variant="body1">Chưa có đánh giá nào cho cửa hàng</Typography>
            )}

            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box
                    sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        p: 3,
                        maxWidth: '90%',
                        maxHeight: '90%',
                        overflowY: 'auto',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        onClick={() => setShowModal(false)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold" mb={2}>
                        Ảnh đánh giá
                    </Typography>
                    <Grid container spacing={2}>
                        {selectedImages.slice(0, 5).map((image, index) => (
                            <Grid item xs={4} key={index}>
                                <Box
                                    component="img"
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    sx={{
                                        width: '100%',
                                        height: 150,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}

export default ReviewCardPost;
