import { Star } from 'lucide-react';

interface RatingProps {
    value: number;
    onValueChange?: (value: number) => void;
    readOnly?: boolean;
}

export function Rating({ value, onValueChange, readOnly = false }: RatingProps) {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`p-0.5 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                    onClick={() => !readOnly && onValueChange?.(star)}
                    disabled={readOnly}
                >
                    <Star
                        className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'}`}
                    />
                </button>
            ))}
        </div>
    );
}
