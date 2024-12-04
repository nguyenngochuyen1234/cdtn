import { Box, Button, IconButton, Rating, Stack, Typography } from '@mui/material'
import React from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
function HeaderDetailPost() {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mt={1} sx={{ padding: 2, borderRadius: 2 }}>
            <Box>
                <Typography variant="h5" fontWeight="bold">
                    Phong Nha Kẻ Bàng
                </Typography>
                <Stack alignItems="center" direction="row" sx={{ marginTop: 1, marginBottom: 1 }}>
                    <LocationOnIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">
                        Quảng Bình (Mở cửa 24/24)
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Button sx={{ padding: 1 }} color="primary" variant="outlined" aria-label="like">
                        <Typography variant="body2" color="text.secondary">
                            4.2
                        </Typography>
                    </Button>
                    <Stack direction="row" alignItems="center" gap={1} >
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                            Đánh giá tốt
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            (54 lượt)
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
            <Box >
                <Typography variant="body2" color="text.secondary">
                    Đã đăng: 4 giờ trước
                </Typography>
                <Stack direction="row" spacing={2} mt={2}>
                    <Button color="primary" variant="outlined" aria-label="like">
                        <FavoriteBorderIcon color="primary" />
                    </Button>
                    <Button color="primary" variant="outlined" aria-label="share">
                        <ShareIcon color="primary" />
                    </Button>
                    <Button variant="contained" color="primary" size="small">
                        Đánh giá ngay
                    </Button>
                </Stack>
            </Box>

        </Stack >
    )
}

export default HeaderDetailPost