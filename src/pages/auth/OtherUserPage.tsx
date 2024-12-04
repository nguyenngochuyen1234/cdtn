
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useState } from 'react'
import {
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Grid,
    IconButton,
    Stack,
    styled,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useTheme,
} from '@mui/material'
import {
    ChatBubbleOutline,
    Favorite,
    FavoriteBorder,
    Language,
    LocationOn,
    Mail,
} from '@mui/icons-material'
import OtherUserCard from "@/components/user/OtherUserCard";
import { colors } from "@/themes/colors";
import DestinationCard from "@/components/user/DestinationCard";

interface Post {
    id: number
    image: string
    likes: number
    comments: number
    liked: boolean
}

interface Profile {
    name: string
    bio: string
    followers: number
    following: number
    posts: Post[]
    website: string
    email: string
    location: string
}
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    borderRadius: '24px',
    gap: '8px',
    padding: '4px',
    '& .MuiToggleButtonGroup-grouped': {
        margin: 0,
        border: 0,
        borderRadius: '20px',
        '&.Mui-selected': {
            backgroundColor: colors.textColor,
            color: theme.palette.primary.contrastText,
            '&:hover': {
            },
        },
        '&:not(.Mui-selected)': {
            color: colors.textColor,
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
        },
    },
}));

const StyledToggleButton = styled(ToggleButton)({
    textTransform: 'none',
    padding: '8px 16px',
    minWidth: '120px',
    '&.MuiToggleButton-root': {
        color: '#fff',
    },
});

interface Tab {
    value: string;
    label: string;
}

const tabs: Tab[] = [
    { value: 'details', label: 'Thông tin chi tiết' },
    { value: 'posts', label: 'Các viết của user B' },
    { value: 'activities', label: 'Các hoạt động của user B' },
];
export default function OtherUserPage() {
    const theme = useTheme()
    const [selected, setSelected] = useState('details');

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) {
            setSelected(newValue);
        }
    };
    const [profile, setProfile] = useState<Profile>({
        name: 'User B',
        bio: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem ipsum.',
        followers: 1234,
        following: 567,
        website: 'example.com',
        email: 'contact@mail.com',
        location: 'Ha Long Bay',
        posts: [
            { id: 1, image: 'https://wallpapers.com/images/hd/hanoi-retains-its-traditional-traits-meba8ch7tnlz4k4i.jpg', likes: 45, comments: 12, liked: false },
            { id: 2, image: 'https://wallpapers.com/images/hd/hanoi-retains-its-traditional-traits-meba8ch7tnlz4k4i.jpg', likes: 45, comments: 12, liked: false },
            { id: 3, image: 'https://wallpapers.com/images/hd/hanoi-retains-its-traditional-traits-meba8ch7tnlz4k4i.jpg', likes: 45, comments: 12, liked: false },
            { id: 4, image: 'https://wallpapers.com/images/hd/hanoi-retains-its-traditional-traits-meba8ch7tnlz4k4i.jpg', likes: 45, comments: 12, liked: false },
        ],
    })

    const toggleLike = (postId: number) => {
        setProfile(prev => ({
            ...prev,
            posts: prev.posts.map(post =>
                post.id === postId ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
            ),
        }))
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ position: 'relative', mb: 4 }}>
                <Box
                    component="img"
                    src="https://tl.cdnchinhphu.vn/Uploads/images/Ha%20Noi(19).jpg"
                    alt="Profile banner"
                    sx={{
                        width: '100%',
                        height: 300,
                        objectFit: 'cover',
                        borderRadius: '16px',
                    }}
                />

                <Box sx={{ position: 'absolute', top: 150, left: 32, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                    <OtherUserCard avatarUrl={""} username={"User B"} stats={"100"} joinDate={"12/12/2023"} />
                </Box>
            </Box>

            <Grid container spacing={4} sx={{ mt: 4 }} flexDirection="row-reverse">
                <Grid item xs={12} md={8}>
                    <StyledToggleButtonGroup
                        sx={{ paddingLeft: 4 }}
                        value={selected}
                        exclusive
                        onChange={handleChange}
                        aria-label="User profile sections"
                    >
                        {tabs.map((tab) => (
                            <StyledToggleButton
                                key={tab.value}
                                value={tab.value}
                                aria-label={tab.label}
                            >
                                {tab.label}
                            </StyledToggleButton>
                        ))}
                    </StyledToggleButtonGroup>
                </Grid>
                <Grid item xs={12} md={8} spacing={4}>
                    <Box sx={{ px: 4, borderRadius: "8px" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            Thông tin về bản thân
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            {profile.bio}
                        </Typography>
                        <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <EmailIcon color="primary" />
                                <Typography variant="body1">{profile.email}</Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LocationOnIcon color="primary" />
                                <Typography variant="body1">{profile.location}</Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
                                <CalendarTodayIcon color="primary" />
                                <Typography variant="body1">11/12/2003</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    <Stack sx={{ paddingLeft: 4, paddingTop: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ pr: 4 }}>
                            Các bài viết nổi bật
                        </Typography>
                        <Grid container spacing={2}>
                            {profile.posts.map((post) => (
                                <Grid item xs={12} sm={6} key={post.id}>
                                    <DestinationCard
                                        image="https://wallpapers.com/images/hd/hanoi-retains-its-traditional-traits-meba8ch7tnlz4k4i.jpg"
                                        title="Vịnh hạ long"
                                        category="Du lịch"
                                        timeAgo="1 tuần trước"
                                        rating={4.5}
                                        reviews={29}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>

                </Grid>
            </Grid>
        </Container>
    )
}

