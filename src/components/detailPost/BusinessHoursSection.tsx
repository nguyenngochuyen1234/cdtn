'use client';

import type React from 'react';
import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CircleIcon from '@mui/icons-material/Circle';
import { Shop } from '@/models';
import { formatTo12Hour } from '@/utils/time';
interface BusinessHour {
    day: string;
    open: string;
    close: string;
}

const businessHours: BusinessHour[] = [
    { day: 'Mon', open: '9AM', close: '10PM' },
    { day: 'Tue', open: '9AM', close: '10PM' },
    { day: 'Wed', open: '9AM', close: '10PM' },
    { day: 'Thu', open: '9AM', close: '10PM' },
    { day: 'Fri', open: '9AM', close: '10PM' },
    { day: 'Sat', open: '9AM', close: '10PM' },
    { day: 'Sun', open: '9AM', close: '10PM' },
];

interface BusinessHoursSectionProps {
    shop: Shop;
}

const BusinessHoursSection: React.FC<BusinessHoursSectionProps> = ({ shop }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ maxWidth: 400, p: 2 }}>
            {/* Location and Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        1456 Luot truy cập
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <CircleIcon sx={{ color: '#4CAF50', fontSize: 10, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Đang mở cửa
                    </Typography>
                </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                <IconButton
                    onClick={() => setIsFavorite(!isFavorite)}
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1,
                        minWidth: 40,
                        height: 40,
                    }}
                >
                    {isFavorite ? (
                        <FavoriteIcon sx={{ color: 'red', fontSize: 20 }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    )}
                </IconButton>

                <IconButton
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1,
                        minWidth: 40,
                        height: 40,
                    }}
                >
                    <ShareIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </IconButton>

                <Button
                    variant="contained"
                    color="error"
                    sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        px: 2,
                        height: 40,
                    }}
                >
                    Đánh giá ngay
                </Button>
            </Box>

            <Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        fontSize: '1.1rem',
                    }}
                >
                    Thời gian hoạt động
                </Typography>

                <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table size="small">
                            <TableBody>
                                {shop.listOpenTimes.map((time) => (
                                    <TableRow
                                        key={time.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{
                                                fontWeight: 500,
                                                py: 1.5,
                                                width: '30%',
                                                borderBottom: '1px solid #f0f0f0',
                                            }}
                                        >
                                            {time.dayOfWeekEnum}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                py: 1.5,
                                                width: '35%',
                                                borderBottom: '1px solid #f0f0f0',
                                            }}
                                        >
                                            {formatTo12Hour(time.openTime)}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                py: 1.5,
                                                width: '35%',
                                                borderBottom: '1px solid #f0f0f0',
                                            }}
                                        >
                                            {formatTo12Hour(time.closeTime)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Box>
    );
};

export default BusinessHoursSection;
