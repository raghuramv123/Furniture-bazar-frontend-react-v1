import React from 'react';
import { Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

const StarRating = ({ rating = 0, size = 'small', interactive = false, onChange }) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.3 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Box
          key={star}
          onClick={() => interactive && onChange && onChange(star)}
          sx={{ cursor: interactive ? 'pointer' : 'default', color: '#f5a623' }}>
          {rating >= star
            ? <StarIcon fontSize={size} />
            : rating >= star - 0.5
            ? <StarHalfIcon fontSize={size} />
            : <StarBorderIcon fontSize={size} />}
        </Box>
      ))}
    </Box>
  );
};

export default StarRating;