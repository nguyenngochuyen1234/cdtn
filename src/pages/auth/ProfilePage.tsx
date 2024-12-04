'use client'

import { useState } from 'react'
import {
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Divider,
    IconButton,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from '@mui/material'
import { Facebook, Instagram, Twitter } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import imageBackground from "@/assets/images/bgUser.png"
interface SocialLink {
    platform: string
    url: string
}

interface UserProfile {
    name: string
    email: string
    location: string
    birthDate: string
    bio: string
    socialLinks: SocialLink[]
}

export default function ProfilePage() {
    const theme = useTheme()
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const [profile, setProfile] = useState<UserProfile>({
        name: 'User A',
        email: 'UserA@gmail.com',
        location: 'Hà Nội',
        birthDate: '15-04-2004',
        bio: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the sta...',
        socialLinks: [
            { platform: 'Facebook', url: 'https://www.facebook.com/' },
            { platform: 'Instagram', url: 'https://www.instagram.com/' },
            { platform: 'Twitter', url: 'https://twitter.com/' },
        ],
    })
    const inputStyle = {
        flex: 1, "& .MuiOutlinedInput-root": {
            "& fieldset": {
                border: "none",
            },
        },
    }
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${imageBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: 4,
            }}
        >
            <Box sx={{ position: 'relative', mb: 8 }}>
                <Box
                    sx={{
                        height: 200,
                        backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrDlX6zaneCG2iU_wo4EWF8Qto6g0F2fOP7A&s')",
                        borderRadius: '16px',
                    }}
                />

                <Avatar
                    sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid white',
                        position: 'absolute',
                        bottom: -60,
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                    src="/placeholder.svg"
                    alt={profile.name}
                />
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleChange}
                    aria-label="Segmented buttons"
                    centered
                    TabIndicatorProps={{
                        style: { backgroundColor: "red", height: 2 },
                    }}
                >
                    <Tab label="Tài khoản của tôi" />
                    <Tab label="Các bài đăng của tôi" />
                    <Tab label="Các hoạt động của tôi" />
                </Tabs>
            </Box>
            <Card sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '7 1 0', minWidth: 300 }}>
                        <Typography variant="h6" gutterBottom sx={{ marginBottom: 4 }}>
                            Thông tin về bản thân
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Họ tên"
                                    value={profile.name}
                                    variant="outlined"

                                />
                                <Button variant="outlined" startIcon={<EditIcon />} sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }}>
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Email"
                                    value={profile.email}
                                    variant="outlined"
                                />
                                <Button variant="outlined" startIcon={<EditIcon />} sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }} >
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Mật khẩu"
                                    type="password"
                                    value="********"
                                    variant="outlined"
                                />
                                <Button variant="outlined" startIcon={<EditIcon />} sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }}>
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Địa chỉ"
                                    value={profile.location}
                                    variant="outlined"
                                />
                                <Button variant="outlined" startIcon={<EditIcon />} sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }}>
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Ngày sinh"
                                    value={profile.birthDate}
                                    variant="outlined"
                                />
                                <Button variant="outlined" startIcon={<EditIcon />} sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }}>
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Tiểu sử của bạn"
                                    value={profile.bio}
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                />
                                <Button variant="outlined" startIcon={<EditIcon />} sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }}>
                                    Thay đổi
                                </Button>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ flex: '3 1 0', minWidth: 200 }}>
                        <Typography variant="h6" gutterBottom>
                            Liên kết mạng xã hội khác
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton color="primary">
                                    <Facebook />
                                </IconButton>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    placeholder="https://www.facebook.com/"
                                    value={profile.socialLinks[0].url}
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton color="primary">
                                    <Instagram />
                                </IconButton>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    placeholder="https://www.instagram.com/"
                                    value={profile.socialLinks[1].url}
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton color="primary">
                                    <Twitter />
                                </IconButton>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    placeholder="https://twitter.com/"
                                    value={profile.socialLinks[2].url}
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                                <Button variant="outlined" startIcon={<EditIcon />} sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }}>
                                    Thay đổi
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Box>


            </Card>

        </Box>
    )
}

