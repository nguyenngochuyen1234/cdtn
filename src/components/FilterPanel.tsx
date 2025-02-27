'use client';

import { useState } from 'react';
import { Checkbox, Slider, Collapse, Button } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Typography } from '@mui/material';

const { Panel } = Collapse;

interface Category {
    id: string;
    name: string;
    checked: boolean;
}

interface OpeningHour {
    id: string;
    time: string;
    selected: boolean;
}

interface StarRating {
    id: number;
    value: number;
    checked: boolean;
}

export default function FilterPanel() {
    // Categories state
    const [categories, setCategories] = useState<Category[]>([
        { id: '1', name: 'Nhà hàng', checked: true },
        { id: '2', name: 'Cắt tóc', checked: false },
        { id: '3', name: 'Làm đẹp', checked: true },
        { id: '4', name: 'Quán nước', checked: false },
    ]);

    // Opening hours state
    const [openingHours, setOpeningHours] = useState<OpeningHour[]>([
        { id: '1', time: 'Đến 6 PM', selected: false },
        { id: '2', time: 'Đến 7 PM', selected: false },
        { id: '3', time: 'Đến 8 PM', selected: false },
        { id: '4', time: 'Đến 9 PM', selected: false },
    ]);

    // Distance state
    const [distance, setDistance] = useState<number>(7);

    // Star ratings state
    const [ratings, setRatings] = useState<StarRating[]>([
        { id: 5, value: 5, checked: true },
        { id: 4, value: 4, checked: true },
        { id: 3, value: 3, checked: false },
        { id: 2, value: 2, checked: true },
        { id: 1, value: 1, checked: false },
    ]);

    // Category change handler
    const handleCategoryChange = (id: string) => (e: CheckboxChangeEvent) => {
        setCategories(
            categories.map((category) =>
                category.id === id ? { ...category, checked: e.target.checked } : category
            )
        );
    };

    // Opening hours change handler
    const handleHourChange = (id: string) => {
        setOpeningHours(
            openingHours.map((hour) =>
                hour.id === id ? { ...hour, selected: !hour.selected } : hour
            )
        );
    };

    // Distance change handler
    const handleDistanceChange = (value: number) => {
        setDistance(value);
    };

    // Rating change handler
    const handleRatingChange = (id: number) => {
        setRatings(
            ratings.map((rating) =>
                rating.id === id ? { ...rating, checked: !rating.checked } : rating
            )
        );
    };

    // Reset all filters
    const handleReset = () => {
        setCategories(categories.map((category) => ({ ...category, checked: false })));
        setOpeningHours(openingHours.map((hour) => ({ ...hour, selected: false })));
        setDistance(0);
        setRatings(ratings.map((rating) => ({ ...rating, checked: false })));
    };

    return (
        <div className="w-full max-w-xs space-y-4 p-4">
            {/* Categories */}
            <Collapse
                defaultActiveKey={['1']}
                className="bg-white rounded-lg shadow-sm"
                expandIconPosition="end"
            >
                <Panel header="Danh mục" key="1">
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category.id}>
                                <Checkbox
                                    checked={category.checked}
                                    onChange={handleCategoryChange(category.id)}
                                >
                                    {category.name}
                                </Checkbox>
                            </div>
                        ))}
                        <Button type="link" className="text-emerald-500 p-0">
                            Xem thêm
                        </Button>
                    </div>
                </Panel>
            </Collapse>

            {/* Opening Hours */}
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                <Typography variant="subtitle2" className="font-medium">
                    Thời gian mở cửa
                </Typography>
                <div className="space-y-2">
                    {openingHours.map((hour) => (
                        <div
                            key={hour.id}
                            className={`p-2 rounded cursor-pointer transition-colors ${
                                hour.selected
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleHourChange(hour.id)}
                        >
                            {hour.time}
                        </div>
                    ))}
                    <Button type="link" className="text-emerald-500 p-0">
                        Xem thêm
                    </Button>
                </div>
            </div>

            {/* Distance Range */}
            <Collapse
                defaultActiveKey={['1']}
                className="bg-white rounded-lg shadow-sm"
                expandIconPosition="end"
            >
                <Panel header="Khoảng cách" key="1">
                    <div className="px-2">
                        <Slider
                            min={0}
                            max={10}
                            value={distance}
                            onChange={handleDistanceChange}
                            tooltip={{
                                formatter: (value) => `${value}km`,
                            }}
                            trackStyle={{ backgroundColor: '#10b981' }}
                            handleStyle={{ borderColor: '#10b981' }}
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>0km</span>
                            <span>Từ {distance}km</span>
                            <span>10km</span>
                        </div>
                    </div>
                </Panel>
            </Collapse>

            {/* Review Score */}
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                <Typography variant="subtitle2" className="font-medium">
                    REVIEW SCORE
                </Typography>
                <div className="space-y-2">
                    {ratings.map((rating) => (
                        <div
                            key={rating.id}
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => handleRatingChange(rating.id)}
                        >
                            <Checkbox checked={rating.checked} />
                            <div className="flex">
                                {[...Array(5)].map((_, index) =>
                                    index < rating.value ? (
                                        <StarFilled key={index} className="text-yellow-400" />
                                    ) : (
                                        <StarOutlined key={index} className="text-gray-300" />
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <Button onClick={handleReset} className="w-full border-gray-300 hover:border-gray-400">
                Reset filter
            </Button>
        </div>
    );
}
