import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataResponse {
    data: {
        date: string;
        total: number;
    }[];
}

const OverviewPage: React.FC = () => {
    const [accountData, setAccountData] = useState<DataResponse | null>(null);
    const [storeData, setStoreData] = useState<DataResponse | null>(null);
    const [reviewData, setReviewData] = useState<DataResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            const accountResponse = await axios.get('/api/accounts');
            const storeResponse = await axios.get('/api/stores');
            const reviewResponse = await axios.get('/api/reviews');

            setAccountData(accountResponse.data);
            setStoreData(storeResponse.data);
            setReviewData(reviewResponse.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatChartData = (data: DataResponse) => ({
        labels: data.data.map((item) => item.date),
        datasets: [
            {
                label: 'Tổng số',
                data: data.data.map((item) => item.total),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    });

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Thống kê
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tổng số tài khoản</Typography>
                            {accountData && (
                                <Line
                                    data={formatChartData(accountData)}
                                    options={{ responsive: true }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tổng số cửa hàng</Typography>
                            {storeData && (
                                <Line
                                    data={formatChartData(storeData)}
                                    options={{ responsive: true }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tổng số đánh giá</Typography>
                            {reviewData && (
                                <Line
                                    data={formatChartData(reviewData)}
                                    options={{ responsive: true }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OverviewPage;
