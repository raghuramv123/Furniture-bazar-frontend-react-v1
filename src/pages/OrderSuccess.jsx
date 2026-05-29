import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Box, Typography, Button, Paper, Divider, Chip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { getOrderById } from '../api/orderApi'
import { formatPrice } from '../utils/formatPrice'

const OrderSuccess = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    getOrderById(id).then(r => setOrder(r.data)).catch(() => {})
  }, [id])

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>Order Placed!</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Thank you for shopping with Furnitura.
      </Typography>

      {order && (
        <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'left', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Order Number</Typography>
            <Typography variant="body2" fontWeight={700}>#{order.orderNumber}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Chip label={order.status} color="success" size="small" />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={800}>Total Paid</Typography>
            <Typography variant="h6" fontWeight={800} color="#e0a96d">
              {formatPrice(order.totalAmount)}
            </Typography>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button component={Link} to="/orders" variant="contained"
          sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
          View My Orders
        </Button>
        <Button component={Link} to="/products" variant="outlined"
          sx={{ borderColor: '#1a1a2e', color: '#1a1a2e' }}>
          Continue Shopping
        </Button>
      </Box>
    </Container>
  )
}

export default OrderSuccess