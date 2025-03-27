import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    IconButton,
    TextField,
    Button,
    Menu,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import cmsApi from '@/api/cmsApi';

export default function UsersPage() {
    const [users, setUsers] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [filters, setFilters] = React.useState({ keyword: '', page: 2, limit: 10, sort: '' });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [selectedUserId, setSelectedUserId] = React.useState(null);

    React.useEffect(() => {
        console.log('hi');
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await cmsApi.getAllListUser(filters);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setLoading(false);
    };

    const handleBlockUser = async (id: string | null) => {
        try {
            if (id) {
                await cmsApi.blockUser(id);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
                <div className="flex gap-4 items-center">
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm người dùng"
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    />
                    <Button variant="contained">Thêm mới người dùng</Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center">
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(e) => {
                                                setAnchorEl(e.currentTarget);
                                                setSelectedUserId(user.id);
                                            }}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))} */}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => handleBlockUser(selectedUserId)}>Chặn</MenuItem>
            </Menu>
        </div>
    );
}
