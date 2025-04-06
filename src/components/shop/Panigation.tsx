'use client';

import { Pagination } from '@mui/material';
import { ChangeEvent } from 'react';

interface PaginationComponentProps {
    totalItems: number; // Tổng số cửa hàng
    itemsPerPage: number; // Số cửa hàng mỗi trang
    currentPage: number; // Trang hiện tại
    onPageChange: (page: number) => void; // Callback khi thay đổi trang
}

export default function PaginationComponent({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
}: PaginationComponentProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
        onPageChange(page - 1); // Chuyển về index bắt đầu từ 0
    };

    return (
        <Pagination
            count={totalPages}
            page={currentPage + 1} // Pagination của MUI bắt đầu từ 1
            onChange={handlePageChange}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
        />
    );
}