import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Grid,
    TextField,
    Typography,
    Link,
    FormControlLabel,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import CarouselComponent from '@/components/CarouselComponent';
import { Outlet, useNavigate } from "react-router-dom"


function AuthPage() {
    const navigate = useNavigate()


    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="h4" fontWeight="bold">Logo</Typography>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Outlet />
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                <CarouselComponent />
            </Grid>
        </Grid>
    );
}

export default AuthPage