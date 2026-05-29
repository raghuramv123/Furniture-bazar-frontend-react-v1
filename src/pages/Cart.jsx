import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Divider,
  IconButton, Paper, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';

const Cart = () => {
  const { cartItems, updateItem, removeItem } = useCart();

  const subtotal = cartItems.reduce((sum, i) => {
    const price = i.product.salePrice || i.product.price;
    return sum + price * i.quantity;
  }, 0);

  if (cartItems.length === 0) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Your cart is empty</Typography>
      <Button component={Link} to="/products" variant="contained"
        sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
        Continue Shopping
      </Button>
    </Container>
  );

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Shopping Cart</Typography>
      <Grid container spacing={4}>
        {/* Items */}
        <Grid item xs={12} md={8}>
          {cartItems.map(item => {
            const price = item.product.salePrice || item.product.price;
            return (
              <Paper key={item.id} sx={{ p: 3, mb: 2, borderRadius: 3, display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box component="img"
                  src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                  sx={{ width: 100, height: 90, objectFit: 'cover', borderRadius: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{item.product.material}</Typography>
                  <Typography variant="h6" sx={{ color: '#e0a96d', fontWeight: 700, mt: 0.5 }}>
                    {formatPrice(price)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small" onClick={() => updateItem(item.product.id, item.quantity - 1)}
                    sx={{ border: '1px solid #ddd' }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>
                    {item.quantity}
                  </Typography>
                  <IconButton size="small" onClick={() => updateItem(item.product.id, item.quantity + 1)}
                    sx={{ border: '1px solid #ddd' }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography sx={{ minWidth: 90, textAlign: 'right', fontWeight: 700 }}>
                  {formatPrice(price * item.quantity)}
                </Typography>
                <IconButton onClick={() => removeItem(item.product.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Paper>
            );
          })}
        </Grid>

        {/* Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography fontWeight={600}>{formatPrice(subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>GST (18%)</Typography>
              <Typography fontWeight={600}>{formatPrice(subtotal * 0.18)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography fontWeight={600} color="success.main">
                {subtotal >= 5000 ? 'FREE' : formatPrice(299)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color="#e0a96d">
                {formatPrice(subtotal + subtotal * 0.18 + (subtotal >= 5000 ? 0 : 299))}
              </Typography>
            </Box>
            <Button fullWidth variant="contained" component={Link} to="/checkout" size="large"
              sx={{ bgcolor: '#1a1a2e', py: 1.5, fontWeight: 700, borderRadius: 2,
                    '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;