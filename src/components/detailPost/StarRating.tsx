import { colors } from '@/themes/colors';
import React, { useState } from 'react';

const labels: { [index: number]: string } = {
    1: 'Kém',
    2: 'Bình thường',
    3: 'Tạm ổn',
    4: 'Ổn',
    5: 'Tốt',
};

const StarRating: React.FC = () => {
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        style={{
                            cursor: 'pointer',
                            color: (hover || rating) >= star ? colors.starColor : '#ccc',
                            fontSize: '2rem',
                            transition: 'color 0.2s',
                            backgroundColor: "#f1f1f1",
                            padding: "12px 8px",
                            borderRadius: 8
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
            {rating !== null && (
                <div style={{ marginLeft: '10px', fontSize: '1rem' }}>
                    {labels[hover !== null ? hover : rating]}
                </div>
            )}
        </div>
    );
};

export default StarRating;
