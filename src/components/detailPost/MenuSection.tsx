import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import shopApi from '@/api/shopApi';

interface MenuSectionProps {
    shopId: string;
}

interface Service {
    name: string;
    images: string[]; // Will include both thumbnail and mediaUrl
    reviews: number;
}

const MenuSection: React.FC<MenuSectionProps> = ({ shopId }) => {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const body = {
                    limit: 4,
                    page: 0,
                    keyword: '',
                };
                const response = await shopApi.getServiceByIdShop(shopId, body);
                if (response?.data) {
                    setServices(    
                        response.data.data.map((service: any) => ({
                            name: service.name,
                            // Combine thumbnail and mediaUrl into a single images array
                            images: [service.thumbnail, ...(service.mediaUrl || [])],
                            reviews: service.countReview || 0, // Use countReview from API
                        }))
                    );
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, [shopId]);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight="bold">
                Dịch vụ
            </Typography>
            <Typography variant="h6" mt={2}>
                Các dịch vụ phổ biến
            </Typography>
            <Grid container spacing={2} mt={1}>
                {services.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Link to={`/shop/${shopId}/service`} style={{ textDecoration: 'none' }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    // Set a fixed height and enforce aspect ratio
                                    sx={{
                                        height: 180, // Standard height for consistency
                                        objectFit: 'cover', // Ensures image scales properly
                                    }}
                                    image={
                                        item.images[0] ||
                                        'http://res.cloudinary.com/dbk09oy6h/image/upload/v1743916756/IMAGE_SHOP/6704f957a77f0442b1e32a23/1743916759437.jpg.jpg'
                                    }
                                    alt={item.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body1">{item.name}</Typography>
                                    {item.reviews > 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            {item.reviews} Reviews
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
            <Typography variant="body2" mt={2}>
                <Link
                    to={`/shop/${shopId}/service`}
                    style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                    Xem tất cả dịch vụ
                </Link>
            </Typography>
        </Box>
    );
};

export default MenuSection;
