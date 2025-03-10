import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, ToggleButtonGroup, ToggleButton } from '@mui/material';

const sampleData = {
    daily: [
        { date: '2024-03-01', reviews: 10 },
        { date: '2024-03-02', reviews: 15 },
        { date: '2024-03-03', reviews: 20 },
    ],
    monthly: [
        { date: 'Jan 2024', reviews: 200 },
        { date: 'Feb 2024', reviews: 300 },
        { date: 'Mar 2024', reviews: 250 },
    ],
    yearly: [
        { date: '2022', reviews: 1200 },
        { date: '2023', reviews: 1500 },
        { date: '2024', reviews: 1700 },
    ],
};

const StatisticsPage = () => {
    const [timeframe, setTimeframe] = useState('monthly');

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ToggleButtonGroup
                value={timeframe}
                exclusive
                onChange={(event, newValue) => newValue && setTimeframe(newValue)}
                sx={{ marginBottom: 2 }}
            >
                <ToggleButton value="daily">Ngày</ToggleButton>
                <ToggleButton value="monthly">Tháng</ToggleButton>
                <ToggleButton value="yearly">Năm</ToggleButton>
            </ToggleButtonGroup>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={sampleData[timeframe]}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reviews" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatisticsPage;
