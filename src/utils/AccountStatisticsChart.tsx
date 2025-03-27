import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

type AccountStatisticsChartProps = {
    title: string;
    fetchTotal: (start: Dayjs, end: Dayjs) => Promise<{ data: { data: { total: number } } }>;
};

const AccountStatisticsChart: React.FC<AccountStatisticsChartProps> = ({ title, fetchTotal }) => {
    const [data, setData] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [filter, setFilter] = useState<'month' | 'year'>('month');
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'years'));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

    useEffect(() => {
        if (startDate && endDate && startDate.isBefore(endDate)) {
            fetchData(startDate, endDate, filter);
        }
    }, [startDate, endDate, filter]);

    const fetchData = async (start: Dayjs, end: Dayjs, type: 'month' | 'year') => {
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
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                <h3>{title}</h3>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    {filter === 'month' ? (
                        <>
                            <DatePicker
                                views={['year', 'month']}
                                label="Tháng, năm bắt đầu"
                                value={startDate}
                                onChange={setStartDate}
                            />
                            <DatePicker
                                views={['year', 'month']}
                                label="Tháng, năm kết thúc"
                                value={endDate}
                                onChange={setEndDate}
                            />
                        </>
                    ) : (
                        <>
                            <DatePicker
                                views={['year']}
                                label="Năm bắt đầu"
                                value={startDate}
                                onChange={setStartDate}
                            />
                            <DatePicker
                                views={['year']}
                                label="Năm kết thúc"
                                value={endDate}
                                onChange={setEndDate}
                            />
                        </>
                    )}
                </div>

                <div>
                    <button onClick={() => setFilter('month')}>Theo tháng</button>
                    <button onClick={() => setFilter('year')}>Theo năm</button>
                </div>

                <LineChart
                    xAxis={[{ data: labels, scaleType: 'point' }]}
                    series={[{ data: data }]}
                    width={600}
                    height={400}
                />
            </div>
        </LocalizationProvider>
    );
};

export default AccountStatisticsChart;
