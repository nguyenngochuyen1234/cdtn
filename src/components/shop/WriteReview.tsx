'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Rating, TextField, Button, IconButton } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import shopApi from '@/api/shopApi';
import userApi from '@/api/userApi';
import reviewApi from '@/api/reviewApi';
import { toast } from 'react-toastify';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
interface ReviewData {
    reviewTitle: string;
    reviewContent: string;
    rating: number;
    mediaUrlReview: string[];
    idService?: string;
    idShop: string;
}

export default function WriteReview() {
    const { shopId } = useParams<{ shopId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [shopName, setShopName] = useState<string>('');
    const [rating, setRating] = useState<number | null>(null);
    const [reviewTitle, setReviewTitle] = useState<string>('');
    const [reviewContent, setReviewContent] = useState<string>('');
    const [photos, setPhotos] = useState<File[]>([]);

    // Kiểm tra đăng nhập bằng access_token
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            // Truyền location.state để lưu trữ trang hiện tại
            navigate('/auth/login', { state: { from: location.pathname } });
        }
    }, [navigate, location]);

    // Lấy thông tin cửa hàng
    useEffect(() => {
        const fetchShop = async () => {
            if (shopId) {
                try {
                    const response = await shopApi.getShopById(shopId);
                    setShopName(response.data.data.name || 'Cửa hàng không xác định');
                } catch (error) {
                    console.error('Error fetching shop:', error);
                    toast.error('Không thể lấy thông tin cửa hàng');
                }
            }
        };
        fetchShop();
    }, [shopId]);

    // Xử lý upload ảnh
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

    // Upload ảnh lên server và lấy URL
    const uploadPhotos = async (files: File[]): Promise<string[]> => {
        const uploadedUrls: string[] = [];
        for (const file of files) {
            try {
                const response = await userApi.uploadImage(file);
                if (response.data) {
                    uploadedUrls.push(response.data.url); // Giả sử API trả về URL của ảnh
                }
            } catch (error) {
                console.error('Error uploading photo:', error);
                toast.error(`Không thể upload ảnh ${file.name}`);
            }
        }
        return uploadedUrls;
    };
    // Xử lý xóa ảnh
    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };
    // Xử lý gửi đánh giá
    const handleSubmit = async () => {
        // Validate các trường
        if (!rating) {
            toast.error('Vui lòng chọn số sao đánh giá');
            return;
        }
        if (!reviewContent.trim()) {
            toast.error('Nội dung đánh giá không được để trống');
            return;
        }
        if (reviewContent.length < 30) {
            toast.error('Đánh giá phải có ít nhất 50 ký tự');
            return;
        }

        try {
            // Upload ảnh trước khi gửi đánh giá
            let uploadedPhotoUrls: string[] = [];
            if (photos.length > 0) {
                uploadedPhotoUrls = await uploadPhotos(photos);
            }

            // Tạo dữ liệu đánh giá
            const reviewData: ReviewData = {
                reviewTitle,
                reviewContent,
                rating: rating!,
                mediaUrlReview: uploadedPhotoUrls,
                idShop: shopId!,
                idService: undefined, // Bạn có thể thêm logic để lấy idService nếu cần
            };

            // Gửi đánh giá lên server
            const response = await reviewApi.AddReview(reviewData);
            if (!response.data.success) {
                toast.error(response.data.message || 'Có lỗi xảy ra khi gửi đánh giá');
                return;
            }

            toast.success('Đánh giá đã được gửi thành công');
            navigate(`/detailPost/${shopId}`);
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Có lỗi xảy ra khi gửi đánh giá');
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 5 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
                {shopName}
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
                        sx={{ mr: 2 }}
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
                    Nội dung đánh giá cần ít nhất 30 ký tự
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
                sx={{ textTransform: 'none' }}
            >
                Gửi đánh giá
            </Button>
        </Box>
    );
}
