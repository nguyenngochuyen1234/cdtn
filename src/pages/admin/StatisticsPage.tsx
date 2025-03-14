import React, { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const fetchStatistics = async (startDate: string, endDate: string) => {
    // Simulated API call (replace with real API)
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = [
                { date: '2024-03-01', totalStores: 50 },
                { date: '2024-03-02', totalStores: 65 },
                { date: '2024-03-03', totalStores: 80 },
                { date: '2024-02-28', totalStores: 60 },
                { date: '2023-12-25', totalStores: 90 },
            ];
            resolve(data);
        }, 1000);
    });
};

const StatisticsPage: React.FC = () => {
    // Initialize with valid Dayjs objects. If the user doesn't select, it will default to today.
    const [startDate, setStartDate] = useState<Dayjs>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs>(dayjs());
    const [data, setData] = useState<{ date: string; totalStores: number }[]>([]);
    const [filterType, setFilterType] = useState<'day' | 'month' | 'year'>('day');

    const handleFetch = async () => {
        // Ensure startDate and endDate are valid Dayjs objects before calling format()
        if (!startDate.isValid() || !endDate.isValid()) return;

        const startDateFormatted = startDate.format('YYYY-MM-DD');
        const endDateFormatted = endDate.format('YYYY-MM-DD');

        const result = await fetchStatistics(startDateFormatted, endDateFormatted);

        // Filter data based on the selected filter type
        const filteredData = (result as any).filter((item: { date: string }) => {
            const itemDate = dayjs(item.date);
            if (filterType === 'day') {
                // Filter by exact day
                return itemDate.isSame(startDate, 'day');
            }
            if (filterType === 'month') {
                // Filter by same month and year
                return itemDate.isSame(startDate, 'month');
            }
            if (filterType === 'year') {
                // Filter by same year
                return itemDate.isSame(startDate, 'year');
            }
            return false;
        });

        setData(filteredData);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
                <CardContent>
                    <DatePicker
                        label="Ngày bắt đầu"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue ?? dayjs())} // Ensure Dayjs object, fallback to today
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                    <DatePicker
                        label="Ngày kết thúc"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue ?? dayjs())} // Ensure Dayjs object, fallback to today
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Filter By</InputLabel>
                        <Select
                            value={filterType}
                            label="Filter By"
                            onChange={(e) =>
                                setFilterType(e.target.value as 'day' | 'month' | 'year')
                            }
                        >
                            <MenuItem value="day">Day</MenuItem>
                            <MenuItem value="month">Month</MenuItem>
                            <MenuItem value="year">Year</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleFetch} sx={{ mt: 2, width: '100%' }}>
                        Lấy dữ liệu
                    </Button>
                    <LineChart width={500} height={300} data={data} style={{ marginTop: 20 }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="totalStores" stroke="#8884d8" />
                    </LineChart>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
};

export default StatisticsPage;
