import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const YellowStar = () => (
    <FontAwesomeIcon 
        icon={faStar} 
        className="text-yellow-400" 
        style={{ stroke: 'black', strokeWidth: '10px', fontSize: '24px' }}
    />
);

const GrayStar = () => (
    <FontAwesomeIcon 
        icon={faStar} 
        className="text-gray-400" 
        style={{ stroke: 'black', strokeWidth: '10px', fontSize: '24px' }}
    />
);

const FractionalStar = ({ fraction }) => (
    <div style={{ display: 'flex', position: 'relative', justifyContent: 'flex-start', overflow: 'hidden' }}>
        <GrayStar />
        <div style={{ position: 'absolute', top: 0, left: 0, width: `${fraction * 100}%`, overflow: 'hidden' }}>
            <YellowStar />
        </div>
    </div>
);

export default function RenderStars({ rating }) {
    const fullStars = Math.floor(rating);
    const fraction = rating - fullStars;
    const emptyStars = Math.round(5 - fullStars - (fraction > 0 ? 1 : 0));

    return (
        <>
            {[...Array(fullStars)].map((_, index) => <YellowStar key={`star-${index}`} />)}
            {fraction > 0 && <FractionalStar fraction={fraction} />}
            {[...Array(emptyStars)].map((_, index) => <GrayStar key={`star-${fullStars + index + (fraction > 0 ? 1 : 0)}`} />)}
        </>
    );
};