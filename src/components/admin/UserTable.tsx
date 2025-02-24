'use client';

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
    Select,
    FormControl,
} from '@mui/material';
import { MoreVert, FilterList } from '@mui/icons-material';
import { TableFilters, User } from '@/models';

const mockUsers: User[] = Array.from({ length: 10 }, (_, i) => ({
    id: `user-${i}`,
    username: `UserA-${i}`,
    avatar: '/placeholder.svg?height=40&width=40',
    email: `UserA${i}@gmail.com`,
    role: ['user'], // Since `role` is an array, use an array of strings.
    phone: `0123456789${i}`,
    statusUser: 'ACTIVE', // You can adjust this to 'INACTIVE' or 'BANNED' based on your needs
    city: 'Hà Nội',
    district: `District ${i + 1}`,
    ward: `Ward ${i + 1}`,
    ratingUser: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
    quantityImage: 10 + i, // Just an example, can vary
    helpful: Math.floor(Math.random() * 100), // Random helpful count
    notLike: Math.floor(Math.random() * 100), // Random not like count
    like: Math.floor(Math.random() * 100), // Random like count
    firstName: `FirstName-${i}`,
    lastName: `LastName-${i}`,
    activeCode: `code-${i}`,
    dateOfBirth: new Date(1990, i, 1), // Random date of birth for each user
}));

export function UserTable() {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [filters, setFilters] = React.useState<TableFilters>({ search: '' });
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [users] = React.useState<User[]>(mockUsers);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(users.map((user) => user.id));
        } else {
            setSelected([]);
        }
    };

    const handleSelect = (id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
                <div className="flex gap-4 items-center mb-4">
                    <div className="flex items-center gap-2">
                        <FilterList />
                        <span className="text-sm">Lọc theo</span>
                    </div>
                    <FormControl size="small" className="min-w-[200px]">
                        <Select value="" displayEmpty className="bg-white">
                            <MenuItem value="">Ngày tham gia</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" className="min-w-[200px]">
                        <Select value="" displayEmpty className="bg-white">
                            <MenuItem value="">Địa chỉ</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" className="min-w-[200px]">
                        <Select value="" displayEmpty className="bg-white">
                            <MenuItem value="">Số bài đăng</MenuItem>
                        </Select>
                    </FormControl>
                    <Button color="error" className="ml-auto" disabled={selected.length === 0}>
                        Xóa bỏ lọc
                    </Button>
                </div>
                <div className="flex gap-4 items-center">
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm người dùng"
                        className="bg-white flex-1"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <Button variant="contained" className="bg-blue-500 hover:bg-blue-600">
                        Thêm mới người dùng
                    </Button>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={
                                        selected.length > 0 && selected.length < users.length
                                    }
                                    checked={selected.length === users.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Tên người dùng</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Số bài đăng</TableCell>
                            <TableCell>Quyền</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} selected={selected.includes(user.id)} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.includes(user.id)}
                                        onChange={() => handleSelect(user.id)}
                                    />
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full"
                                    />
                                </TableCell>
                                <TableCell>{user.city}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm">
                                        Người dùng
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <div>Trang 1/9</div>
                <div className="flex gap-2">
                    <Button size="small" disabled>
                        &lt;
                    </Button>
                    <Button size="small">&gt;</Button>
                </div>
            </div>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => setAnchorEl(null)}>Chỉnh sửa</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>Xóa</MenuItem>
            </Menu>
        </div>
    );
}
