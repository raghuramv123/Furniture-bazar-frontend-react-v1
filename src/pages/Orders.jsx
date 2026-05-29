import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, Chip,
  Button, CircularProgress, Divider
} from '@mui/material';
import { getMyOrders } from '../api/orderApi';
import { formatPrice } from '../utils/formatPrice';

const STATUS_COLOR = {
  PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'info',
  SHIPPED: 'primary', DELIVERED: 'success', CANCELLED: 'error', REFUNDED: 'default'
};

const Orders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress sx={{ color: '#e0a96d' }} />
    </Box>
  );

  if (orders.length === 0) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>No orders yet</Typography>
      <Button component={Link} to="/products" variant="contained"
        sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
        Start Shopping
      </Button>
    </Container>
  );

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>My Orders</Typography>
      {orders.map(order => (
        <Paper key={order.id} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>#{order.orderNumber}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(order.orderedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Chip label={order.status} color={STATUS_COLOR[order.status] || 'default'} size="small" sx={{ mb: 1 }} />
              <Typography variant="h6" fontWeight={800} color="#e0a96d">
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {order.orderItems?.length || 0} item(s)
            </Typography>
            <Button component={Link} to={`/orders/${order.id}`} size="small"
              sx={{ color: '#1a1a2e', fontWeight: 700 }}>
              View Details →
            </Button>
          </Box>
        </Paper>
      ))}
    </Container>
  );
};

export default Orders;