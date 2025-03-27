import analyticApi from '@/api/analyticApi';
import AccountStatisticsChart from '@/utils/AccountStatisticsChart';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Container } from 'lucide-react';
import { useEffect, useState } from 'react';

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
                Thống kê
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tổng số tài khoản</Typography>
                            <Typography variant="h6">{accountData}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tổng số cửa hàng</Typography>
                            <Typography variant="h6">{storeData}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tổng số đánh giá</Typography>
                            <Typography variant="h6">{reviewData}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <AccountStatisticsChart
                title="Thống kê số lượng tài khoản"
                fetchTotal={fetchTotalAccounts}
            />
            <AccountStatisticsChart
                title="Thống kê số lượng cửa hàng"
                fetchTotal={fetchTotalShop}
            />
            <AccountStatisticsChart
                title="Thống kê số lượng bài đánh giá"
                fetchTotal={fetchTotalReview}
            />
        </div>
    );
}
