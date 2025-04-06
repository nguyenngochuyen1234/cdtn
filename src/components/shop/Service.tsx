// pages/ServicesList.tsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Breadcrumbs,
    Link as MuiLink,
    Divider,
    Stack,
    IconButton,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import shopApi from '@/api/shopApi';
import StarIcon from '@mui/icons-material/Star';
import PhotoIcon from '@mui/icons-material/Photo';
import CustomPagination from './CustomPagination';

interface Service {
    id: string;
    name: string;
    images: string[];
    reviews: number;
    description?: string;
    price?: number;
}

export default function ServicesList() {
    const { shopId } = useParams<{ shopId: string }>();
    const [services, setServices] = useState<Service[]>([]);
    const [shopName, setShopName] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalServices, setTotalServices] = useState(0);
    const servicesPerPage = 12;

    useEffect(() => {
        if (!shopId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch shop details and services in parallel
                const [shopResponse, servicesResponse] = await Promise.all([
                    shopApi.getShopById(shopId),
                    shopApi.getServiceByIdShop(shopId, {
                        limit: servicesPerPage,
                        page: page - 1,
                        sort: 'asc',
                        keyword: '',
                    }),
                ]);

                // Set shop name
                if (shopResponse?.data) {
                    setShopName(shopResponse.data.data.name || 'Shop');
                }

                // Set services
                if (servicesResponse?.data) {
                    setServices(
                        servicesResponse.data.data.map((service: any) => ({
                            id: service.id || `service-${Math.random().toString(36).substr(2, 9)}`,
                            name: service.name,
                            images: [service.thumbnail, ...(service.mediaUrl || [])],
                            reviews: service.countReview || 0,
                            description: service.description || '',
                            price: service.price || 0, // Assuming price is in the API response
                        }))
                    );
                    const total = servicesResponse.data.meta.total || 0;
                    setTotalServices(total);
                    setTotalPages(Math.ceil(total / servicesPerPage));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shopId, page]);

    const handlePageChange = (value: number) => {
        setPage(value);
    };

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
                <Typography color="text.primary">Dịch vụ</Typography>
            </Breadcrumbs>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Dịch vụ
            </Typography>

            {loading ? (
                <Box sx={{ py: 4 }}>
                    <Typography>Loading...</Typography>
                </Box>
            ) : services.length > 0 ? (
                <>
                    <Box>
                        {services.map((service, index) => (
                            <React.Fragment key={service.id}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                    sx={{ py: 2 }}
                                >
                                    <Link
                                        to={`/shop/service/${service.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        {service.images[0] && (
                                            <Box
                                                component="img"
                                                src={service.images[0]}
                                                alt={service.name}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: 'cover',
                                                    borderRadius: 1,
                                                }}
                                            />
                                        )}{' '}
                                    </Link>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Link
                                            to={`/shop/service/${service.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Typography
                                                variant="h6"
                                                fontWeight="medium"
                                                color="primary"
                                                sx={{ textTransform: 'uppercase' }}
                                            >
                                                {service.name}
                                            </Typography>
                                        </Link>
                                        <Typography variant="body2" color="text.secondary">
                                            {service.description}
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            mt={1}
                                        >
                                            <StarIcon fontSize="small" sx={{ color: '#757575' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {service.reviews} reviews
                                            </Typography>
                                            <PhotoIcon fontSize="small" sx={{ color: '#757575' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {service.images.length} photos
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(service.price || 100000)}
                                    </Typography>
                                </Stack>
                                {index < services.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </Box>
                    <CustomPagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        Không có dịch vụ nào
                    </Typography>
                </Box>
            )}
        </Container>
    );
}
