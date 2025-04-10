'use client';
import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Rating,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    IconButton,
    Stack,
    Divider,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useSelector } from 'react-redux';

interface Review {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    like: number;
    helpful: number;
    notLike: number;
    rating: number;
    status: 'published' | 'draft' | 'archived';
    mediaUrlReview?: string[];
    idShop?: string;
    idUser?: string;
}

interface Shop {
    id: string;
    name: string;
}

interface RootState {
    user: {
        user: {
            id: string;
        };
    };
}

export default function UserPosts() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(5);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [shopInfo, setShopInfo] = useState<Shop | null>(null);

    // Lấy user ID từ Redux store
    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                // Gọi API lấy danh sách đánh giá của người dùng
                const response = await axios.get(`http://localhost:8080/reviews/getall/users/${user.id}`, {
                    params: {
                        limit: 12,
                        page,
                        sort: 'createdAt',
                    },
                });

                setReviews(response.data.data || []);
                setTotalPages(response.data.meta?.totalPages || 1);
                setLoading(false);
            } catch (error) {
                // console.error('Error fetching reviews:', error);
                // // Tạo dữ liệu mẫu nếu API lỗi
                // const mockReviews: Review[] = Array.from({ length: 10 }, (_, i) => ({
                //     id: `rev-${i + 1 + (page - 1) * 10}`,
                //     content: `Nội dung chi tiết của bài đánh giá số ${i + 1 + (page - 1) * 10}. Sản phẩm này rất tốt, tôi đã sử dụng được hơn 1 tháng và cảm thấy rất hài lòng với chất lượng. Giao hàng nhanh, đóng gói cẩn thận, nhân viên tư vấn nhiệt tình.`,
                //     createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                //     updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
                //     likes: Math.floor(Math.random() * 100),
                //     helpful: Math.floor(Math.random() * 50),
                //     notLike: Math.floor(Math.random() * 20),
                //     rating: Math.floor(Math.random() * 5) + 1,
                //     status: 'published',
                //     idShop: `shop-${(i % 3) + 1}`,
                //     idUser: user.id,
                //     mediaUrl:
                //         i % 3 === 0
                //             ? [
                //                   '/placeholder.svg?height=200&width=200',
                //                   '/placeholder.svg?height=200&width=200',
                //               ]
                //             : undefined,
                // }));

                // setReviews(mockReviews);
                // setTotalPages(5);
                // setLoading(false);
            }
        };

        if (user?.id) {
            fetchReviews();
        }
    }, [page, user?.id]);

    const fetchShopInfo = async (shopId: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/shops/${shopId}`);
            setShopInfo(response.data.data);
        } catch (error) {
            console.error('Error fetching shop info:', error);
            // Tạo dữ liệu mẫu nếu API lỗi
            setShopInfo({
                id: shopId,
                name: `Cửa hàng ${shopId.split('-')[1]}`,
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    // const truncateText = (text: string, maxLength: number) => {
    //     if (text.length <= maxLength) return text;
    //     return text.substring(0, maxLength) + '...';
    // };

    const handleOpenDetail = (review: Review) => {
        setSelectedReview(review);
        if (review.idShop) {
            fetchShopInfo(review.idShop);
        }
        setOpenDetailDialog(true);
    };

    const handleCloseDetail = () => {
        setOpenDetailDialog(false);
        setShopInfo(null);
    };

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
                    Các bài đăng của tôi
                </Typography>

                {loading ? (
                    <Stack spacing={2}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} variant="rectangular" height={60} />
                        ))}
                    </Stack>
                ) : (
                    <>
                        <TableContainer component={Paper} elevation={0} sx={{ mb: 3 }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nội dung</TableCell>
                                        <TableCell>Điểm đánh giá</TableCell>
                                        <TableCell>Ngày đánh giá</TableCell>
                                        <TableCell align="center">
                                            <ThumbUpIcon fontSize="small" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <HelpOutlineIcon fontSize="small" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <ThumbDownIcon fontSize="small" />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reviews.map((review) => (
                                        <TableRow
                                            key={review.id}
                                            hover
                                            onClick={() => handleOpenDetail(review)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>
                                                {review.reviewContent}
                                            </TableCell>
                                            <TableCell>
                                                <Rating
                                                    value={review.rating}
                                                    readOnly
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(review.createdAt)}</TableCell>
                                            <TableCell align="center">{review.like}</TableCell>
                                            <TableCell align="center">{review.helpful}</TableCell>
                                            <TableCell align="center">{review.notLike}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                            />
                        </Box>
                    </>
                )}
            </CardContent>

            {/* Chi tiết đánh giá */}
            <Dialog open={openDetailDialog} onClose={handleCloseDetail} maxWidth="md" fullWidth>
                {selectedReview && (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2 }}>
                            <Typography variant="h6">Chi tiết đánh giá</Typography>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseDetail}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Đánh giá:{' '}
                                    <Rating value={selectedReview.rating} readOnly size="small" />
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Ngày đánh giá: {formatDate(selectedReview.createdAt)}
                                </Typography>
                                {shopInfo && (
                                    <Typography variant="body2" color="text.secondary">
                                        Cửa hàng: {shopInfo.name}
                                    </Typography>
                                )}
                            </Box>

                            <Typography variant="body1" paragraph>
                                {selectedReview.content}
                            </Typography>

                            {selectedReview.mediaUrlReview && selectedReview.mediaUrlReview.length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Hình ảnh:
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {selectedReview.mediaUrlReview.map((image, index) => (
                                            <Grid item xs={6} sm={4} md={3} key={index}>
                                                <Box
                                                    component="img"
                                                    src={image}
                                                    alt={`Ảnh ${index + 1}`}
                                                    sx={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        borderRadius: 1,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ThumbUpIcon color="success" fontSize="small" />
                                        <Typography variant="body2">
                                            {selectedReview.like}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HelpOutlineIcon color="primary" fontSize="small" />
                                        <Typography variant="body2">
                                            {selectedReview.helpful}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ThumbDownIcon color="error" fontSize="small" />
                                        <Typography variant="body2">
                                            {selectedReview.notLike}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetail}>Đóng</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Card>
    );
}
