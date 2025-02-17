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
import { Shop } from '@/models';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import reviewApi from '@/api/reviewApi';

interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    content: string;
    likes: number;
    comments: number;
}

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

    const fetchDataShop = async () => {
        try {
            if (id) {
                setLoadingShop(true);
                const data = await shopApi.getShopById(id);
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
    const recentReviews: Review[] = [
        {
            id: '1',
            author: 'Jeremi A.',
            rating: 3,
            date: '1/23/2025',
            content:
                "At 4 pm on a Saturday, we needed a reservation for a party of 15 that night, and they magically made it happen (even tho they don't do rezzies normally). Even though folks showed up in waves, our server was on it, bringing rounds of bread and wine and water and mocktails...",
            likes: 0,
            comments: 0,
        },
        {
            id: '2',
            author: 'Huaerzeng',
            rating: 5,
            date: '1/15/2025',
            content:
                'Amazing service and the food was great. My girl got the spaghetti and meatballs, delicious. I ordered one of their pizzas and soup of the day. The soup of the day was fantastic. The pizza was a nice size and tasted great as well, not too overwhelming with bread or oils. The overall ambiance is pleasant and I liked their decors. Our server was a...',
            likes: 0,
            comments: 0,
        },
    ];
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
                    {/* Phần Review */}
                    <Card sx={{ width: '50%', p: 0 }}>
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
                                    <StarRating rating={rating} setRating={setRating} />
                                    <Button href="#" color="primary" sx={{ textTransform: 'none' }}>
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
                            {recentReviews.map((review) => (
                                <Card key={review.id} sx={{ boxShadow: 0 }}>
                                    <CardContent>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="flex-start"
                                        >
                                            <Box display="flex" gap={2}>
                                                <Avatar>{review.author[0]}</Avatar>
                                                <Box>
                                                    <Typography fontWeight="bold">
                                                        {review.author}
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Rating
                                                            value={review.rating}
                                                            readOnly
                                                            size="small"
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {review.date}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box display="flex" alignItems="center">
                                                <IconButton size="small">
                                                    <ThumbUp fontSize="small" />
                                                </IconButton>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    mr={2}
                                                >
                                                    {review.likes}
                                                </Typography>
                                                <IconButton size="small">
                                                    <ChatBubbleOutline fontSize="small" />
                                                </IconButton>
                                                <Typography variant="body2" color="text.secondary">
                                                    {review.comments}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" mt={2}>
                                            {review.content}
                                        </Typography>
                                        <Button sx={{ mt: 1, p: 0, minWidth: 0 }} color="primary">
                                            Read more
                                        </Button>
                                    </CardContent>
                                </Card>
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
