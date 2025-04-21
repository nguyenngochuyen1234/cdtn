import React from 'react';
import {
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { OpenTime } from '@/models';

interface OpeningHoursProps {
    openTimes: OpenTime[];
    handleOpenTimeChange: (id: string, field: keyof OpenTime, value: string | boolean) => void;
}

const daysOfWeekLabel: { [key: string]: string } = {
    MONDAY: 'Thứ Hai',
    TUESDAY: 'Thứ Ba',
    WEDNESDAY: 'Thứ Tư',
    THURSDAY: 'Thứ Năm',
    FRIDAY: 'Thứ Sáu',
    SATURDAY: 'Thứ Bảy',
    SUNDAY: 'Chủ Nhật',
};

const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const OpeningHours: React.FC<OpeningHoursProps> = ({ openTimes, handleOpenTimeChange }) => {
    // Sort openTimes by dayOrder
    const sortedOpenTimes = [...openTimes].sort(
        (a, b) => dayOrder.indexOf(a.dayOfWeekEnum) - dayOrder.indexOf(b.dayOfWeekEnum)
    );

    return (
        <div>
            {sortedOpenTimes.map((time) => (
                <div
                    key={time.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 12,
                    }}
                >
                    <FormControl sx={{ width: 120 }} disabled>
                        <InputLabel>Ngày</InputLabel>
                        <Select value={time.dayOfWeekEnum} label="Ngày">
                            <MenuItem value={time.dayOfWeekEnum}>
                                {daysOfWeekLabel[time.dayOfWeekEnum]}
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <TimePicker
                        label="Mở cửa"
                        value={
                            time.openTime && dayjs(time.openTime, 'HH:mm').isValid()
                                ? dayjs(time.openTime, 'HH:mm')
                                : null
                        }
                        onChange={(newValue) =>
                            handleOpenTimeChange(
                                time.id,
                                'openTime',
                                newValue && dayjs(newValue).isValid()
                                    ? dayjs(newValue).format('HH:mm')
                                    : ''
                            )
                        }
                        disabled={time.dayOff}
                        slotProps={{ textField: { error: !time.dayOff && !time.openTime } }}
                    />
                    <TimePicker
                        label="Đóng cửa"
                        value={
                            time.closeTime && dayjs(time.closeTime, 'HH:mm').isValid()
                                ? dayjs(time.closeTime, 'HH:mm')
                                : null
                        }
                        onChange={(newValue) =>
                            handleOpenTimeChange(
                                time.id,
                                'closeTime',
                                newValue && dayjs(newValue).isValid()
                                    ? dayjs(newValue).format('HH:mm')
                                    : ''
                            )
                        }
                        disabled={time.dayOff}
                        slotProps={{ textField: { error: !time.dayOff && !time.closeTime } }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={time.dayOff}
                                onChange={(e) => {
                                    handleOpenTimeChange(time.id, 'dayOff', e.target.checked);
                                    if (e.target.checked) {
                                        handleOpenTimeChange(time.id, 'openTime', '');
                                        handleOpenTimeChange(time.id, 'closeTime', '');
                                    }
                                }}
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
