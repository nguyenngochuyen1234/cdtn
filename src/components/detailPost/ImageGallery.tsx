import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import shopApi from '@/api/shopApi';
import HeaderDetailPost from './HeaderDetailPost'; // Import HeaderDetailPost

interface ImageGalleryProps {
  avatar: string;
  images: string[];
  shopId: string;
  shop: any; // Thêm prop shop để truyền vào HeaderDetailPost
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ avatar, images, shopId, shop }) => {
  const [showModal, setShowModal] = useState(false);
  const [serviceImages, setServiceImages] = useState<string[]>([]);

  // Fetch service images
  useEffect(() => {
    const fetchServiceImages = async () => {
      try {
        const body = {
          limit: 12,
          page: 0,
          sort: 'asc',
          keyword: '',
        };
        const response = await shopApi.getServiceByIdShop(shopId, body);
        if (response?.data) {
          const services = response.data.data;
          const images = services.flatMap((service: any) => service.images || []);
          setServiceImages(images);
        }
      } catch (error) {
        console.error('Error fetching service images:', error);
      }
    };
    fetchServiceImages();
  }, [shopId]);

  // Combine all images
  const allImages = [avatar, ...images, ...serviceImages];

  return (
    <>
      {/* Main Image as Background */}
      <Box
        sx={{
          height: 500, // Tăng chiều cao để tránh cắt bớt ảnh
          backgroundImage: `url(${avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Thêm HeaderDetailPost vào đây */}
        <HeaderDetailPost shop={shop} shopId={shopId} />

        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 1,
            cursor: 'pointer',
            zIndex: 3, // Đảm bảo nút "See all" nằm trên header
          }}
          onClick={() => setShowModal(true)}
        >
          See all {allImages.length} photos
        </Typography>
      </Box>

      {/* Modal for All Photos */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            p: 3,
            maxWidth: '90%',
            maxHeight: '90%',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={() => setShowModal(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Photos and videos
          </Typography>
          <Grid container spacing={2}>
            {allImages.map((image, index) => (
              <Grid item xs={4} key={index}>
                <Box
                  component="img"
                  src={image}
                  alt={`Image ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ImageGallery;