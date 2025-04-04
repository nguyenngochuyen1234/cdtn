import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Review } from '@/models';
import { Link, useNavigate } from 'react-router-dom';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'; // Hữu ích (outline)
import LightbulbIcon from '@mui/icons-material/Lightbulb'; // Hữu ích (filled)
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'; // Yêu thích (outline)
import HandshakeIcon from '@mui/icons-material/Handshake'; // Yêu thích (filled)
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'; // Không thích (outline)
import ThumbDownIcon from '@mui/icons-material/ThumbDown'; // Không thích (filled)
import { Rating } from './Rating';
import shopApi from '@/api/shopApi';
import reviewApi from '@/api/reviewApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import { toast } from 'react-toastify';

export interface ReviewCardProps {
    review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user); // Lấy trạng thái đăng nhập từ Redux
    const [shopInfo, setShopInfo] = useState<any>(null);
    const [reactions, setReactions] = useState({
        like: review.like,
        helpful: review.helpful,
        notLike: review.notlike,
        selectedReaction: null as 'LIKE' | 'HELPFUL' | 'NOTLIKE' | null, // Reaction được chọn
    });

    // Hàm lấy thông tin shop từ API
    const fetchShopInfo = async (shopId: string) => {
        try {
            const response = await shopApi.getShopById(shopId);
            setShopInfo(response.data.data);
        } catch (error) {
            console.error('Error fetching shop info:', error);
            setShopInfo(null);
        }
    };
    console.log(review);
    // Hàm gọi API cập nhật reaction
    const handleReaction = async (type: 'LIKE' | 'HELPFUL' | 'NOTLIKE') => {
        // Kiểm tra đăng nhập
        if (!user) {
            navigate('/auth/login'); // Chuyển hướng đến trang đăng nhập
            return;
        }

        // Kiểm tra nếu đã chọn reaction này trước đó
        const isRemoving = reactions.selectedReaction === type;

        try {
            const body = {
                type,
                remove: isRemoving, // remove: true nếu bỏ chọn, false nếu chọn mới
            };
            const result = await reviewApi.updateReactionById(review.id, body);
            if (!result.data.success) {
                toast.error(result.data.message || 'Có lỗi xảy ra');
                return;
            }

            // Hiển thị thông báo thành công
            toast.success(result.data.message || 'Cập nhật thành công!');
            // Cập nhật state sau khi gọi API thành công
            setReactions((prev) => {
                if (isRemoving) {
                    // Bỏ chọn reaction hiện tại
                    return {
                        ...prev,
                        like: type === 'LIKE' ? prev.like - 1 : prev.like,
                        helpful: type === 'HELPFUL' ? prev.helpful - 1 : prev.helpful,
                        notLike: type === 'NOTLIKE' ? prev.notLike - 1 : prev.notLike,
                        selectedReaction: null,
                    };
                } else if (!prev.selectedReaction) {
                    // Chỉ cho phép chọn nếu chưa có reaction nào được chọn
                    return {
                        ...prev,
                        like: type === 'LIKE' ? prev.like + 1 : prev.like,
                        helpful: type === 'HELPFUL' ? prev.helpful + 1 : prev.helpful,
                        notLike: type === 'NOTLIKE' ? prev.notLike + 1 : prev.notLike,
                        selectedReaction: type,
                    };
                }
                return prev; // Nếu đã chọn reaction khác, không làm gì
            });
        } catch (error) {
            console.error('Error updating reaction:', error);
        }
    };

    useEffect(() => {
        if (review.idShop) {
            fetchShopInfo(review.idShop);
        }
    }, [review.idShop]);
    console.log(shopInfo)
    return (
        <Card
            sx={{
                maxWidth: 345,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
            }}
        >
            <CardContent sx={{ p: 2 }}>
                {/* Header: Tên người dùng và thời gian */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                            src={review.userReviewInfo?.avatar || 'https://via.placeholder.com/40'}
                            alt={
                                `${review.userReviewInfo?.firstName} ${review.userReviewInfo?.lastName}` ||
                                'Anonymous'
                            }
                            sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {review.userReviewInfo
                                ? `${review.userReviewInfo.lastName} ${review.userReviewInfo.firstName}`
                                : 'Anonymous'}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </Typography>
                </Box>

                {/* Ảnh */}
                <CardMedia
                    component="img"
                    sx={{
                        height: '140px',
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: 0,
                    }}
                    image={review.mediaUrlReview[0] || 'https://via.placeholder.com/300x200'}
                    alt={review.reviewTitle || 'Review Image'}
                />

                {/* Tiêu đề và rating */}
                <Typography variant="h6" component="div" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {shopInfo?.name || 'Unknown Shop'}
                </Typography>
                <Rating value={review.rating} readOnly />

                {/* Nội dung review */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {review.reviewContent}
                </Typography>

                {/* Icon tương tác */}
                <Box display="flex" gap={1}>
                    {/* Hữu ích */}
                    <Tooltip title="Hữu ích">
                        <IconButton onClick={() => handleReaction('HELPFUL')}>
                            {reactions.selectedReaction === 'HELPFUL' ? (
                                <LightbulbIcon sx={{ color: '#e91e63' }} fontSize="small" />
                            ) : (
                                <LightbulbOutlinedIcon fontSize="small" />
                            )}
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {reactions.helpful}
                            </Typography>
                        </IconButton>
                    </Tooltip>
                    {/* Yêu thích */}
                    <Tooltip title="Yêu thích">
                        <IconButton onClick={() => handleReaction('LIKE')}>
                            {reactions.selectedReaction === 'LIKE' ? (
                                <HandshakeIcon sx={{ color: '#4caf50' }} fontSize="small" />
                            ) : (
                                <HandshakeOutlinedIcon fontSize="small" />
                            )}
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {reactions.like}
                            </Typography>
                        </IconButton>
                    </Tooltip>
                    {/* Không thích */}
                    <Tooltip title="Không thích">
                        <IconButton onClick={() => handleReaction('NOTLIKE')}>
                            {reactions.selectedReaction === 'NOTLIKE' ? (
                                <ThumbDownIcon sx={{ color: '#f44336' }} fontSize="small" />
                            ) : (
                                <ThumbDownOutlinedIcon fontSize="small" />
                            )}
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {reactions.notLike}
                            </Typography>
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReviewCard;
