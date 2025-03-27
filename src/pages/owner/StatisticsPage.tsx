import analyticApi from '@/api/analyticApi';
import AccountStatisticsChart from '@/utils/AccountStatisticsChart';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const fetchTotalAccounts = async (start: Dayjs, end: Dayjs) => {
    return analyticApi.countReviewShop({
        startDate: start.toDate(),
        endDate: end.toDate(),
    });
};
const fetchTotalShop = async (start: Dayjs, end: Dayjs) => {
    return analyticApi.countFavoriteShop({
        startDate: start.toDate(),
        endDate: end.toDate(),
    });
};
export default function StatisticsPage() {
    const [countReviewShop, setCountReviewShop] = useState(0);
    const [storeData, setStoreData] = useState(0);
    const [reviewData, setReviewData] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchData = async () => {
        try {
            const countReviewShopResponse = await analyticApi.countReviewShop({
                startDate: new Date('1/1/2023'),
                endDate: new Date(),
            });
            const storeResponse = await analyticApi.countFavoriteShop({
                startDate: new Date('1/1/2023'),
                endDate: new Date(),
            });

            setCountReviewShop(countReviewShopResponse.data.data.total || 0);
            setStoreData(storeResponse.data.data.total || 0);
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
                Thống kê
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tổng số bài đánh giá</Typography>
                            <Typography variant="h6">{countReviewShop}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tổng số yêu thích</Typography>
                            <Typography variant="h6">{storeData}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                =
            </Grid>
            <AccountStatisticsChart
                title="Thống kê số lượng bài đánh giá"
                fetchTotal={fetchTotalAccounts}
            />
            <AccountStatisticsChart
                title="Thống kê số lượng yêu thích cửa hàng"
                fetchTotal={fetchTotalShop}
            />
        </div>
    );
}
