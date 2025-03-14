import SearchBarComponent from '@/components/search/SearchBarComponent';
import { colors } from '@/themes/colors';
import {
    Box,
    Button,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
    InputAdornment,
} from '@mui/material';
import SearchCardComponent from '@/components/SearchCardComponent';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import FilterPanel from '@/components/FilterPanel';
import shopApi from '@/api/shopApi';
import { useEffect, useState } from 'react';
import { Shop } from '@/models';

export default function SearchPage() {
    const [shops, setShops] = useState<Shop[] | null>(null);

    const fetchDataShop = async () => {
        try {
            const response = await shopApi.searchShop({ keyword: '', page: 1, size: 12 });
            setShops(response?.data.data);
        } catch {}
    };
    const postData = [
        {
            image: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/2/17/1148679/Nguoc-Dong-Ve-Thoi-O.jpg',
            name: 'Quán ăn Hai Bà Trưng',
            address: 'Hà Nội, Việt Nam',
            rating: 4.5,
            reviewCount: 120,
            favoriteCount: 200,
            viewCount: 1500,
            postTime: '2024-11-07',
        },
        {
            image: 'https://easysalon.vn/wp-content/uploads/2020/10/cat-toc-nam-gia-re-o-ha-noi-3.jpg',
            name: 'Quán cắt tóc',
            address: 'Đà Nẵng, Việt Nam',
            rating: 4.7,
            reviewCount: 90,
            favoriteCount: 180,
            viewCount: 1300,
            postTime: '2024-11-06',
        },
        {
            image: 'https://torog-cdn.kootoro.com/cms/upload/image/1674010181995-kinh%20doanh%20c%E1%BB%ADa%20h%C3%A0ng%20gi%E1%BA%B7t%20l%C3%A0.jpg',
            name: 'Tiệm giặt là ABC',
            address: 'Hồ Chí Minh, Việt Nam',
            rating: 4.2,
            reviewCount: 75,
            favoriteCount: 150,
            viewCount: 1000,
            postTime: '2024-11-05',
        },
    ];
    useEffect(() => {
        fetchDataShop();
    }, []);
    const keywords = ['Du lịch', 'Đồ ăn', 'Động Phong Nha', 'Ẩm thực Việt Nam', 'Thái Lan'];
    return (
        <div>
            <div
                style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F4E0E0 100%)' }}
                className="h-[172px] w-[100%] flex justify-center items-center"
            >
                <SearchBarComponent />
            </div>
            <Box p={3} sx={{ backgroundColor: colors.backgroundColor, minHeight: '100vh' }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} md={2}>
                        <FilterPanel />
                    </Grid>
                    <Grid item xs={8} md={5}>
                        <Stack p={2} height="100%" gap={3}>
                            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                {/* {(shops || []).map((post, index) => (
                                    <SearchCardComponent
                                        key={index}
                                        image={post.avatar}
                                        name={post.name}
                                        address={post.address}
                                        rating={post.point}
                                        reviewCount={post.countReview}
                                        favoriteCount={post}
                                        viewCount={post.countReview}
                                        postTime={post}
                                    />
                                ))} */}
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={4.5}>
                        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Các từ khóa liên quan
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {keywords.map((keyword, index) => (
                                    <Button
                                        sx={{
                                            color: colors.textColor,
                                            borderRadius: 5,
                                            borderColor: colors.lineColor,
                                        }}
                                        key={index}
                                        variant="outlined"
                                        startIcon={<SearchIcon />}
                                        size="small"
                                    >
                                        {keyword}
                                    </Button>
                                ))}
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Nhập địa điểm..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon />}
                                sx={{ flex: 1, width: '100%' }}
                            >
                                Tìm kiếm theo Google Map
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            +
        </div>
    );
}
