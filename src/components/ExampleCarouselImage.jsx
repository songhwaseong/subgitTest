import React from 'react';

const ExampleCarouselImage = ({ text }) => {
    return (
        <div
            style={{
                backgroundColor: '#777',
                color: '#fff',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2rem',
            }}
        >
            {text}
        </div>
    );
};

export default ExampleCarouselImage;