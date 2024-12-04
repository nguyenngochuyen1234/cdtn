import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import CSS for carousel

const destinations = [
    {
        backgroundImage: 'https://m.yodycdn.com/blog/danh-lam-thang-canh-viet-nam-yody-vn-7.jpg',
        title: 'Điểm đến thu hút',
        description: 'Giúp bạn trải nghiệm 1 cách chân thực nhất',
    },
    {
        backgroundImage: 'https://m.yodycdn.com/blog/danh-lam-thang-canh-viet-nam-yody-vn-7.jpg',
        title: 'Điểm đến thu hút',
        description: 'Giúp bạn trải nghiệm 1 cách chân thực nhất',
    },
    {
        backgroundImage: 'https://m.yodycdn.com/blog/danh-lam-thang-canh-viet-nam-yody-vn-7.jpg',
        title: 'Điểm đến thu hút',
        description: 'Giúp bạn trải nghiệm 1 cách chân thực nhất',
    },
    {
        backgroundImage: 'https://m.yodycdn.com/blog/danh-lam-thang-canh-viet-nam-yody-vn-7.jpg',
        title: 'Điểm đến thu hút',
        description: 'Giúp bạn trải nghiệm 1 cách chân thực nhất',
    },
    {
        backgroundImage: 'https://m.yodycdn.com/blog/danh-lam-thang-canh-viet-nam-yody-vn-7.jpg',
        title: 'Điểm đến thu hút',
        description: 'Giúp bạn trải nghiệm 1 cách chân thực nhất',
    },
    {
        backgroundImage: 'https://m.yodycdn.com/blog/danh-lam-thang-canh-viet-nam-yody-vn-7.jpg',
        title: 'Điểm đến thu hút',
        description: 'Giúp bạn trải nghiệm 1 cách chân thực nhất',
    },
    {
        backgroundImage: 'https://m.yodycdn.com/blog/danh-lam-thang-canh-viet-nam-yody-vn-7.jpg',
        title: 'Điểm đến thu hút',
        description: 'Giúp bạn trải nghiệm 1 cách chân thực nhất',
    },
    {
        backgroundImage: 'https://m.yodycdn.com/blog/danh-lam-thang-canh-viet-nam-yody-vn-7.jpg',
        title: 'Điểm đến thu hút',
        description: 'Giúp bạn trải nghiệm 1 cách chân thực nhất',
    },
    {
        backgroundImage: 'https://m.yodycdn.com/blog/danh-lam-thang-canh-viet-nam-yody-vn-7.jpg',
        title: 'Điểm đến thu hút',
        description: 'Giúp bạn trải nghiệm 1 cách chân thực nhất',
    },
];

const App: React.FC = () => {
    return (
        <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} interval={3000}>
            {Array.from({ length: Math.ceil(destinations.length / 3) }).map((_, index) => (
                <div key={index}>
                    <Grid container spacing={2}>
                        {destinations.slice(index * 3, index * 3 + 3).map((destination, destIndex) => (
                            <Grid item xs={12} sm={6} md={4} key={destIndex}>
                                <Card
                                    sx={{
                                        backgroundImage: `url(${destination.backgroundImage})`,
                                        backgroundSize: 'cover',
                                        color: 'white',
                                        height: '715px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <CardContent sx={{ position: 'absolute', bottom: 20, padding: 2 }}>
                                        <Typography variant="h6" component="div">
                                            {destination.title}
                                        </Typography>
                                        <Typography variant="body2">
                                            {destination.description}
                                        </Typography>
                                        <Button variant="contained" sx={{ marginTop: 1 }}>
                                            Xem ngay
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            ))}
        </Carousel>
    );
};

export default App;
