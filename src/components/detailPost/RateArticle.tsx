import { Box, Typography, Rating, LinearProgress, Avatar, Stack, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
    Person,
    Star,
    SportsGymnastics,
    CleaningServices,
    Restaurant,
    Support,
    NetworkCheck,
    LocalBar,
    Wifi,
    Inventory
} from '@mui/icons-material'
import StarRating from './StarRating'

const BorderLinearProgress = styled(LinearProgress)({
    height: 8,
    borderRadius: 4,
    '& .MuiLinearProgress-bar': {
        backgroundColor: '#ff4444'
    }
})
const services = [
    { icon: <Person fontSize="small" />, text: 'Bể bơi miễn phí' },
    { icon: <CleaningServices fontSize="small" />, text: 'Làm đẹp và chăm sóc' },
    { icon: <Restaurant fontSize="small" />, text: 'Có nhà hàng' },
    { icon: <Support fontSize="small" />, text: 'Khách sạn 24/24' },
    { icon: <SportsGymnastics fontSize="small" />, text: 'Dịch vụ gym, thể thao' },
    { icon: <LocalBar fontSize="small" />, text: 'Quán bar dịch vụ bay lắc' },
    { icon: <Wifi fontSize="small" />, text: 'Miễn phí wifi' },
    { icon: <Inventory fontSize="small" />, text: 'Có phế dịch vụ' },
];
export default function RateArticle() {
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
                    <StarRating />
                    <Typography>Tốt</Typography>
                </Stack>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6} >
                    <Typography variant="subtitle1">
                        Thông tin liên quan
                    </Typography>
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
                                    value={rating === 5 ? 80 : rating === 4 ? 60 : rating === 3 ? 40 : rating === 2 ? 20 : 10}
                                    sx={{ flexGrow: 1 }}
                                />
                            </Stack>
                        ))}
                    </Stack>


                </Grid>
            </Grid>
        </Box>
    )
}

