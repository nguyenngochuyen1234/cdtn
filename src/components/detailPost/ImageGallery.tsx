import React from 'react';
import { Box } from '@mui/material';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    return (
        <Box sx={{ width: '100%', minHeight: 'auto' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    gap: 2,
                }}
            >
                {images.map((image, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`Image ${index + 1}`}
                        sx={{
                            width: 400,
                            height: "auto",
                            borderRadius: 1,
                            boxShadow: 2,
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default ImageGallery;
