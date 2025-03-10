import { Box, Typography, Rating, LinearProgress, Avatar, Stack, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    RestaurantMenu,
    LocalDining,
    Fastfood,
    WineBar,
    Coffee,
    EmojiFoodBeverage,
    DeliveryDining,
    OutdoorGrill,
    Person,
    Star,
} from '@mui/icons-material';
import StarRating from './StarRating';
import { useState } from 'react';

const BorderLinearProgress = styled(LinearProgress)({
    height: 8,
    borderRadius: 4,
    '& .MuiLinearProgress-bar': {
        backgroundColor: '#ff4444',
    },
});
const services = [
    { icon: <RestaurantMenu fontSize="small" />, text: 'Thực đơn đa dạng' },
    { icon: <LocalDining fontSize="small" />, text: 'Món ăn chất lượng' },
    { icon: <Fastfood fontSize="small" />, text: 'Phục vụ nhanh chóng' },
    { icon: <WineBar fontSize="small" />, text: 'Rượu và đồ uống cao cấp' },
    { icon: <Coffee fontSize="small" />, text: 'Cà phê đặc sản' },
    { icon: <EmojiFoodBeverage fontSize="small" />, text: 'Tráng miệng hấp dẫn' },
    { icon: <DeliveryDining fontSize="small" />, text: 'Giao hàng tận nơi' },
    { icon: <OutdoorGrill fontSize="small" />, text: 'BBQ & Nướng ngoài trời' },
];
export default function RateArticle() {
    const [rating, setRating] = useState<number>(0);
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Đánh giá bài viết
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 40, height: 40 }}>
                        <Person />
                    </Avatar>
                    <Typography>Đánh giá của bạn cho bài viết này</Typography>
                    <StarRating size="big" rating={rating} setRating={setRating} />
                    <Typography>Tốt</Typography>
                </Stack>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Thông tin liên quan</Typography>
                    <Stack spacing={2} sx={{ paddingTop: 2 }}>
                        <Grid container spacing={2}>
                            {services.map((service, index) => (
                                <Grid item xs={6} key={index}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {service.icon}
                                        <Typography>{service.text}</Typography>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                        <Typography
                            variant="caption"
                            color="primary"
                            sx={{ display: 'block', mt: 2, cursor: 'pointer' }}
                        >
                            +2 xem thêm
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Trung bình lượt đánh giá
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h4">4.8</Typography>
                            <Star sx={{ color: '#ffb400' }} />
                            <Typography variant="caption" color="text.secondary">
                                (100 lượt đánh giá)
                            </Typography>
                        </Stack>
                    </Box>
                    <Stack spacing={1.5}>
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <Stack key={rating} direction="row" spacing={2} alignItems="center">
                                <Typography sx={{ minWidth: 60 }}>{rating} sao</Typography>
                                <BorderLinearProgress
                                    variant="determinate"
                                    value={
                                        rating === 5
                                            ? 80
                                            : rating === 4
                                              ? 60
                                              : rating === 3
                                                ? 40
                                                : rating === 2
                                                  ? 20
                                                  : 10
                                    }
                                    sx={{ flexGrow: 1 }}
                                />
                            </Stack>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
