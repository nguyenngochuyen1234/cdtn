import React from 'react';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { OpenTime } from '@/models';

interface OpeningHoursProps {
    openTimes: OpenTime[];
    setOpenTimes: React.Dispatch<React.SetStateAction<OpenTime[]>>;
    handleOpenTimeChange: (id: string, field: keyof OpenTime, value: string | boolean) => void;
}

const daysOfWeekLabel: { [key: string]: string } = {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday',
};

const OpeningHours: React.FC<OpeningHoursProps> = ({
    openTimes,
    setOpenTimes,
    handleOpenTimeChange,
}) => {
    return (
        <div>
            {openTimes.map((time) => (
                <div
                    key={time.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 12,
                    }}
                >
                    <Typography
                        sx={{
                            minWidth: 100, // Đảm bảo chiều rộng tối thiểu để thẳng hàng
                            fontWeight: 'bold',
                        }}
                    >
                        {daysOfWeekLabel[time.dayOfWeekEnum] || 'Monday'}
                    </Typography>

                    <TimePicker
                        label="Mở cửa"
                        value={time.openTime ? dayjs(`2023-01-01T${time.openTime}:00`) : null}
                        onChange={(newValue) =>
                            handleOpenTimeChange(
                                time.id,
                                'openTime',
                                newValue ? newValue.format('HH:mm') : ''
                            )
                        }
                        disabled={time.dayOff}
                        ampm={true}
                        views={['hours', 'minutes']}
                        sx={{ width: 150 }} // Đảm bảo kích thước đồng đều
                    />
                    <TimePicker
                        label="Đóng cửa"
                        value={time.closeTime ? dayjs(`2023-01-01T${time.closeTime}:00`) : null}
                        onChange={(newValue) =>
                            handleOpenTimeChange(
                                time.id,
                                'closeTime',
                                newValue ? newValue.format('HH:mm') : ''
                            )
                        }
                        disabled={time.dayOff}
                        ampm={true}
                        views={['hours', 'minutes']}
                        sx={{ width: 150 }} // Đảm bảo kích thước đồng đều
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={time.dayOff}
                                onChange={(e) =>
                                    handleOpenTimeChange(time.id, 'dayOff', e.target.checked)
                                }
                            />
                        }
                        label="Nghỉ"
                    />
                </div>
            ))}
        </div>
    );
};

export default OpeningHours;