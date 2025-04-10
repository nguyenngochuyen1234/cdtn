'use client';
import { useState, useEffect } from 'react';
import type React from 'react';
import {
    Box,
    Tabs,
    Tab,
    Avatar,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import UserProfile from '@/components/user/UserProfile';
import UserPosts from '@/components/user/UserPost';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import type { AppDispatch, RootState } from '@/redux/stores';
import userApi from '@/api/userApi';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/models';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface DecodedToken {
    sub: string;
    [key: string]: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ProfilePage() {
    const [tabValue, setTabValue] = useState(0);
    const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);

    // Hàm fetch user data từ API
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded: DecodedToken = jwtDecode(token);
                const userId = decoded.sub;
                const response = await userApi.getUserById(userId);
                if (response?.data) {
                    const userData: User = response.data.data;
                    dispatch(setUser(userData)); // Cập nhật user vào Redux
                }
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    // Fetch user data lần đầu khi component mount
    useEffect(() => {
        fetchUser();
    }, [dispatch]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Handle avatar file selection và upload ngay lập tức
    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedAvatar(file);
            try {
                const response = await userApi.uploadImage(file); // Gửi file trực tiếp
                const newAvatarUrl = response.data.data;
                const updatedData = { avatar: newAvatarUrl };
                await userApi.updateProfile(updatedData);
                await fetchUser();
                setOpenAvatarDialog(false);
                setSelectedAvatar(null);
            } catch (error) {
                console.error('Error uploading avatar or updating profile:', error);
                alert('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.');
            }
        }
    };

    const handleProfileUpdate = async () => {
        await fetchUser();
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Box sx={{ cursor: 'pointer' }} onClick={() => setOpenAvatarDialog(true)}>
                        <Avatar
                            sx={{
                                width: 128,
                                height: 128,
                                border: '4px solid white',
                                bgcolor: 'white',
                            }}
                            src={user?.avatar || '/default-avatar.png'}
                            alt="User avatar"
                        />
                    </Box>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            centered
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '1rem',
                                },
                            }}
                        >
                            <Tab label="Tài khoản của tôi" />
                            <Tab label="Các bài đăng của tôi" />
                        </Tabs>
                    </Box>
                    <TabPanel value={tabValue} index={0}>
                        <UserProfile onProfileUpdate={handleProfileUpdate} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <UserPosts />
                    </TabPanel>
                </Box>
            </Container>

            {/* Avatar selection dialog */}
            <Dialog
                open={openAvatarDialog}
                onClose={() => setOpenAvatarDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Chọn avatar mới</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            py: 2,
                        }}
                    >
                        {selectedAvatar && (
                            <Avatar
                                src={URL.createObjectURL(selectedAvatar)}
                                sx={{ width: 100, height: 100, mb: 2 }}
                            />
                        )}
                        <Button variant="outlined" component="label">
                            Chọn ảnh
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAvatarDialog(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
