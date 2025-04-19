import React, { useEffect, useState } from 'react';
import { Pagination, Stack, Typography } from '@mui/material';

interface CustomPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ page, totalPages, onPageChange }) => {
    // Sử dụng một state nội bộ để theo dõi trang hiện tại
    const [currentPage, setCurrentPage] = useState(page);

    // Cập nhật state nội bộ khi props thay đổi
    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        // Đặt trang hiện tại trong state nội bộ
        setCurrentPage(value);

        // Gọi hàm callback từ parent component
        onPageChange(value);

        // Log để debug
        console.log(
            `Pagination changed to: ${value}, props page: ${page}, totalPages: ${totalPages}`
        );
    };

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={4}>
            <Pagination
                count={totalPages > 0 ? totalPages : 1}
                page={currentPage}
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
                disabled={totalPages <= 1} // Vô hiệu hóa nếu chỉ có 1 trang
            />
            <Typography variant="body2" color="text.secondary">
                {currentPage} of {totalPages > 0 ? totalPages : 1}
            </Typography>
        </Stack>
    );
};

export default CustomPagination;
