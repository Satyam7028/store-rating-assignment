import React, { useState } from 'react';

const Rating = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0);

  const handleClick = (newValue) => {
    onChange(newValue);
  };

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  return (
    <div style={styles.container}>
      {stars.map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            style={styles.star}
            onClick={() => handleClick(starValue)}
            onMouseOver={() => handleMouseOver(starValue)}
            onMouseLeave={handleMouseLeave}
          >
            { (hoverValue || value) >= starValue ? '★' : '☆' }
          </span>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    fontSize: '3rem',
    color: '#ffc107', 
    cursor: 'pointer',
  },
};

export default Rating;
