import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, CircularProgress } from '@mui/material';

interface CommonDataGridProps {
    columns: GridColDef[];
    rows: any[];
    loading?: boolean;
    paginationModel: { page: number; pageSize: number };
    rowCount: number;
    onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
    getRowId?: (row: any) => string;
}

const CommonDataGrid: React.FC<CommonDataGridProps> = ({
    columns,
    rows,
    loading = false,
    paginationModel,
    rowCount,
    onPaginationModelChange,
    getRowId,
}) => {
    return (
        <Box sx={{ width: '100%', position: 'relative', minHeight: 200 }}>
            <DataGrid
                columns={columns}
                rows={rows}
                paginationModel={paginationModel}
                rowCount={rowCount}
                onPaginationModelChange={onPaginationModelChange}
                pageSizeOptions={[5, 10, 25]}
                paginationMode="server"
                loading={loading}
                getRowId={getRowId}
                disableRowSelectionOnClick
                sx={{
                    '& .MuiDataGrid-root': {
                        borderRadius: 1,
                    },
                }}
            />
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default CommonDataGrid;
