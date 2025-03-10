import reviewApi from '@/api/reviewApi';
import { Review } from '@/models';
import { RootState } from '@/redux/stores';
import ReviewCard from '@/utils/ReviewCard';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const MyReviews = () => {
    const [recentReviews, setRecentReviews] = useState<Review[] | null>([]);
    const [loadingShop, setLoadingShop] = useState(false);
    const user = useSelector((state: RootState) => state.user.user);

    const fetchDataShop = async () => {
        try {
            if (user && user.id) {
                setLoadingShop(true);
                const resReviews = await reviewApi.getAllReviewByIdUser(user.id);
                setRecentReviews(resReviews.data.data);
                console.log(resReviews.data.data);
            }
        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setLoadingShop(false);
        }
    };
    const [imagePreviews, setImagePreviews] = useState<File[] | null>();
    useEffect(() => {
        fetchDataShop();
    }, []);
    return (
        <Stack spacing={3}>
            {(recentReviews || []).map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </Stack>
    );
};

export default MyReviews;
