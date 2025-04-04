import { Star } from 'lucide-react';

interface RatingProps {
    value: number;
    onValueChange?: (value: number) => void;
    readOnly?: boolean;
}

export function Rating({ value, onValueChange, readOnly = false }: RatingProps) {
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`p-0.5 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                    onClick={() => !readOnly && onValueChange?.(star)}
                    disabled={readOnly}
                >
                    <div
                        className={`w-4 h-4 flex items-center justify-center rounded-md ${
                            star <= value ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                    >
                        <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                </button>
            ))}
        </div>
    );
}
