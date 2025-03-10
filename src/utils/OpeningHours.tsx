import React from 'react';
import { Select, MenuItem, Button, FormControlLabel, Checkbox } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { daysOfWeek } from '@/common';
import { OpenTime } from '@/models';

interface OpeningHoursProps {
    openTimes: OpenTime[];
    setOpenTimes: React.Dispatch<React.SetStateAction<OpenTime[]>>;
    handleOpenTimeChange: (id: string, field: keyof OpenTime, value: string | boolean) => void;
}

const OpeningHours: React.FC<OpeningHoursProps> = ({
    openTimes,
    setOpenTimes,
    handleOpenTimeChange,
}) => {
    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginBottom: 2 }}
                onClick={() =>
                    setOpenTimes([
                        ...openTimes,
                        {
                            id: Date.now().toString(),
                            dayOfWeekEnum: '',
                            openTime: '',
                            closeTime: '',
                            dayOff: false,
                        },
                    ])
                }
            >
                Thêm giờ mở cửa
            </Button>
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
                    <Select
                        value={time.dayOfWeekEnum}
                        onChange={(e) =>
                            handleOpenTimeChange(time.id, 'dayOfWeekEnum', e.target.value)
                        }
                        displayEmpty
                        sx={{ width: 120 }}
                    >
                        <MenuItem value="" disabled>
                            Chọn ngày
                        </MenuItem>
                        {daysOfWeek.map((day) => (
                            <MenuItem key={day.value} value={day.value}>
                                {day.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <TimePicker
                        label="Mở cửa"
                        value={time.openTime ? dayjs(time.openTime) : null}
                        onChange={(newValue) =>
                            handleOpenTimeChange(
                                time.id,
                                'openTime',
                                newValue ? newValue.format('YYYY-MM-DDTHH:mm') : ''
                            )
                        }
                    />
                    <TimePicker
                        label="Đóng cửa"
                        value={time.closeTime ? dayjs(time.closeTime) : null}
                        onChange={(newValue) =>
                            handleOpenTimeChange(
                                time.id,
                                'closeTime',
                                newValue ? newValue.format('YYYY-MM-DDTHH:mm') : ''
                            )
                        }
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
