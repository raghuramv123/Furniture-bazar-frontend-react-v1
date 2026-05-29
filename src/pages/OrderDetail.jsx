import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Container, Typography, Box, Paper, Grid,
  Chip, Divider, Button, CircularProgress, Stepper, Step, StepLabel
} from '@mui/material'
import { getOrderById, cancelOrder } from '../api/orderApi'
import { formatPrice } from '../utils/formatPrice'
import toast from 'react-hot-toast'

const STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

const STATUS_COLOR = {
  PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'info',
  SHIPPED: 'primary', DELIVERED: 'success', CANCELLED: 'error'
}

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrderById(id)
      .then(r => setOrder(r.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    try {
      await cancelOrder(id)
      toast.success('Order cancelled')
      const r = await getOrderById(id)
      setOrder(r.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order')
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress sx={{ color: '#e0a96d' }} />
    </Box>
  )

  if (!order) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h5">Order not found</Typography>
    </Container>
  )

  const activeStep = STEPS.indexOf(order.status)

  return (
    <Container sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Order #{order.orderNumber}</Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {new Date(order.orderedAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip label={order.status} color={STATUS_COLOR[order.status] || 'default'} />
          {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
            <Button variant="outlined" color="error" size="small" onClick={handleCancel}>
              Cancel Order
            </Button>
          )}
        </Box>
      </Box>

      {/* Progress Stepper */}
      {order.status !== 'CANCELLED' && (
        <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map(s => (
              <Step key={s}>
                <StepLabel sx={{
                  '& .MuiStepLabel-label': { fontSize: 12 },
                  '& .MuiStepIcon-root.Mui-active': { color: '#e0a96d' },
                  '& .MuiStepIcon-root.Mui-completed': { color: '#1a1a2e' }
                }}>{s}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      <Grid container spacing={4}>
        {/* Items */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Items Ordered</Typography>
            {order.orderItems?.map(item => (
              <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <Box component="img"
                  src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/70'}
                  sx={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight={600}>{item.product?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPrice(item.unitPrice)} each
                  </Typography>
                </Box>
                <Typography fontWeight={700}>{formatPrice(item.totalPrice)}</Typography>
              </Box>
            ))}
          </Paper>

          {/* Shipping Address */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Delivery Address</Typography>
            <Typography variant="body2" fontWeight={600}>{order.shippingAddress?.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📞 {order.shippingAddress?.phone}
            </Typography>
          </Paper>
        </Grid>

        {/* Price Summary */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Price Details</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2" fontWeight={600}>{formatPrice(order.subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">GST</Typography>
              <Typography variant="body2" fontWeight={600}>{formatPrice(order.taxAmount)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Shipping</Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">
                {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
              </Typography>
            </Box>
            {order.discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="success.main">Discount</Typography>
                <Typography variant="body2" fontWeight={600} color="success.main">
                  − {formatPrice(order.discountAmount)}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={800}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color="#e0a96d">
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>
          </Paper>

          {/* Payment Info */}
          {order.payment && (
            <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Payment Info</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Method</Typography>
                <Typography variant="body2" fontWeight={600}>{order.payment.method || 'Online'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Status</Typography>
                <Chip label={order.payment.status} size="small"
                  color={order.payment.status === 'SUCCESS' ? 'success' : 'warning'} />
              </Box>
            </Paper>
          )}

          <Button fullWidth component={Link} to="/orders" variant="outlined"
            sx={{ mt: 3, borderColor: '#1a1a2e', color: '#1a1a2e',
                  '&:hover': { borderColor: '#e0a96d', color: '#e0a96d' } }}>
            ← Back to Orders
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default OrderDetail