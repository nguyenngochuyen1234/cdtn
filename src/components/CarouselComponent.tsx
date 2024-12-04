import React from 'react';
import { Carousel } from 'antd';

const CarouselComponent: React.FC = () => {
    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 16,
    };

    return (
        <Carousel autoplay className="relative h-[100%]">
            <div>
                <img style={imageStyle} src="https://tl.cdnchinhphu.vn/Uploads/images/Ha%20Noi(19).jpg" />
            </div>
            <div>
                <img style={imageStyle} src="https://i.pinimg.com/originals/cb/88/9c/cb889c6fb0faa4aed170de4454340f31.jpg" />
            </div>
            <div>
                <img style={imageStyle} src="https://wallpapers.com/images/hd/hanoi-retains-its-traditional-traits-meba8ch7tnlz4k4i.jpg" />
            </div>
        </Carousel>
    );
};

export default CarouselComponent;
