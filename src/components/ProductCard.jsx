import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, IconButton, Chip, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../hooks/useCart';
import { toggleWishlist } from '../api/wishlistApi';
import { formatPrice } from '../utils/formatPrice';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const primaryImage = product.images?.find(i => i.primary)?.url
    || product.images?.[0]?.url
    || 'https://via.placeholder.com/300x250?text=No+Image';

  const handleWishlist = async () => {
    try {
      const { data } = await toggleWishlist(product.id);
      setWishlisted(data.added);
    } catch {}
  };

  return (
    <Card sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }
    }}>

      {/* Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="220"
          image={primaryImage}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <IconButton
          onClick={handleWishlist}
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', '&:hover': { bgcolor: 'white' } }}>
          {wishlisted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        {product.salePrice && (
          <Chip label="SALE" color="error" size="small"
            sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 700 }} />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
          {product.category?.name}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5, fontSize: '1rem', lineHeight: 1.3 }}>
          {product.name}
        </Typography>
        {product.material && (
          <Typography variant="body2" color="text.secondary">{product.material}</Typography>
        )}
        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#e0a96d' }}>
            {formatPrice(product.salePrice || product.price)}
          </Typography>
          {product.salePrice && (
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              {formatPrice(product.price)}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          fullWidth variant="outlined"
          component={Link} to={`/products/${product.slug}`}
          sx={{ borderColor: '#1a1a2e', color: '#1a1a2e' }}>
          View
        </Button>
        <Button
          fullWidth variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={() => addItem(product.id, 1)}
          sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
          Add
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;