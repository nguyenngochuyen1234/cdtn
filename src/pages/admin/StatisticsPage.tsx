import analyticApi from '@/api/analyticApi';
import AccountStatisticsChart from '@/utils/AccountStatisticsChart';
import { Card, CardContent, Grid, MenuItem, Select, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import RateReviewIcon from '@mui/icons-material/RateReview';

const fetchTotalAccounts = async (start: Dayjs, end: Dayjs) => {
    return analyticApi.countUser({
        startDate: start.toDate(),
        endDate: end.toDate(),
    });
};
const fetchTotalShop = async (start: Dayjs, end: Dayjs) => {
    return analyticApi.countShop({
        startDate: start.toDate(),
        endDate: end.toDate(),
    });
};
const fetchTotalReview = async (start: Dayjs, end: Dayjs) => {
    return analyticApi.countReview({
        startDate: start.toDate(),
        endDate: end.toDate(),
    });
};

export default function StatisticsPage() {
    const [accountData, setAccountData] = useState(0);
    const [storeData, setStoreData] = useState(0);
    const [reviewData, setReviewData] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedChart, setSelectedChart] = useState<'accounts' | 'shops' | 'reviews'>(
        'accounts'
    );

    const fetchData = async () => {
        try {
            const accountResponse = await analyticApi.countUser({
                startDate: new Date('1/1/2023'),
                endDate: new Date(),
            });
            const storeResponse = await analyticApi.countShop({
                startDate: new Date('1/1/2023'),
                endDate: new Date(),
            });
            const reviewResponse = await analyticApi.countReview({
                startDate: new Date('1/1/2023'),
                endDate: new Date(),
            });

            setAccountData(accountResponse.data.data.total || 0);
            setStoreData(storeResponse.data.data.total || 0);
            setReviewData(reviewResponse.data.data.total || 0);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Tổng quan
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#e3f2fd' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                            <div>
                                <Typography variant="h6">Tổng số tài khoản</Typography>
                                <Typography variant="h6">{accountData}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#f1f8e9' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <StoreIcon sx={{ fontSize: 40, color: '#388e3c' }} />
                            <div>
                                <Typography variant="h6">Tổng số cửa hàng</Typography>
                                <Typography variant="h6">{storeData}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#fff3e0' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <RateReviewIcon sx={{ fontSize: 40, color: '#f57c00' }} />
                            <div>
                                <Typography variant="h6">Tổng số đánh giá</Typography>
                                <Typography variant="h6">{reviewData}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Chọn biểu đồ thống kê
                    </Typography>
                    <Select
                        value={selectedChart}
                        onChange={(e) =>
                            setSelectedChart(e.target.value as 'accounts' | 'shops' | 'reviews')
                        }
                        fullWidth
                    >
                        <MenuItem value="accounts">Số lượng tài khoản</MenuItem>
                        <MenuItem value="shops">Số lượng cửa hàng</MenuItem>
                        <MenuItem value="reviews">Số lượng bài đánh giá</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12} md={8}>
                    {selectedChart === 'accounts' && (
                        <AccountStatisticsChart
                            title="Thống kê số lượng tài khoản"
                            fetchTotal={fetchTotalAccounts}
                        />
                    )}
                    {selectedChart === 'shops' && (
                        <AccountStatisticsChart
                            title="Thống kê số lượng cửa hàng"
                            fetchTotal={fetchTotalShop}
                        />
                    )}
                    {selectedChart === 'reviews' && (
                        <AccountStatisticsChart
                            title="Thống kê số lượng bài đánh giá"
                            fetchTotal={fetchTotalReview}
                        />
                    )}
                </Grid>
            </Grid>
        </div>
    );
}
