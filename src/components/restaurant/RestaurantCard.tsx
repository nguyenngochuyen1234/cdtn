import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Shop } from '@/models';

interface RestaurantCardProps {
    restaurant: Shop;
    index: number;
}

export function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="flex items-center gap-6 p-4">
                <div className="relative min-w-[240px] h-[180px]">
                    <img
                        src={restaurant.avatar || '/placeholder.svg'}
                        alt={restaurant.name}
                        className="absolute inset-0 object-cover w-full h-full rounded-md"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold mb-2">
                        {index}. {restaurant.name}
                    </h2>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                        i < (restaurant?.point || 0)
                                            ? 'fill-red-500 text-red-500'
                                            : 'fill-gray-200 text-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-gray-600">{restaurant.reviewCount}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {restaurant.categories.map((category) => (
                            <Badge
                                key={category}
                                variant="secondary"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                        <span>{restaurant.price}</span>
                        <span>•</span>
                        <span>{restaurant.location}</span>
                    </div>
                </div>

                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </Card>
    );
}
