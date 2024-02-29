import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Star = ({ key, color }) => (
    <FontAwesomeIcon 
        key={key} 
        icon={faStar} 
        className={`text-${color}-400`} 
        style={{ stroke: 'black', strokeWidth: '10px', fontSize: '24px' }}
    />
);

const FractionalStar = ({ fraction }) => (
    <div style={{ position: 'relative' }}>
        <Star color="gray" />
        <div style={{ position: 'absolute', top: 0, left: 0, width: `${fraction * 100}%`, overflow: 'hidden' }}>
            <Star color="yellow" />
        </div>
    </div>
);

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const fraction = rating - fullStars;
    const emptyStars = 5 - Math.ceil(rating);

    return (
        <>
            {[...Array(fullStars)].map((_, index) => <Star key={`star-${index}`} color="yellow" />)}
            {fraction > 0 && <FractionalStar fraction={fraction} />}
            {[...Array(emptyStars)].map((_, index) => <Star key={`star-${fullStars + index + (fraction > 0 ? 1 : 0)}`} color="gray" />)}
        </>
    );
};

export default renderStars;