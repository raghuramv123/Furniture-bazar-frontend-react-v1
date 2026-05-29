import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Grid, Box, Typography, Button, Paper,
  Radio, RadioGroup, FormControlLabel, TextField,
  Divider, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { getAddresses, addAddress } from '../api/addressApi'
import { placeOrder } from '../api/orderApi'
import { createRazorpayOrder, verifyPayment } from '../api/paymentApi'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/formatPrice'
import toast from 'react-hot-toast'

const EMPTY_ADDR = {
  fullName: '', phone: '', addressLine1: '', addressLine2: '',
  city: '', state: '', pincode: '', label: 'Home', country: 'India'
}

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, emptyCart } = useCart()

  const [addresses, setAddresses]         = useState([])
  const [selectedAddr, setSelectedAddr]   = useState('')
  const [couponCode, setCouponCode]       = useState('')
  const [loading, setLoading]             = useState(false)
  const [addAddrOpen, setAddAddrOpen]     = useState(false)
  const [newAddr, setNewAddr]             = useState(EMPTY_ADDR)
  const [savingAddr, setSavingAddr]       = useState(false)

  useEffect(() => {
    getAddresses().then(r => {
      setAddresses(r.data)
      const def = r.data.find(a => a.primaryAddress)
      if (def) setSelectedAddr(String(def.id))
      else if (r.data.length > 0) setSelectedAddr(String(r.data[0].id))
    }).catch(() => {})
  }, [])

  const subtotal = cartItems.reduce((sum, i) => {
    return sum + (i.product.salePrice || i.product.price) * i.quantity
  }, 0)
  const tax      = subtotal * 0.18
  const shipping = subtotal >= 5000 ? 0 : 299
  const total    = subtotal + tax + shipping

  const handleSaveAddress = async () => {
    setSavingAddr(true)
    try {
      const { data } = await addAddress(newAddr)
      setAddresses(prev => [...prev, data])
      setSelectedAddr(String(data.id))
      setAddAddrOpen(false)
      setNewAddr(EMPTY_ADDR)
      toast.success('Address saved')
    } catch { toast.error('Failed to save address') }
    finally { setSavingAddr(false) }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddr) { toast.error('Please select a delivery address'); return }
    setLoading(true)
    try {
      // 1 — place order in backend
      const { data: order } = await placeOrder({
        addressId: Number(selectedAddr),
        couponCode: couponCode || null,
      })

      // 2 — create Razorpay order
      const { data: rzpData } = await createRazorpayOrder(order.id)

      // 3 — open Razorpay modal
      const options = {
        key:      import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:   rzpData.amount,
        currency: rzpData.currency,
        order_id: rzpData.razorpayOrderId,
        name:     'Furnitura',
        description: `Order #${order.orderNumber}`,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            await emptyCart()
            toast.success('Payment successful!')
            navigate(`/order-success/${order.id}`)
          } catch { toast.error('Payment verification failed') }
        },
        prefill: { name: newAddr.fullName, contact: newAddr.phone },
        theme: { color: '#1a1a2e' },
        modal: {
          ondismiss: () => { setLoading(false); toast.error('Payment cancelled') }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
      setLoading(false)
    }
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Checkout</Typography>
      <Grid container spacing={4}>

        {/* Left — Address + Coupon */}
        <Grid item xs={12} md={7}>

          {/* Delivery Address */}
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>Delivery Address</Typography>
              <Button startIcon={<AddIcon />} size="small"
                onClick={() => setAddAddrOpen(true)}
                sx={{ color: '#e0a96d', fontWeight: 700 }}>
                Add New
              </Button>
            </Box>

            {addresses.length === 0 ? (
              <Typography color="text.secondary">No addresses saved. Add one above.</Typography>
            ) : (
              <RadioGroup value={selectedAddr} onChange={e => setSelectedAddr(e.target.value)}>
                {addresses.map(addr => (
                  <Paper key={addr.id} variant="outlined"
                    sx={{ p: 2, mb: 1.5, borderRadius: 2,
                          borderColor: selectedAddr === String(addr.id) ? '#e0a96d' : '#e0e0e0' }}>
                    <FormControlLabel
                      value={String(addr.id)}
                      control={<Radio sx={{ color: '#e0a96d', '&.Mui-checked': { color: '#e0a96d' } }} />}
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            {addr.fullName} — {addr.label}
                            {addr.primaryAddress && (
                              <Box component="span"
                                sx={{ ml: 1, fontSize: 11, bgcolor: '#e0a96d',
                                      color: '#1a1a2e', px: 1, borderRadius: 1, fontWeight: 700 }}>
                                DEFAULT
                              </Box>
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''},
                            {' '}{addr.city}, {addr.state} — {addr.pincode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">📞 {addr.phone}</Typography>
                        </Box>
                      } />
                  </Paper>
                ))}
              </RadioGroup>
            )}
          </Paper>

          {/* Coupon */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Coupon Code</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Enter coupon code"
                size="small" fullWidth
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())} />
              <Button variant="outlined"
                sx={{ borderColor: '#1a1a2e', color: '#1a1a2e', fontWeight: 700, minWidth: 90 }}>
                Apply
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right — Order Summary */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Order Summary</Typography>

            {/* Items */}
            {cartItems.map(item => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box component="img"
                    src={item.product.images?.[0]?.url || 'https://via.placeholder.com/48'}
                    sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ maxWidth: 160 }} noWrap>
                      {item.product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" fontWeight={700}>
                  {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2" fontWeight={600}>{formatPrice(subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">GST (18%)</Typography>
              <Typography variant="body2" fontWeight={600}>{formatPrice(tax)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Shipping</Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color="#e0a96d">
                {formatPrice(total)}
              </Typography>
            </Box>

            <Button fullWidth variant="contained" size="large"
              onClick={handlePlaceOrder} disabled={loading}
              sx={{ bgcolor: '#1a1a2e', py: 1.8, fontWeight: 700, borderRadius: 2,
                    '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
              {loading
                ? <CircularProgress size={22} sx={{ color: '#fff' }} />
                : `Pay ${formatPrice(total)}`}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Address Dialog */}
      <Dialog open={addAddrOpen} onClose={() => setAddAddrOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[
              { label: 'Full Name',     field: 'fullName',     xs: 6 },
              { label: 'Phone',         field: 'phone',        xs: 6 },
              { label: 'Address Line 1',field: 'addressLine1', xs: 12 },
              { label: 'Address Line 2',field: 'addressLine2', xs: 12 },
              { label: 'City',          field: 'city',         xs: 4 },
              { label: 'State',         field: 'state',        xs: 4 },
              { label: 'Pincode',       field: 'pincode',      xs: 4 },
              { label: 'Label (Home/Office)', field: 'label', xs: 6 },
            ].map(({ label, field, xs }) => (
              <Grid item xs={xs} key={field}>
                <TextField label={label} fullWidth size="small"
                  value={newAddr[field]}
                  onChange={e => setNewAddr(a => ({ ...a, [field]: e.target.value }))} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setAddAddrOpen(false)} sx={{ color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAddress} disabled={savingAddr}
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
            {savingAddr ? <CircularProgress size={18} /> : 'Save Address'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Checkout