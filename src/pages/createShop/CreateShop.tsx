import React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import Illustration from '@/assets/images/wishlist.png';

function CreateShop() {
    const navigate = useNavigate();

    return (
        <Grid container sx={{ height: '100vh' }}>
            {/* Header */}
            {/* <Grid
                item
                xs={12}
                sx={{
                    width: '100%',
                    alignItems: 'center',
                }}
            >
                <Button onClick={() => navigate('/')}>
                    <Typography variant="h4" fontWeight="bold">
                        Logo
                    </Typography>
                    <Typography sx={{ textTransform: 'none', mx: 1 }} variant="h6">
                        for business
                    </Typography>
                </Button>
            </Grid> */}

            {/* Main Content */}
            <Grid
                container
                item
                xs={12}
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                }}
            >
                {/* Left Column */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        paddingX: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Outlet />
                </Grid>

                {/* Right Column */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src="https://img.freepik.com/free-vector/shop-with-sign-we-are-open_52683-38687.jpg"
                        alt="Shop Illustration"
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default CreateShop;
