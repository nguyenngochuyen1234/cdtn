import {
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    Avatar,
    Box,
    Typography,
    styled,
    Stack,
} from '@mui/material';
import { NotificationsOutlined } from '@mui/icons-material';
import { SearchBar } from './searchBar';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'white',
    color: theme.palette.text.primary,
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        minWidth: 18,
        height: 18,
        padding: '0 4px',
    },
}));

export function Header() {
    return (
        <StyledAppBar position="fixed">
            <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ px: 2, mb: 2 }}>
                    <SearchBar />
                </Box>
                <Stack flexDirection="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                            src="/placeholder.svg?height=32&width=32"
                            alt="User Avatar"
                            sx={{ width: 32, height: 32 }}
                        />
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="subtitle2">User A</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Quản trị
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Toolbar>
        </StyledAppBar>
    );
}
