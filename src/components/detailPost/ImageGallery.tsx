'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Modal,
    IconButton,
    useMediaQuery,
    useTheme,
    Fade,
    Backdrop,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import shopApi from '@/api/shopApi';
import HeaderDetailPost from './HeaderDetailPost';

interface ImageGalleryProps {
    avatar: string;
    images: string[];
    shopId: string;
    shop: any;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ avatar, images, shopId, shop }) => {
    const [showModal, setShowModal] = useState(false);
    const [serviceImages, setServiceImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    // Fetch service images
    useEffect(() => {
        const fetchServiceImages = async () => {
            setIsLoading(true);
            try {
                const body = {
                    limit: 12,
                    page: 0,
                    sort: 'asc',
                    keyword: '',
                };
                const response = await shopApi.getServiceByIdShop(shopId, body);
                if (response?.data) {
                    const services = response.data.data;
                    const images = services.flatMap((service: any) => service.images || []);
                    setServiceImages(images);
                }
            } catch (error) {
                console.error('Error fetching service images:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServiceImages();
    }, [shopId]);

    // Combine all images and filter out nulls/undefined
    const allImages = [avatar, ...images, ...serviceImages].filter(Boolean);

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    // Handle image error
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = '/placeholder.svg?height=300&width=300';
    };

    return (
        <>
            {/* Main Image Gallery */}
            <Box sx={{ position: 'relative', width: '100%' }}>
                {/* Desktop Gallery */}
                {!isMobile && (
                    <Box
                        sx={{
                            display: 'flex',
                            height: { md: '400px', lg: '500px' },
                            overflow: 'hidden',
                            borderRadius: 0,
                        }}
                    >
                        {allImages.length < 5 ? (
                            // Nếu ít hơn 5 ảnh, chỉ hiển thị ảnh chính
                            <Box
                                sx={{
                                    width: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={avatar || '/placeholder.svg?height=600&width=800'}
                                    alt={shop?.name || 'Shop image'}
                                    onError={handleImageError}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                />
                            </Box>
                        ) : (
                            // Nếu có từ 5 ảnh trở lên, hiển thị layout hiện tại
                            <>
                                {/* Main Image */}
                                <Box
                                    sx={{
                                        flex: '0 0 60%',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={avatar || '/placeholder.svg?height=600&width=800'}
                                        alt={shop?.name || 'Shop image'}
                                        onError={handleImageError}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Side Images */}
                                <Box sx={{ flex: '0 0 40%' }}>
                                    <Grid container spacing={1} sx={{ height: '100%' }}>
                                        {images.slice(0, 4).map((image, index) => (
                                            <Grid item xs={6} key={index} sx={{ height: '50%' }}>
                                                <Box
                                                    component="img"
                                                    src={
                                                        image ||
                                                        '/placeholder.svg?height=300&width=300'
                                                    }
                                                    alt={`Shop image ${index + 1}`}
                                                    onError={handleImageError}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.05)',
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </>
                        )}
                    </Box>
                )}

                {/* Mobile Gallery */}
                {isMobile && (
                    <Box
                        sx={{
                            position: 'relative',
                            height: { xs: '300px', sm: '400px' },
                            width: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            component="img"
                            src={avatar || '/placeholder.svg?height=600&width=800'}
                            alt={shop?.name || 'Shop image'}
                            onError={handleImageError}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />

                        {/* Navigation Arrows */}
                        <IconButton
                            sx={{
                                position: 'absolute',
                                left: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                },
                            }}
                            onClick={handlePrevImage}
                        >
                            <ArrowBackIosNewIcon />
                        </IconButton>

                        <IconButton
                            sx={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                },
                            }}
                            onClick={handleNextImage}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                )}

                {/* Header Detail Post */}
                <HeaderDetailPost shop={shop} shopId={shopId} />

                {/* See All Photos Button */}
                <Typography
                    variant="body2"
                    sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: 1,
                        cursor: 'pointer',
                        zIndex: 3,
                        fontWeight: 'medium',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        },
                    }}
                    onClick={() => setShowModal(true)}
                >
                    Xem tất cả {allImages.length} ảnh
                </Typography>
            </Box>

            {/* Modal for All Photos */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={showModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 24,
                            p: { xs: 2, sm: 3 },
                            width: { xs: '95%', sm: '90%', md: '80%' },
                            maxHeight: '90vh',
                            overflow: 'auto',
                        }}
                    >
                        <IconButton
                            onClick={() => setShowModal(false)}
                            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <Typography variant="h5" fontWeight="bold" mb={3}>
                            Ảnh và video
                        </Typography>

                        {/* Main Image Viewer */}
                        <Box sx={{ mb: 3, position: 'relative' }}>
                            <Box
                                component="img"
                                src={
                                    allImages[currentImageIndex] ||
                                    '/placeholder.svg?height=600&width=800'
                                }
                                alt={`Image ${currentImageIndex + 1}`}
                                onError={handleImageError}
                                sx={{
                                    width: '100%',
                                    height: { xs: '250px', sm: '350px', md: '450px' },
                                    objectFit: 'contain',
                                    bgcolor: '#f5f5f5',
                                    borderRadius: 1,
                                }}
                            />

                            {/* Navigation Arrows */}
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    left: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                    },
                                }}
                                onClick={handlePrevImage}
                            >
                                <ArrowBackIosNewIcon />
                            </IconButton>

                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    right: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                    },
                                }}
                                onClick={handleNextImage}
                            >
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>

                        {/* Thumbnails */}
                        <Box
                            sx={{
                                display: 'flex',
                                overflowX: 'auto',
                                gap: 1,
                                pb: 1,
                                '&::-webkit-scrollbar': {
                                    height: 8,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderRadius: 4,
                                },
                            }}
                        >
                            {allImages.map((image, index) => (
                                <Box
                                    key={index}
                                    component="img"
                                    src={image || '/placeholder.svg?height=100&width=100'}
                                    alt={`Thumbnail ${index + 1}`}
                                    onError={handleImageError}
                                    onClick={() => handleThumbnailClick(index)}
                                    sx={{
                                        width: { xs: 60, sm: 80, md: 100 },
                                        height: { xs: 60, sm: 80, md: 100 },
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        border:
                                            index === currentImageIndex
                                                ? '2px solid #d32323'
                                                : 'none',
                                        opacity: index === currentImageIndex ? 1 : 0.7,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            opacity: 1,
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default ImageGallery;
