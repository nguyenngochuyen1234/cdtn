// components/WriteReview.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Rating,
    TextField,
    Button,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import shopApi from '@/api/shopApi';
import userApi from '@/api/userApi';
import reviewApi from '@/api/reviewApi';
import { toast } from 'react-toastify';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

interface ReviewData {
    reviewContent: string;
    rating: number;
    mediaUrlReview: string[];
    idService?: string;
    idShop?: string;
}

const WriteReview: React.FC = () => {
    const { shopId, serviceId } = useParams<{ shopId?: string; serviceId?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [entityName, setEntityName] = useState<string>(''); // Could be shop or service name
    const [rating, setRating] = useState<number | null>(null);
    const [reviewTitle, setReviewTitle] = useState<string>('');
    const [reviewContent, setReviewContent] = useState<string>('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [resolvedShopId, setResolvedShopId] = useState<string | null>(null);

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/auth/login', { state: { from: location.pathname } });
        }
    }, [navigate, location]);

    // Fetch shop or service details
    useEffect(() => {
        const fetchEntityDetails = async () => {
            try {
                if (serviceId) {
                    // Fetch service details
                    const response = await shopApi.getDetailServiceById(serviceId);
                    if (response?.data) {
                        const serviceData = response.data.data;
                        setEntityName(serviceData.name || 'Dịch vụ không xác định');
                        setResolvedShopId(serviceData.idShop); // Get shopId from service
                    }
                } else if (shopId) {
                    // Fetch shop details
                    const response = await shopApi.getShopById(shopId);
                    if (response?.data) {
                        setEntityName(response.data.data.name || 'Cửa hàng không xác định');
                        setResolvedShopId(shopId);
                    }
                }
            } catch (error) {
                console.error('Error fetching entity details:', error);
                toast.error('Không thể lấy thông tin');
            }
        };

        fetchEntityDetails();
    }, [shopId, serviceId]);

    // Handle photo upload
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newPhotos = Array.from(event.target.files);
            const totalPhotos = photos.length + newPhotos.length;

            if (totalPhotos > 5) {
                toast.error('Bạn chỉ có thể upload tối đa 5 ảnh');
                return;
            }

            setPhotos((prev) => [...prev, ...newPhotos]);
        }
    };

    // Handle photo removal
    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    // Upload photos to server
    const uploadPhotos = async (files: File[]): Promise<string[]> => {
        const uploadedUrls: string[] = [];
        for (const file of files) {
            try {
                const response = await userApi.uploadImage(file);
                if (response.data) {
                    uploadedUrls.push(response.data.data);
                }
            } catch (error) {
                console.error('Error uploading photo:', error);
                toast.error(`Không thể upload ảnh ${file.name}`);
            }
        }
        return uploadedUrls;
    };

    // Handle review submission
    const handleSubmit = async () => {
        if (!rating) {
            toast.error('Vui lòng chọn số sao đánh giá');
            return;
        }
        if (!reviewContent.trim()) {
            toast.error('Nội dung đánh giá không được để trống');
            return;
        }
        if (reviewContent.length < 20) {
            toast.error('Đánh giá phải có ít nhất 30 ký tự');
            return;
        }

        setLoading(true);
        try {
            let uploadedPhotoUrls: string[] = [];
            if (photos.length > 0) {
                uploadedPhotoUrls = await uploadPhotos(photos);
            }

            const reviewData: ReviewData = {
                reviewContent,
                rating: rating!,
                mediaUrlReview: uploadedPhotoUrls,
                idShop: resolvedShopId || undefined,
                idService: serviceId || undefined,
            };

            const response = await reviewApi.AddReview(reviewData);
            if (!response.data.success) {
                toast.error(response.data.message || 'Có lỗi xảy ra khi gửi đánh giá');
                return;
            }

            toast.success('Đánh giá đã được gửi thành công');
            navigate(`/detailPost/${resolvedShopId}`);
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 5 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Đánh giá : {entityName}
            </Typography>
            <Box
                sx={{
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: 1,
                    p: 2,
                    mb: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating
                        value={rating}
                        onChange={(event, newValue) => setRating(newValue)}
                        size="large"
                        precision={1} // Allows half-star ratings
                        sx={{
                            mr: 2,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // Increase size across breakpoints
                            '& .MuiRating-iconFilled': {
                                color: '#FFD700', // Gold color for filled stars
                            },
                            '& .MuiRating-iconEmpty': {
                                color: '#D3D3D3', // Light gray color for empty stars
                            },
                            '& .MuiRating-iconHover': {
                                color: '#FFC107', // Slightly darker gold on hover
                            },
                        }}
                    />
                    <Typography variant="body1">Điểm đánh giá</Typography>
                </Box>

                <TextField
                    label="Nội dung đánh giá..."
                    multiline
                    rows={6}
                    fullWidth
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                    Nội dung đánh giá cần ít nhất 20 ký tự
                </Typography>
            </Box>

            <Typography variant="body2" fontWeight="bold" mb={1}>
                Tải ảnh đánh giá
            </Typography>
            <Box
                sx={{
                    border: '1px dashed',
                    borderColor: 'grey.500',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center',
                    mb: 2,
                }}
            >
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-photo"
                    type="file"
                    multiple
                    onChange={handlePhotoUpload}
                />
                <label htmlFor="upload-photo">
                    <IconButton component="span">
                        <AddPhotoAlternateIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        Tải nhiều ảnh đánh giá
                    </Typography>
                </label>
                {photos.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {photos.map((photo, index) => (
                            <Box key={index} sx={{ position: 'relative' }}>
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Preview ${index}`}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        objectFit: 'cover',
                                        borderRadius: 4,
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemovePhoto(index)}
                                    sx={{
                                        position: 'absolute',
                                        top: -10,
                                        right: -10,
                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
                sx={{ textTransform: 'none' }}
            >
                {loading ? <CircularProgress size={24} /> : 'Gửi đánh giá'}
            </Button>
        </Box>
    );
};

export default WriteReview;
