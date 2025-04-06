// CategorySection.tsx
import { Grid, Card, Typography, Box, Button } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FlightIcon from '@mui/icons-material/Flight';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import HotelIcon from '@mui/icons-material/Hotel';
import { Link } from 'react-router-dom';
const categories = [
    {
        icon: <RestaurantIcon fontSize="medium" sx={{ color: '#FF5733' }} />,
        name: 'Nhà Hàng',
    },
    {
        icon: <FlightIcon fontSize="medium" sx={{ color: '#FF5733' }} />,
        name: 'Du Lịch',
    },
    {
        icon: <LocalLaundryServiceIcon fontSize="medium" sx={{ color: '#FF5733' }} />,
        name: 'Giặt Ủi',
    },
    {
        icon: <HotelIcon fontSize="medium" sx={{ color: '#FF5733' }} />,
        name: 'Khách Sạn',
    },
];

const CategorySection = () => {
    return (
        <Box component={'section'} sx={{ mt: 5 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    flexDirection: { xs: 'column', md: 'row' }, // Chuyển về cột trên màn hình nhỏ
                    textAlign: { xs: 'center', md: 'left' }, // Căn giữa text trên màn hình nhỏ
                }}
            >
                <Box>
                    <Typography variant="h5" component="h2">
                        Danh mục bạn quan tâm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tổng hợp danh mục bài viết
                    </Typography>
                </Box>
                <Link to={'/search'}>
                    <Button variant="outlined" color="primary">
                        Xem thêm
                    </Button>
                </Link>
            </Box>

            <Grid container spacing={2}>
                {categories.map((category, index) => (
                    <Grid item xs={6} sm={3} md={3} key={index}>
                        <Card
                            sx={{
                                textAlign: 'center',
                                border: '1px solid #e0e0e0',
                                boxShadow: 'none',
                                borderRadius: 2,
                                padding: 1,
                                height: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {category.icon}
                            <Typography variant="body2" sx={{ mt: 1, fontSize: '1.2rem' }}>
                                {category.name}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CategorySection;
