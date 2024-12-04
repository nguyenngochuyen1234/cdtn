import React from 'react';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Typography,
    styled
} from '@mui/material';
import {
    Download,
    MoreVert,
    Twitter,
    Facebook,
    Instagram
} from '@mui/icons-material';

interface OtherUserCardProps {
    avatarUrl: string;
    username: string;
    stats: string;
    joinDate: string;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const OtherUserCard: React.FC<OtherUserCardProps> = ({
    avatarUrl,
    username,
    stats,
    joinDate
}) => {
    return (
        <Card sx={{ maxWidth: 500, m: 2, px: 8, py: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                >
                    <Avatar
                        alt={username}
                        src={avatarUrl}
                        sx={{ width: 100, height: 100, mb: 2 }}
                    />
                </StyledBadge>
                <Typography variant="h6" component="div">
                    {username}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stats}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ my: 2, textTransform: 'none', borderRadius: 20 }}
                    >
                        Liên hệ
                    </Button>
                    <IconButton size="small">
                        <Download fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                        <MoreVert fontSize="small" />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                    <IconButton size="small" color="primary">
                        <Twitter fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                        <Facebook fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                        <Instagram fontSize="small" />
                    </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    Tham gia ngày {joinDate}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default OtherUserCard;

