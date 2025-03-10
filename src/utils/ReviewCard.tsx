import { useState } from 'react';
import {
    Card,
    CardContent,
    Box,
    Avatar,
    Typography,
    Rating,
    IconButton,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { ThumbUp } from '@mui/icons-material';
import { Review } from '@/models';
import StarRating from '@/components/detailPost/StarRating';

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const toggleExpand = () => setExpanded(!expanded);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Card sx={{ boxShadow: 1 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box display="flex" gap={2}>
                        <Avatar>{review.userReviewInfo.avatar}</Avatar>
                        <Box>
                            <Typography fontWeight="bold">
                                {review.userReviewInfo.firstName}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(review.updatedAt).toLocaleDateString('vi-VN')}
                                </Typography>
                            </Box>
                            <StarRating size="small" rating={review.rating} setRating={() => {}} />
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <IconButton size="small">
                            <ThumbUp fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" mr={2}>
                            {review.like}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={2}>
                    {expanded ? review.reviewContent : `${review.reviewContent.slice(0, 100)}...`}
                </Typography>
                {review.reviewContent.length > 100 && (
                    <Button
                        sx={{ mt: 1, p: 0, minWidth: 0 }}
                        color="primary"
                        onClick={toggleExpand}
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </Button>
                )}
                {review.mediaUrlReview && review.mediaUrlReview.length > 0 && (
                    <Grid container spacing={1} mt={2}>
                        {review.mediaUrlReview.slice(0, 4).map((image, index) => (
                            <Grid item xs={3} key={index}>
                                <img
                                    src={image}
                                    alt={`Review Image ${index + 1}`}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        borderRadius: 4,
                                        objectFit: 'cover',
                                    }}
                                />
                            </Grid>
                        ))}
                        {review.mediaUrlReview.length > 4 && (
                            <Grid item xs={12}>
                                <Button onClick={handleOpen} color="primary">
                                    See all photos
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                )}
                <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle>All Photos</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            {review.mediaUrlReview.map((image, index) => (
                                <Grid item xs={4} key={index}>
                                    <img
                                        src={image}
                                        alt={`Review Image ${index + 1}`}
                                        style={{ width: '100%', height: 'auto', borderRadius: 4 }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default ReviewCard;
