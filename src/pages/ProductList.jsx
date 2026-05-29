import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box, Container, Grid, Typography, TextField,
  Select, MenuItem, FormControl, InputLabel,
  Slider, Pagination, CircularProgress
} from '@mui/material'
import { getProducts } from '../api/productApi'
import { getCategories } from '../api/categoryApi'
import ProductCard from '../components/ProductCard'
import safeArray from '../utils/safeArray'

const ProductList = () => {
  const [searchParams] = useSearchParams()

  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [totalPages, setTotalPages] = useState(0)

  const [filters, setFilters] = useState({
    keyword:    searchParams.get('keyword')    || '',
    categoryId: searchParams.get('categoryId') || '',
    material:   '',
    minPrice:   0,
    maxPrice:   100000,
    page:       0,
    size:       12,
    sortBy:     'createdAt',
    sortDir:    'desc',
  })

  // fetch categories once on mount
  useEffect(() => {
    getCategories()
      .then(r => setCategories(safeArray(r.data)))
      .catch(() => setCategories([]))
  }, [])

  // fetch products whenever filters change
  useEffect(() => {
    setLoading(true)

    const params = {}
    if (filters.keyword)    params.keyword    = filters.keyword
    if (filters.categoryId) params.categoryId = filters.categoryId
    if (filters.material)   params.material   = filters.material
    if (filters.minPrice)   params.minPrice   = filters.minPrice
    if (filters.maxPrice < 100000) params.maxPrice = filters.maxPrice
    params.page    = filters.page
    params.size    = filters.size
    params.sortBy  = filters.sortBy
    params.sortDir = filters.sortDir

    getProducts(params)
      .then(r => {
        setProducts(safeArray(r.data))
        setTotalPages(r.data?.totalPages || 0)
      })
      .catch(() => {
        setProducts([])
        setTotalPages(0)
      })
      .finally(() => setLoading(false))
  }, [filters])

  const set = (field) => (e) =>
    setFilters(f => ({ ...f, [field]: e.target.value, page: 0 }))

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>All Products</Typography>
      <Grid container spacing={4}>

        {/* ── Filters Sidebar ── */}
        <Grid item xs={12} md={3}>
          <Box sx={{
            p: 3, bgcolor: '#f9f5f0', borderRadius: 3,
            position: 'sticky', top: 80
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Filters</Typography>

            {/* Search */}
            <TextField
              label="Search" fullWidth size="small" sx={{ mb: 2.5 }}
              value={filters.keyword}
              onChange={e => setFilters(f => ({ ...f, keyword: e.target.value, page: 0 }))} />

            {/* Category */}
            <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
              <InputLabel>Category</InputLabel>
              <Select value={filters.categoryId} label="Category" onChange={set('categoryId')}>
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Material */}
            <TextField
              label="Material" fullWidth size="small" sx={{ mb: 2.5 }}
              value={filters.material} onChange={set('material')} />

            {/* Price Range */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Price Range
            </Typography>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              min={0} max={100000} step={1000}
              onChange={(_, v) =>
                setFilters(f => ({ ...f, minPrice: v[0], maxPrice: v[1], page: 0 }))}
              valueLabelDisplay="auto"
              valueLabelFormat={v => `₹${v.toLocaleString()}`}
              sx={{ color: '#e0a96d', mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">₹{filters.minPrice.toLocaleString()}</Typography>
              <Typography variant="caption">₹{filters.maxPrice.toLocaleString()}</Typography>
            </Box>

            {/* Sort */}
            <FormControl fullWidth size="small" sx={{ mt: 2.5 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={filters.sortBy} label="Sort By" onChange={set('sortBy')}>
                <MenuItem value="createdAt">Newest</MenuItem>
                <MenuItem value="price">Price: Low to High</MenuItem>
                <MenuItem value="name">Name A–Z</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel>Order</InputLabel>
              <Select value={filters.sortDir} label="Order" onChange={set('sortDir')}>
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* ── Products Grid ── */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#e0a96d' }} />
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No products found.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try changing your filters.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {products.length} products
              </Typography>
              <Grid container spacing={3}>
                {products.map(p => (
                  <Grid item xs={12} sm={6} lg={4} key={p.id}>
                    <ProductCard product={p} />
                  </Grid>
                ))}
              </Grid>
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <Pagination
                    count={totalPages}
                    page={filters.page + 1}
                    onChange={(_, v) =>
                      setFilters(f => ({ ...f, page: v - 1 }))}
                    sx={{
                      '& .MuiPaginationItem-root.Mui-selected': {
                        bgcolor: '#1a1a2e', color: '#fff'
                      }
                    }} />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProductList