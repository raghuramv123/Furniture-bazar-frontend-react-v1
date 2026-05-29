import React, { useEffect, useState } from 'react'
import { Container, Typography, Grid, Box, Button, CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import { getWishlist, toggleWishlist } from '../api/wishlistApi'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWishlist()
      .then(r => setItems(r.data))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (productId) => {
    await toggleWishlist(productId)
    setItems(prev => prev.filter(i => i.product.id !== productId))
    toast.success('Removed from wishlist')
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress sx={{ color: '#e0a96d' }} />
    </Box>
  )

  if (items.length === 0) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Your wishlist is empty</Typography>
      <Button component={Link} to="/products" variant="contained"
        sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
        Explore Products
      </Button>
    </Container>
  )

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        My Wishlist ({items.length})
      </Typography>
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <ProductCard product={item.product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Wishlist