'use client';

import { useState } from 'react';
import { Avatar, Button, Tooltip } from 'antd';
import { StarFilled, StarOutlined, BellOutlined } from '@ant-design/icons';
import { Typography } from '@mui/material';
import { LikeFilled, DislikeFilled, CheckCircleOutlined } from '@ant-design/icons';
interface ReviewCardPostProps {
    user: {
        name: string;
        location: string;
        profileImage?: string;
    };
    review: {
        rating: number;
        date: string;
        text: string;
        images: string[];
        metrics: {
            helpful: number;
            likes: number;
            dislikes: number;
        };
    };
    maxDisplayedImages?: number;
}

export default function ReviewCardPost({
    user,
    review,
    maxDisplayedImages = 3,
}: ReviewCardPostProps) {
    const [showAllImages, setShowAllImages] = useState(false);

    const displayedImages = showAllImages
        ? review.images
        : review.images.slice(0, maxDisplayedImages);
    const remainingImages = review.images.length - maxDisplayedImages;

    return (
        <div className="space-y-4">
            {/* Profile Section */}
            <div className="flex items-start gap-4">
                <Avatar
                    src={user.profileImage || '/placeholder.svg'}
                    size={48}
                    className="rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography variant="subtitle1" className="font-medium">
                                {user.name}
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                                {user.location}
                            </Typography>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex mt-1 items-center gap-5">
                        <div className="">
                            {[...Array(5)].map((_, index) =>
                                index < review.rating ? (
                                    <StarFilled key={index} className="text-yellow-400 text-lg" />
                                ) : (
                                    <StarOutlined key={index} className="text-gray-300 text-lg" />
                                )
                            )}
                        </div>
                        <Typography variant="body2" className="text-gray-500">
                            {review.date}
                        </Typography>
                    </div>
                </div>
            </div>
            {/* Review Text */}
            <Typography variant="body1" className="whitespace-pre-line">
                {review.text}
            </Typography>
            {/* Image Gallery */}
            <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                    {displayedImages.map((image, index) => (
                        <div
                            key={index}
                            className="flex-none w-[280px] h-[180px] relative rounded-lg overflow-hidden snap-start"
                        >
                            <img
                                src={image || '/placeholder.svg'}
                                alt={`Review image ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>

                {/* View More Button */}
                {remainingImages > 0 && !showAllImages && (
                    <Button
                        type="primary"
                        danger
                        className="absolute right-4 top-4"
                        onClick={() => setShowAllImages(true)}
                    >
                        Xem thêm ảnh
                    </Button>
                )}
            </div>
            <div className="flex gap-6 pt-2">
                <Tooltip title="Helpful">
                    <Button
                        type="text"
                        icon={<CheckCircleOutlined className="text-2xl text-green-500" />}
                        className="flex items-center"
                    >
                        <span className="ml-2">Helpful {review.metrics.helpful}</span>
                    </Button>
                </Tooltip>
                <Tooltip title="Like">
                    <Button
                        type="text"
                        icon={<LikeFilled className="text-2xl text-blue-500" />}
                        className="flex items-center"
                    >
                        <span className="ml-2">Like {review.metrics.likes}</span>
                    </Button>
                </Tooltip>
                <Tooltip title="Not Like">
                    <Button
                        type="text"
                        icon={<DislikeFilled className="text-2xl text-red-500" />}
                        className="flex items-center"
                    >
                        <span className="ml-2">Not Like {review.metrics.dislikes}</span>
                    </Button>
                </Tooltip>
            </div>{' '}
        </div>
    );
}
