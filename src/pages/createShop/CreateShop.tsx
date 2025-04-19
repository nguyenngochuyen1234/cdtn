import React from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import CreationStepper from './StepperComponent';

function CreateShop() {
    const navigate = useNavigate();

    return (
        <Grid container sx={{ height: '100vh', bgcolor: 'background.default' }}>
            {/* Header */}
            <Grid
                item
                xs={12}
                sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                }}
            >
                <Button
                    onClick={() => navigate('/')}
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <Link to="/">
                        <img
                            src="/Bright Web.png"
                            alt="Logo"
                            style={{
                                height:  '18px',
                                width: 'auto',
                            }}
                        />
                    </Link>
                </Button>
            </Grid>

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
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        bgcolor: 'background.paper',
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
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f5f5f5',
                        p: 4,
                    }}
                >
                    <Box
                        component="img"
                        src="https://img.freepik.com/free-vector/shop-with-sign-we-are-open_52683-38687.jpg"
                        alt="Shop Illustration"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '80%',
                            objectFit: 'contain',
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default CreateShop;
