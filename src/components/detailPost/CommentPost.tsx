import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    styled,
    Stack,
    Divider
} from '@mui/material';
import {
    MoreHoriz as MoreHorizIcon,
    Favorite as FavoriteIcon,
    PhotoCamera as PhotoCameraIcon,
    NavigateBefore,
    NavigateNext
} from '@mui/icons-material';

interface Comment {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    content: string;
    timestamp: string;
    likes: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: '100%',
    margin: 'auto',
    padding: theme.spacing(2),
}));

const CommentTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '20px',
        backgroundColor: theme.palette.grey[50],
    }
}));

export default function CommentPost() {
    const [comments] = useState<Comment[]>([
        {
            id: '1',
            user: { name: 'users B', avatar: '/placeholder.svg?height=40&width=40' },
            content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            timestamp: '3 giờ trước',
            likes: 200,
        },
        {
            id: '2',
            user: { name: 'users C', avatar: '/placeholder.svg?height=40&width=40' },
            content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            timestamp: '3 giờ trước',
            likes: 200,
        },
    ]);

    return (
        <StyledCard elevation={0}>
            <Typography variant="h6" gutterBottom>
                Bình luận
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                371 Bình luận
            </Typography>

            <Box sx={{ mb: 3 }}>
                <CommentTextField
                    fullWidth
                    placeholder="Viết Bình luận của bạn..."
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton color="primary">
                                    <PhotoCameraIcon />
                                </IconButton>
                                <Button variant="contained" sx={{ height: "100%" }} color="error" size="small">
                                    Bình luận
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />

            </Box>

            <Stack spacing={2}>
                {comments.map((comment) => (
                    <Box key={comment.id}>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Avatar src={comment.user.avatar} />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="subtitle2">{comment.user.name}</Typography>
                                    <IconButton size="small">
                                        <MoreHorizIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    {comment.timestamp}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {comment.content}
                                </Typography>
                                <Button
                                    startIcon={<FavoriteIcon />}
                                    size="small"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {comment.likes} lượt thích
                                </Button>
                            </Box>
                        </Box>
                        <Divider />
                    </Box>
                ))}
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 1 }}>
                <IconButton size="small">
                    <NavigateBefore />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                    1 of 40
                </Typography>
                <IconButton size="small">
                    <NavigateNext />
                </IconButton>
            </Box>
        </StyledCard>
    );
}