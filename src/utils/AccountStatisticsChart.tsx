import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button, Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

type AccountStatisticsChartProps = {
    title: string;
    fetchTotal: (start: Dayjs, end: Dayjs) => Promise<{ data: { data: { total: number } } }>;
};

const AccountStatisticsChart: React.FC<AccountStatisticsChartProps> = ({ title, fetchTotal }) => {
    const [data, setData] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [filter, setFilter] = useState<'month' | 'year'>('month');
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'year'));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (startDate && endDate && startDate.isBefore(endDate)) {
            fetchData(startDate, endDate, filter);
        }
    }, [startDate, endDate, filter]);

    const fetchData = async (start: Dayjs, end: Dayjs, type: 'month' | 'year') => {
        setLoading(true);
        const requests: Promise<{ data: { data: { total: number } } }>[] = [];
        const newLabels: string[] = [];

        if (type === 'month') {
            let current = start.clone().startOf('month');
            while (current.isBefore(end) || current.isSame(end, 'month')) {
                newLabels.push(current.format('MM/YYYY'));
                requests.push(fetchTotal(current, current.endOf('month')));
                current = current.add(1, 'month');
            }
        } else {
            let current = start.clone().startOf('year');
            while (current.isBefore(end) || current.isSame(end, 'year')) {
                newLabels.push(current.format('YYYY'));
                requests.push(fetchTotal(current.startOf('year'), current.endOf('year')));
                current = current.add(1, 'year');
            }
        }

        try {
            const responses = await Promise.all(requests);
            const newData = responses.map((res) => res.data.data.total || 0);
            setLabels(newLabels);
            setData(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>

                <Box
                    sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}
                >
                    {filter === 'month' ? (
                        <>
                            <DatePicker
                                views={['year', 'month']}
                                label="Tháng, năm bắt đầu"
                                value={startDate}
                                onChange={setStartDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                            <DatePicker
                                views={['year', 'month']}
                                label="Tháng, năm kết thúc"
                                value={endDate}
                                onChange={setEndDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </>
                    ) : (
                        <>
                            <DatePicker
                                views={['year']}
                                label="Năm bắt đầu"
                                value={startDate}
                                onChange={setStartDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                            <DatePicker
                                views={['year']}
                                label="Năm kết thúc"
                                value={endDate}
                                onChange={setEndDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant={filter === 'month' ? 'contained' : 'outlined'}
                            onClick={() => setFilter('month')}
                            size="small"
                        >
                            Theo tháng
                        </Button>
                        <Button
                            variant={filter === 'year' ? 'contained' : 'outlined'}
                            onClick={() => setFilter('year')}
                            size="small"
                        >
                            Theo năm
                        </Button>
                    </Box>
                </Box>

                {loading ? (
                    <Typography>Đang tải dữ liệu...</Typography>
                ) : data.length > 0 ? (
                    <LineChart
                        xAxis={[{ data: labels, scaleType: 'point' }]}
                        series={[{ data: data, curve: 'linear', color: '#1976d2' }]}
                        width={600}
                        height={400}
                        sx={{ backgroundColor: '#fafafa', borderRadius: 2, p: 2 }}
                    />
                ) : (
                    <Typography>Không có dữ liệu để hiển thị</Typography>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default AccountStatisticsChart;
