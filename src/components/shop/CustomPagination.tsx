// components/CustomPagination.tsx
import React from 'react';
import { Pagination, Stack, Typography } from '@mui/material';

interface CustomPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ page, totalPages, onPageChange }) => {
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        onPageChange(value);
    };

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={4}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handleChange}
                color="primary"
                variant="outlined"
                shape="rounded"
                showFirstButton
                showLastButton
                sx={{
                    '& .MuiPaginationItem-root': {
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        color: '#000',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#1976d2',
                            color: 'white',
                            borderColor: '#1976d2',
                        },
                    },
                }}
            />
            <Typography variant="body2" color="text.secondary">
                {page} of {totalPages}
            </Typography>
        </Stack>
    );
};

export default CustomPagination;
