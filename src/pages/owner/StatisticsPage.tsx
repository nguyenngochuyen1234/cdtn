import analyticApi from '@/api/analyticApi';
import AccountStatisticsChart from '@/utils/AccountStatisticsChart';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FavoriteIcon from '@mui/icons-material/Favorite';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const createFetchTotal =
    (fetcher: (params: { startDate: Date; endDate: Date }) => Promise<any>) =>
    async (start: Dayjs, end: Dayjs) => {
        const response = await fetcher({ startDate: start.toDate(), endDate: end.toDate() });
        return response?.data?.data?.total || 0;
    };

const fetchTotalReviewShop = createFetchTotal(analyticApi.countReviewShop);
const fetchTotalFavoriteShop = createFetchTotal(analyticApi.countFavoriteShop);

export default function StatisticsPage() {
    const [countReviewShop, setCountReviewShop] = useState(0);
    const [favoriteShopCount, setFavoriteShopCount] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedChart, setSelectedChart] = useState('review'); // Mặc định hiển thị biểu đồ đánh giá

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reviewRes, favoriteRes] = await Promise.all([
                    analyticApi.countReviewShop({
                        startDate: new Date('1/1/2023'),
                        endDate: new Date(),
                    }),
                    analyticApi.countFavoriteShop({
                        startDate: new Date('1/1/2023'),
                        endDate: new Date(),
                    }),
                ]);

                setCountReviewShop(reviewRes?.data?.data?.total || 0);
                setFavoriteShopCount(favoriteRes?.data?.data?.total || 0);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChartChange = (event: any) => {
        setSelectedChart(event.target.value);
    };

    if (loading) {
        return <Typography>Đang tải dữ liệu...</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Thống kê
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#e3f2fd' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <RateReviewIcon sx={{ color: '#1976d2', mr: 2 }} />
                            <div>
                                <Typography variant="h6">Tổng số bài đánh giá</Typography>
                                <Typography variant="h6">{countReviewShop}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#ffebee' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <FavoriteIcon sx={{ color: '#d32f2f', mr: 2 }} />
                            <div>
                                <Typography variant="h6">Tổng số yêu thích</Typography>
                                <Typography variant="h6">{favoriteShopCount}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <FormControl sx={{ mt: 3, minWidth: 200 }}>
                <InputLabel id="chart-select-label">Chọn biểu đồ</InputLabel>
                <Select
                    labelId="chart-select-label"
                    value={selectedChart}
                    label="Chọn biểu đồ"
                    onChange={handleChartChange}
                >
                    <MenuItem value="review">Thống kê số lượng bài đánh giá</MenuItem>
                    <MenuItem value="favorite">Thống kê số lượng yêu thích cửa hàng</MenuItem>
                </Select>
            </FormControl>

            {selectedChart === 'review' ? (
                <AccountStatisticsChart
                    title="Thống kê số lượng bài đánh giá"
                    fetchTotal={fetchTotalReviewShop}
                />
            ) : (
                <AccountStatisticsChart
                    title="Thống kê số lượng yêu thích cửa hàng"
                    fetchTotal={fetchTotalFavoriteShop}
                />
            )}
        </div>
    );
}
