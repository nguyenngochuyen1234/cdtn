import { Breadcrumbs, Divider, Link, Stack, Typography } from '@mui/material';
import React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HeaderDetailPost from '@/components/detailPost/HeaderDetailPost';
import ImageGallery from '@/components/detailPost/ImageGallery';
import RateArticle from '@/components/detailPost/RateArticle';
import ReviewCardPost from '@/components/detailPost/ReviewCardPost';

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
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
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
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
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
    const images = [
        'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
        'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
        'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
        'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
        'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/13/du-lich-phong-nha-ke-bang-123-2134.jpg',
    ];

    return (
        <div className="px-[50px] py-[30px] bg-[#FAFBFC]">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
            <HeaderDetailPost />
            <ImageGallery images={images} />
            <Stack sx={{ gap: 2, paddingTop: 5, paddingBottom: 5 }}>
                <Typography variant="h5" fontWeight="bol    d">
                    Nội dung bài viết
                </Typography>
                <Typography variant="body2" fontWeight="Nội dung bài viết">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it to make a type specimen
                    book. It has survived not only five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged. It was popularised in the 1960s
                    with the release of Letraset sheets containing Lorem Ipsum passages, and more
                    recently with desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum. t is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at its layout. The
                    point of using Lorem Ipsum is that it has a more-or-less normal distribution of
                    letters, as opposed to using 'Content here, content here', making it look like
                    readable English. Many desktop publishing packages and web page editors now use
                    Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will
                    uncover many web sites still in their infancy. Various versions have evolved
                    over the years, sometimes by accident, sometimes on purpose (injected humour and
                    the like).
                </Typography>
            </Stack>
            <Divider />
            <RateArticle />
            <div className="space-y-6">
                {fakeReviews.map((review, index) => (
                    <ReviewCardPost key={index} user={review.user} review={review.review} />
                ))}
            </div>
        </div>
    );
}

export default DetailPost;
