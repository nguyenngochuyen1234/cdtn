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
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
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
    const user = useSelector((state: RootState) => state.user.user);
    const [shopInfo, setShopInfo] = useState<any>(null);
    const [reactions, setReactions] = useState({
        like: review.like,
        helpful: review.helpful,
        notLike: review.notlike,
        selectedReaction: null as 'LIKE' | 'HELPFUL' | 'NOTLIKE' | null,
    });

    const fetchShopInfo = async (shopId: string) => {
        try {
            const response = await shopApi.getShopById(shopId);
            setShopInfo(response.data.data);
        } catch (error) {
            console.error('Error fetching shop info:', error);
            setShopInfo(null);
        }
    };

    const handleReaction = async (type: 'LIKE' | 'HELPFUL' | 'NOTLIKE') => {
        if (!user) {
            navigate('/auth/login');
            return;
        }

        const isRemoving = reactions.selectedReaction === type;

        try {
            const body = {
                type,
                remove: isRemoving,
            };
            const result = await reviewApi.updateReactionById(review.id, body);
            if (!result.data.success) {
                toast.error(result.data.message || 'Có lỗi xảy ra');
                return;
            }

            toast.success(result.data.message || 'Cập nhật thành công!');
            setReactions((prev) => {
                if (isRemoving) {
                    return {
                        ...prev,
                        like: type === 'LIKE' ? prev.like - 1 : prev.like,
                        helpful: type === 'HELPFUL' ? prev.helpful - 1 : prev.helpful,
                        notLike: type === 'NOTLIKE' ? prev.notLike - 1 : prev.notLike,
                        selectedReaction: null,
                    };
                } else if (!prev.selectedReaction) {
                    return {
                        ...prev,
                        like: type === 'LIKE' ? prev.like + 1 : prev.like,
                        helpful: type === 'HELPFUL' ? prev.helpful + 1 : prev.helpful,
                        notLike: type === 'NOTLIKE' ? prev.notLike + 1 : prev.notLike,
                        selectedReaction: type,
                    };
                }
                return prev;
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

    return (
        <Link to={`/detailPost/${review.idShop}`}>
            <Card
                sx={{
                    width: 300, // Fixed width
                    height: 380, // Fixed height
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <CardContent sx={{ p: 2, flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                                src={
                                    review.userReviewInfo?.avatar ||
                                    'http://res.cloudinary.com/dbk09oy6h/image/upload/v1745074840/IMAGE_USER/68036fd9e50e7d57aa4b353e/1745074841434.png.png'
                                }
                                alt={
                                    `${review.userReviewInfo?.firstName} ${review.userReviewInfo?.lastName}` ||
                                    'Anonymous'
                                }
                                sx={{ width: 32, height: 32 }}
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {review.userReviewInfo
                                    ? review.userReviewInfo.lastName ||
                                      review.userReviewInfo.firstName
                                        ? `${review.userReviewInfo.lastName || ''} ${review.userReviewInfo.firstName || ''}`.trim()
                                        : review.userReviewInfo.username?.includes('@gmail')
                                          ? review.userReviewInfo.username.replace('@gmail.com', '')
                                          : review.userReviewInfo.username
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

                    <CardMedia
                        component="img"
                        sx={{
                            height: 140, // Fixed image height
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: 0,
                        }}
                        image={
                            review.mediaUrlReview[0] ||
                            'http://res.cloudinary.com/dbk09oy6h/image/upload/v1744996048/IMAGE_SHOP/680286055f6b6806678e06b0/1744996046721.jpg.jpg'
                        }
                        alt={review.reviewTitle || 'Review Image'}
                    />

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            mt: 1,
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {shopInfo?.name || 'Unknown Shop'}
                    </Typography>
                    <Rating value={review.rating} readOnly />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            height: 40, // Fixed height for review content
                        }}
                    >
                        {review.reviewContent}
                    </Typography>

                    <Box display="flex" gap={1}>
                        <Tooltip title="Hữu ích">
                            <IconButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleReaction('HELPFUL');
                                }}
                            >
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
                        <Tooltip title="Yêu thích">
                            <IconButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleReaction('LIKE');
                                }}
                            >
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
                        <Tooltip title="Không thích">
                            <IconButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleReaction('NOTLIKE');
                                }}
                            >
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
        </Link>
    );
};

export default ReviewCard;
