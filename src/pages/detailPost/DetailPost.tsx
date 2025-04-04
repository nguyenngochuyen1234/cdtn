import { Breadcrumbs, Divider, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HeaderDetailPost from '@/components/detailPost/HeaderDetailPost';
import ImageGallery from '@/components/detailPost/ImageGallery';
import RateArticle from '@/components/detailPost/RateArticle';
import ReviewCardPost from '@/components/detailPost/ReviewCardPost';
import BusinessHoursSection from '@/components/detailPost/BusinessHoursSection';
import SuggestShops from '@/components/detailPost/SuggestShops';
import { Shop } from '@/models';
import shopApi from '@/api/shopApi';
import { useParams } from 'react-router-dom';

function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}
const fakeReviews = [
    {
        user: {
            name: 'Nguyễn Văn A',
            location: 'Hà Nội, Việt Nam',
            profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        review: {
            rating: 5,
            date: '2024-02-28',
            text: 'Phong cảnh rất đẹp!',
            images: [
                'https://cdn.tgdd.vn/Files/2021/06/24/1363040/cac-mon-ngon-ha-noi-phai-thu-cac-quan-an-ha-noi-phai-ghe-202209271046019037.jpg',
                'https://cdn.tgdd.vn/Files/2021/06/24/1363040/cac-mon-ngon-ha-noi-phai-thu-cac-quan-an-ha-noi-phai-ghe-202209271046019037.jpg',
                'https://cdn.tgdd.vn/Files/2021/06/24/1363040/cac-mon-ngon-ha-noi-phai-thu-cac-quan-an-ha-noi-phai-ghe-202209271046019037.jpg',
            ],
            metrics: {
                helpful: 10,
                likes: 20,
                dislikes: 2,
            },
        },
    },
    {
        user: {
            name: 'Trần Thị B',
            location: 'TP. Hồ Chí Minh, Việt Nam',
            profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
        review: {
            rating: 4,
            date: '2024-02-27',
            text: 'Phong cảnh rất đẹp!',
            images: [
                'https://cdn.tgdd.vn/Files/2021/06/24/1363040/cac-mon-ngon-ha-noi-phai-thu-cac-quan-an-ha-noi-phai-ghe-202209271046019037.jpg',
                'https://cdn.tgdd.vn/Files/2021/06/24/1363040/cac-mon-ngon-ha-noi-phai-thu-cac-quan-an-ha-noi-phai-ghe-202209271046019037.jpg',
                'https://cdn.tgdd.vn/Files/2021/06/24/1363040/cac-mon-ngon-ha-noi-phai-thu-cac-quan-an-ha-noi-phai-ghe-202209271046019037.jpg',
            ],
            metrics: {
                helpful: 5,
                likes: 12,
                dislikes: 3,
            },
        },
    },
];
function DetailPost() {
    const [detailShop, setDetailShop] = useState<Shop | null>();
    const { id } = useParams();
    const fetchDataShop = async () => {
        try {
            if (id) {
                const response = await shopApi.getShopById(id);
                if (response?.data.data) {
                    setDetailShop(response?.data.data);
                }
            }
        } catch {}
    };
    useEffect(() => {
        fetchDataShop();
    }, []);
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick}>
            Trang chủ
        </Link>,
        <Link
            underline="hover"
            key="2"
            color="inherit"
            href="/material-ui/getting-started/installation/"
            onClick={handleClick}
        >
            Du lịch
        </Link>,
        <Typography key="3" sx={{ color: 'text.primary' }}>
            Bài viết 1
        </Typography>,
    ];

    return (
        <div className="px-[50px] py-[30px] bg-[#FAFBFC]">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <HeaderDetailPost />
                    <ImageGallery images={detailShop?.mediaUrls || []} />
                </Grid>
                {detailShop && (
                    <Grid item xs={3}>
                        <BusinessHoursSection shop={detailShop} />
                    </Grid>
                )}
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Stack sx={{ gap: 2, paddingTop: 5, paddingBottom: 5 }}>
                        <Typography variant="h5" fontWeight="bol    d">
                            Nội dung bài viết
                        </Typography>
                        <Typography variant="body2" fontWeight="Nội dung bài viết">
                            {detailShop?.description}
                        </Typography>
                    </Stack>
                    <Divider />
                    <RateArticle ratings={[80, 60, 40, 20, 10]} />
                    <Divider />
                    <div className="space-y-6 my-6">
                        {fakeReviews.map((review, index) => (
                            <ReviewCardPost key={index} user={review.user} review={review.review} />
                        ))}
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <SuggestShops type="forme" />
                    <Divider />
                    <SuggestShops type="forme1" />
                </Grid>
            </Grid>
        </div>
    );
}

export default DetailPost;
