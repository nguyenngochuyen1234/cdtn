import * as React from 'react';
import {
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import cmsApi from '@/api/cmsApi';
import CommonDataGrid from '../datagrid/CommonDataGrid';

interface User {
    id: string;
    username: string;
    email: string;
}

export default function UsersPage() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [totalRows, setTotalRows] = React.useState(0);
    const [filters, setFilters] = React.useState({
        keyword: '',
        page: 0, // Bắt đầu từ page 1 theo API
        limit: 10,
        sort: '',
    });
    const [loading, setLoading] = React.useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);

    React.useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await cmsApi.getAllListUser({
                limit: filters.limit,
                page: filters.page,
                sort: filters.sort,
                keyword: filters.keyword,
            });
            setUsers(response.data.data || []);
            setTotalRows(response.data.meta?.total || 0);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setLoading(false);
    };

    const handleBlockUser = async () => {
        if (selectedUserId) {
            try {
                await cmsApi.blockUser(selectedUserId);
                fetchUsers();
            } catch (error) {
                console.error('Error blocking user:', error);
            }
        }
        setOpenConfirmDialog(false);
        setSelectedUserId(null);
    };

    const handleOpenConfirmDialog = (id: string) => {
        setSelectedUserId(id);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setSelectedUserId(null);
    };

    const columns: GridColDef[] = [
        {
            field: 'username',
            headerName: 'Tên',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'statusUserEnums',
            headerName: 'Trạng thái',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 120,
            sortable: false,
            renderCell: (params) => {
                const isDeactivated = params.row.statusUserEnums === 'DEACTIVE';

                return (
                    <IconButton
                        color="error"
                        onClick={() => handleOpenConfirmDialog(params.row.id)}
                        title={isDeactivated ? 'Đã khóa tài khoản' : 'Khóa tài khoản'}
                    >
                        <LockIcon
                            style={{
                                fill: isDeactivated ? 'red' : 'none',
                                stroke: 'currentColor',
                            }}
                        />
                    </IconButton>
                );
            },
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
                <div className="flex gap-4 items-center">
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm người dùng"
                        value={filters.keyword}
                        onChange={(e) =>
                            setFilters({ ...filters, keyword: e.target.value, page: 1 })
                        }
                        sx={{ minWidth: 300 }}
                    />
                    {/* <Button variant="contained">Thêm mới người dùng</Button> */}
                </div>
            </div>

            <CommonDataGrid
                columns={columns}
                rows={users}
                loading={loading}
                paginationModel={{
                    page: filters.page, // DataGrid dùng page 0-based, API dùng 1-based
                    pageSize: filters.limit,
                }}
                rowCount={totalRows}
                onPaginationModelChange={(model) =>
                    setFilters({
                        ...filters,
                        page: model.page,
                        limit: model.pageSize,
                    })
                }
                getRowId={(row) => row.id}
            />

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Xác nhận khóa tài khoản
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có chắc chắn muốn khóa tài khoản này không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} variant="outlined">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleBlockUser}
                        variant="contained"
                        color="error"
                        startIcon={<LockIcon />}
                    >
                        Khóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
