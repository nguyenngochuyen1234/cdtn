import SearchBarComponent from '@/components/search/SearchBarComponent'
import { colors } from '@/themes/colors'
import { Box, Button, Divider, Grid, Stack, TextField, Typography, InputAdornment } from '@mui/material'
import SearchCardComponent from '@/components/SearchCardComponent'
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';

export default function SearchPage() {
    const postData = [
        {
            image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/7/1189286/Anh-Hoang-Thanh-Than-11.jpg",
            name: "Địa điểm du lịch nổi tiếng",
            address: "Hà Nội, Việt Nam",
            rating: 4.5,
            reviewCount: 120,
            favoriteCount: 200,
            viewCount: 1500,
            postTime: "2024-11-07"
        },
        {
            image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/7/1189286/Anh-Hoang-Thanh-Than-11.jpg",
            name: "Ẩm thực đường phố",
            address: "Đà Nẵng, Việt Nam",
            rating: 4.7,
            reviewCount: 90,
            favoriteCount: 180,
            viewCount: 1300,
            postTime: "2024-11-06"
        },
        {
            image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/7/1189286/Anh-Hoang-Thanh-Than-11.jpg",
            name: "Tiệm giặt là ABC",
            address: "Hồ Chí Minh, Việt Nam",
            rating: 4.2,
            reviewCount: 75,
            favoriteCount: 150,
            viewCount: 1000,
            postTime: "2024-11-05"
        }
    ];
    const keywords = ["Du lịch", "Đồ ăn", "Động Phong Nha", "Ẩm thực Việt Nam", "Thái Lan"];
    return (
        <div >
            <div style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F4E0E0 100%)" }} className='h-[172px] w-[100%] flex justify-center items-center'>
                <SearchBarComponent />
            </div>
            <Box p={3} sx={{ backgroundColor: colors.backgroundColor, minHeight: "100vh" }}>
                <Grid container spacing={2} >
                    <Grid item xs={12} md={7.5} >
                        <Stack p={2} height="100%" gap={3}>
                            <Box display="flex" alignItems="center" p={2} sx={{ backgroundColor: "#fff" }}>
                                <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
                                    <Typography variant="h6">Địa điểm du lịch</Typography>
                                    <Typography variant="body2">(10 kết quả)</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                                <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
                                    <Typography variant="h6">Ẩm thực</Typography>
                                    <Typography variant="body2">(10 kết quả)</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                                <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
                                    <Typography variant="h6">Tiệm giặt</Typography>
                                    <Typography variant="body2">(10 kết quả)</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                                <Typography variant="h6" style={{ cursor: 'pointer' }}>
                                    Xem thêm
                                </Typography>
                            </Box>
                            <Typography variant="h6" style={{ cursor: 'pointer' }}>
                                kết quả hiện thị 10 of <span className='text-[red]'>20 kết quả đã tìm kiếm</span>
                            </Typography>
                            <Box display="flex" flexDirection="column" alignItems="center" gap={2} >
                                {postData.map((post, index) => (
                                    <SearchCardComponent
                                        key={index}
                                        image={post.image}
                                        name={post.name}
                                        address={post.address}
                                        rating={post.rating}
                                        reviewCount={post.reviewCount}
                                        favoriteCount={post.favoriteCount}
                                        viewCount={post.viewCount}
                                        postTime={post.postTime}
                                    />
                                ))}
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={4.5}>
                        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
                            <Typography variant="h6" gutterBottom>Các từ khóa liên quan</Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {keywords.map((keyword, index) => (
                                    <Button
                                        sx={{ color: colors.textColor, borderRadius: 5, borderColor: colors.lineColor }}
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
                                sx={{ flex: 1, width: "100%" }}
                            >
                                Tìm kiếm theo Google Map
                            </Button>

                        </Box>
                    </Grid>
                </Grid>
            </Box>
            +
        </div >
    )
}
