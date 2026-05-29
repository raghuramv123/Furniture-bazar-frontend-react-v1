import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container, Grid, Box, Typography, Button, Chip,
  Divider, TextField, CircularProgress, Paper, Avatar
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { getProductBySlug } from '../api/productApi'
import { getReviews, getRating, addReview } from '../api/reviewApi'
import { toggleWishlist } from '../api/wishlistApi'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatPrice } from '../utils/formatPrice'
import StarRating from '../components/StarRating'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { slug } = useParams()
  const { addItem } = useCart()
  const { user } = useAuth()

  const [product, setProduct]     = useState(null)
  const [reviews, setReviews]     = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [quantity, setQuantity]   = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [loading, setLoading]     = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)

  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProductBySlug(slug)
      .then(r => { setProduct(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (product) {
      getReviews(product.id).then(r => setReviews(r.data)).catch(() => {})
      getRating(product.id).then(r => setAvgRating(r.data.averageRating || 0)).catch(() => {})
    }
  }, [product])

  const handleAddToCart = () => {
    addItem(product.id, quantity)
  }

  const handleWishlist = async () => {
    try {
      const { data } = await toggleWishlist(product.id)
      setWishlisted(data.added)
      toast.success(data.added ? 'Added to wishlist' : 'Removed from wishlist')
    } catch { toast.error('Please login first') }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to review'); return }
    setSubmitting(true)
    try {
      await addReview(product.id, reviewForm)
      toast.success('Review submitted!')
      const r = await getReviews(product.id)
      setReviews(r.data)
      setReviewForm({ rating: 5, title: '', body: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally { setSubmitting(false) }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress sx={{ color: '#e0a96d' }} />
    </Box>
  )

  if (!product) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h5">Product not found</Typography>
    </Container>
  )

  const images = product.images?.length
    ? product.images
    : [{ url: 'https://via.placeholder.com/500x400?text=No+Image' }]

  return (
    <Container sx={{ py: 6 }}>
      <Grid container spacing={6}>

        {/* Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ borderRadius: 3, overflow: 'hidden', mb: 2, bgcolor: '#f9f5f0' }}>
            <Box component="img"
              src={images[selectedImg]?.url}
              alt={product.name}
              sx={{ width: '100%', height: 420, objectFit: 'cover' }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {images.map((img, i) => (
              <Box key={i} component="img" src={img.url}
                onClick={() => setSelectedImg(i)}
                sx={{
                  width: 70, height: 70, objectFit: 'cover',
                  borderRadius: 2, cursor: 'pointer',
                  border: selectedImg === i ? '2px solid #e0a96d' : '2px solid transparent',
                  opacity: selectedImg === i ? 1 : 0.7,
                  '&:hover': { opacity: 1 }
                }} />
            ))}
          </Box>
        </Grid>

        {/* Info */}
        <Grid item xs={12} md={6}>
          <Chip label={product.category?.name} size="small"
            sx={{ mb: 2, bgcolor: '#f0e6d3', color: '#1a1a2e' }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{product.name}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <StarRating rating={avgRating} />
            <Typography variant="body2" color="text.secondary">
              ({reviews.length} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#e0a96d' }}>
              {formatPrice(product.salePrice || product.price)}
            </Typography>
            {product.salePrice && (
              <Typography variant="h6"
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                {formatPrice(product.price)}
              </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            {product.description}
          </Typography>

          {/* Specs */}
          <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#f9f5f0', mb: 3 }}>
            <Grid container spacing={1.5}>
              {product.material && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">MATERIAL</Typography>
                  <Typography variant="body2" fontWeight={600}>{product.material}</Typography>
                </Grid>
              )}
              {product.dimensions && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">DIMENSIONS</Typography>
                  <Typography variant="body2" fontWeight={600}>{product.dimensions}</Typography>
                </Grid>
              )}
              {product.color && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">COLOR</Typography>
                  <Typography variant="body2" fontWeight={600}>{product.color}</Typography>
                </Grid>
              )}
              {product.finish && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">FINISH</Typography>
                  <Typography variant="body2" fontWeight={600}>{product.finish}</Typography>
                </Grid>
              )}
              {product.thickness && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">THICKNESS</Typography>
                  <Typography variant="body2" fontWeight={600}>{product.thickness} mm</Typography>
                </Grid>
              )}
              {product.woodGrade && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">WOOD GRADE</Typography>
                  <Typography variant="body2" fontWeight={600}>{product.woodGrade}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Stock */}
          <Typography variant="body2" sx={{ mb: 2 }}>
            {product.stockQuantity > 0
              ? <Box component="span" sx={{ color: 'success.main', fontWeight: 700 }}>
                  ✓ In Stock ({product.stockQuantity} available)
                </Box>
              : <Box component="span" sx={{ color: 'error.main', fontWeight: 700 }}>
                  ✗ Out of Stock
                </Box>}
          </Typography>

          {/* Quantity + Actions */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 2 }}>
              <Button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                sx={{ minWidth: 40, color: '#1a1a2e' }}>−</Button>
              <Typography sx={{ px: 2, fontWeight: 700 }}>{quantity}</Typography>
              <Button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                sx={{ minWidth: 40, color: '#1a1a2e' }}>+</Button>
            </Box>
            <Button variant="contained" startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              sx={{ flex: 1, py: 1.5, bgcolor: '#1a1a2e', fontWeight: 700,
                    borderRadius: 2, '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
              Add to Cart
            </Button>
            <Button variant="outlined" onClick={handleWishlist}
              sx={{ py: 1.5, borderColor: '#1a1a2e', color: '#1a1a2e',
                    '&:hover': { borderColor: '#e0a96d', color: '#e0a96d' } }}>
              {wishlisted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Reviews */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
          Customer Reviews ({reviews.length})
        </Typography>
        <Grid container spacing={4}>

          {/* Review Form */}
          {user && (
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Write a Review</Typography>
                <Box component="form" onSubmit={handleReviewSubmit}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>Rating</Typography>
                    <StarRating
                      rating={reviewForm.rating} interactive
                      onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
                  </Box>
                  <TextField label="Title" fullWidth size="small"
                    value={reviewForm.title}
                    onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
                  <TextField label="Your Review" fullWidth multiline rows={4} size="small"
                    value={reviewForm.body}
                    onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} />
                  <Button type="submit" variant="contained" disabled={submitting}
                    sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
                    {submitting ? <CircularProgress size={20} /> : 'Submit Review'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Review List */}
          <Grid item xs={12} md={user ? 8 : 12}>
            {reviews.length === 0 ? (
              <Typography color="text.secondary">No reviews yet. Be the first!</Typography>
            ) : (
              reviews.map(r => (
                <Paper key={r.id} sx={{ p: 3, mb: 2, borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#1a1a2e', width: 36, height: 36, fontSize: 14 }}>
                      {r.user?.firstName?.[0]}{r.user?.lastName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {r.user?.firstName} {r.user?.lastName}
                      </Typography>
                      <StarRating rating={r.rating} size="small" />
                    </Box>
                    {r.verifiedPurchase && (
                      <Chip label="Verified Purchase" size="small" color="success"
                        sx={{ ml: 'auto', fontSize: 11 }} />
                    )}
                  </Box>
                  {r.title && <Typography variant="subtitle2" fontWeight={700}>{r.title}</Typography>}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{r.body}</Typography>
                </Paper>
              ))
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default ProductDetail