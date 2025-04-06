// pages/ServiceDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Breadcrumbs,
    Link as MuiLink,
    Button,
    Stack,
} from '@mui/material';
import shopApi from '@/api/shopApi';

interface Service {
    id: string;
    name: string;
    images: string[];
    reviews: number;
    description?: string;
    price?: number;
}

export default function ServiceDetailPage() {
    const { serviceId } = useParams<{ serviceId: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [shopName, setShopName] = useState('');
    const [shopId, setShopId] = useState('');
    const [showAllImages, setShowAllImages] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                if (serviceId) {
                    const response = await shopApi.getDetailServiceById(serviceId);
                    if (response?.data) {
                        const serviceData = response.data.data;
                        setService({
                            id: serviceData.id,
                            name: serviceData.name,
                            images: [serviceData.thumbnail, ...(serviceData.mediaUrl || [])],
                            reviews: serviceData.countReview || 0,
                            description: serviceData.description || '',
                            price: serviceData.price || 0,
                        });
                        setShopId(serviceData.idShop);

                        const shopResponse = await shopApi.getShopById(serviceData.idShop);
                        if (shopResponse?.data) {
                            setShopName(shopResponse.data.data.name || 'Cửa hàng');
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching service:', error);
            }
        };

        fetchService();
    }, [serviceId]);

    const handleWriteReview = () => {
        navigate(`/write-review/service/${serviceId}`);
    };

    if (!service) {
        return <Typography>Loading...</Typography>;
    }

    const displayedImages = showAllImages ? service.images : service.images.slice(0, 3);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link to="/">
                    <MuiLink component="span" underline="hover" color="inherit">
                        Trang chủ
                    </MuiLink>
                </Link>
                <Link to={`/detailPost/${shopId}`}>
                    <MuiLink component="span" underline="hover" color="inherit">
                        {shopName}
                    </MuiLink>
                </Link>
                <Link to={`/shop/${shopId}/services`}>
                    <MuiLink component="span" underline="hover" color="inherit">
                        Dịch vụ
                    </MuiLink>
                </Link>
                <Typography color="text.primary">{service.name}</Typography>
            </Breadcrumbs>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >
                <Typography variant="h4" fontWeight="bold">
                    {service.name}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                    ${(service.price / 1000).toFixed(1)}
                </Typography>
            </Stack>

            <Typography variant="body1" sx={{ mb: 2 }}>
                {service.description}
            </Typography>

            {service.images.length > 0 && (
                <Stack direction="row" spacing={2} sx={{ mb: 2, overflowX: 'auto' }}>
                    {displayedImages.map((image, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={image}
                            alt={`${service.name} ${index + 1}`}
                            sx={{
                                width: 300,
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 1,
                            }}
                        />
                    ))}
                </Stack>
            )}

            <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                    Bạn đã đến đây chưa?
                </Typography>
                <Button variant="contained" color="error" onClick={handleWriteReview}>
                    Viết đánh giá
                </Button>
                {service.images.length > 3 && !showAllImages && (
                    <Typography
                        variant="body2"
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => setShowAllImages(true)}
                    >
                        Xem tất cả ảnh
                    </Typography>
                )}
            </Stack>
        </Container>
    );
}
