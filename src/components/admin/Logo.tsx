import { Typography, Box } from '@mui/material'

export function Logo() {
    return (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    fontWeight: 700,
                    '& span': {
                        color: 'primary.main'
                    }
                }}
            >
                Web<span>S</span>Review
            </Typography>
        </Box>
    )
}

