import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface TravelCardProps {
    imageUrl: string;
    locationName: string;
}

const TravelCard: React.FC<TravelCardProps> = ({ imageUrl, locationName }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="120"
                image={imageUrl}
                width={120}
                alt={`Image of ${locationName}`}
            />
            <CardContent>
                <Typography variant="subtitle1" color="text.secondary">
                    Địa điểm du lịch
                </Typography>
                <Typography variant="h6" component="div">
                    {locationName}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default TravelCard;
