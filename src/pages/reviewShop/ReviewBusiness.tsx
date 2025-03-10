'use client';

import { useEffect, useState } from 'react';
import {
    Rating,
    Button,
    TextField,
    Chip,
    Avatar,
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    Stack,
    ThemeProvider,
    createTheme,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { ThumbUp, ChatBubbleOutline, ChevronLeft, ChevronRight } from '@mui/icons-material';
import StarRating from '@/components/detailPost/StarRating';
import { useNavigate, useParams } from 'react-router-dom';
import shopApi from '@/api/shopApi';
import { Review, Shop } from '@/models';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import reviewApi from '@/api/reviewApi';
import ReviewCard from '@/utils/ReviewCard';

const theme = createTheme({
    palette: {
        primary: {
            main: '#dc2626',
        },
    },
});

export default function ReviewBusiness() {
    const { id } = useParams();
    const user = useSelector((state: RootState) => state.user.user);
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loadingShop, setLoadingShop] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState('');
    const [showReviews, setShowReviews] = useState(false);
    const [shop, setShop] = useState<Shop | null>();
    const [recentReviews, setRecentReviews] = useState<Review[] | null>([]);
    const fetchDataShop = async () => {
        try {
            if (id) {
                setLoadingShop(true);
                const data = await shopApi.getShopById(id);
                const resReviews = await reviewApi.getAllReviewByIdShop(id);
                setRecentReviews(resReviews.data.data);
                setShop(data.data);
            }
        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setLoadingShop(false);
        }
    };
    const [imagePreviews, setImagePreviews] = useState<File[] | null>();
    useEffect(() => {
        fetchDataShop();
    }, []);

    const handleFileChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (files.length > 0) {
            setImagePreviews(files);
        }
    };
    const handlePost = async () => {
        try {
            if (user) {
                setLoadingPost(true);
                const mediaUrls = await shopApi.uploadMultipleImage(
                    imagePreviews as File[],
                    user.email as string
                );
                const response = await reviewApi.AddReview({
                    reviewTitle: '',
                    reviewContent: review,
                    rating: rating,
                    mediaUrlReview: mediaUrls.data.data,
                    idShop: id as string,
                });

                setSnackbarMessage(response.data.message);
                setSnackbarSeverity(response.data.success ? 'success' : 'error');
                setSnackbarOpen(true);

                if (response.data.success) {
                    setTimeout(() => navigate('/'), 1500);
                }
            }
        } catch (error) {
            console.error('Error posting review:', error);
        } finally {
            setLoadingPost(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box maxWidth="4xl" mx="auto" p={3} overflow="hidden">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    {loadingShop ? (
                        <CircularProgress />
                    ) : (
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            {shop?.name}
                        </Typography>
                    )}
                </Box>

                <Box display="flex" justifyContent="space-between" mb={4}>
                    <div className="w-[50%]">
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        <StarRating
                                            size="big"
                                            rating={rating}
                                            setRating={setRating}
                                        />
                                        <Button
                                            href="#"
                                            color="primary"
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Read our review guidelines
                                        </Button>
                                    </Box>

                                    <Box>
                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            A few things to consider in your review
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Chip label="Food" variant="outlined" />
                                            <Chip label="Service" variant="outlined" />
                                            <Chip label="Ambiance" variant="outlined" />
                                        </Stack>
                                    </Box>

                                    <TextField
                                        multiline
                                        rows={4}
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Start your review..."
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <Box mt={4}>
                                        <Typography variant="h6" className="mb-2">
                                            Media URLs
                                        </Typography>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange()}
                                        />
                                        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                                            {imagePreviews &&
                                                imagePreviews.map((src, index) => (
                                                    <img
                                                        key={index}
                                                        src={URL.createObjectURL(src)}
                                                        alt={`Media URL Preview ${index + 1}`}
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            objectFit: 'cover',
                                                            borderRadius: 8,
                                                        }}
                                                    />
                                                ))}
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        onClick={handlePost}
                                        disabled={loadingPost}
                                    >
                                        {loadingPost ? (
                                            <CircularProgress size={24} sx={{ color: 'white' }} />
                                        ) : (
                                            'Post Review'
                                        )}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </div>

                    <Box
                        sx={{
                            width: '28%',
                            border: '1px solid #f0f0f0',
                            transition: 'transform 0.5s ease',
                            position: 'relative',
                            left: 20,
                            transform: showReviews ? 'translateX(-50px)' : 'translateX(100%)',
                        }}
                    >
                        <IconButton
                            onClick={() => setShowReviews((prev) => !prev)}
                            sx={{
                                position: 'absolute',
                                left: -20,
                                zIndex: 99,
                                backgroundColor: 'rgba(107,109,111,0.12)',

                                borderRadius: 1,
                                width: 20,
                                color: '#000',
                                '&:hover': {
                                    backgroundColor: 'rgba(107,109,111,0.12)',
                                },
                            }}
                        >
                            {!showReviews ? <ChevronLeft /> : <ChevronRight />}
                        </IconButton>
                        <Typography variant="h5" component="h2" fontWeight="bold" mb={3}>
                            Recent Reviews
                        </Typography>

                        <Stack spacing={3}>
                            {(recentReviews || []).map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}
