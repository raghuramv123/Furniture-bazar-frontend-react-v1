import React, { useEffect, useState } from 'react'
import {
  Container, Typography, Box, Button, Paper,
  Table, TableHead, TableRow, TableCell, TableBody,
  Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, FormControlLabel,
  Switch, CircularProgress, Select, MenuItem,
  FormControl, InputLabel, TableContainer
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import axiosInstance from '../api/axiosInstance'
import { formatPrice } from '../utils/formatPrice'
import toast from 'react-hot-toast'

const EMPTY = {
  name: '', description: '', price: '', salePrice: '',
  stockQuantity: '', sku: '', categoryId: '',
  material: '', dimensions: '', color: '', finish: '',
  thickness: '', woodGrade: '', active: true, featured: false
}

const AdminProducts = () => {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [catLoading, setCatLoading] = useState(true)
  const [open, setOpen]             = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [saving, setSaving]         = useState(false)

  // ── fetch products ────────────────────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const r = await axiosInstance.get('/api/products', {
        params: { page: 0, size: 50, sortBy: 'createdAt', sortDir: 'desc' }
      })
      const data = r.data
      setProducts(Array.isArray(data) ? data : data?.content || [])
    } catch (err) {
      toast.error('Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // ── fetch categories ──────────────────────────────────────────────
  const fetchCategories = async () => {
    setCatLoading(true)
    try {
      const r = await axiosInstance.get('/api/categories')
      const data = r.data
      const list = Array.isArray(data) ? data : data?.content || []
      console.log('Categories loaded:', list) // debug
      setCategories(list)
    } catch (err) {
      console.error('Category fetch error:', err)
      toast.error('Failed to load categories')
      setCategories([])
    } finally {
      setCatLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // ── open dialog ───────────────────────────────────────────────────
  const handleOpen = (product = null) => {
    setEditing(product)
    if (product) {
      setForm({
        name:          product.name          || '',
        description:   product.description   || '',
        price:         product.price         || '',
        salePrice:     product.salePrice     || '',
        stockQuantity: product.stockQuantity || '',
        sku:           product.sku           || '',
        categoryId:    product.category?.id  || '',
        material:      product.material      || '',
        dimensions:    product.dimensions    || '',
        color:         product.color         || '',
        finish:        product.finish        || '',
        thickness:     product.thickness     || '',
        woodGrade:     product.woodGrade     || '',
        active:        product.active  !== undefined ? product.active  : true,
        featured:      product.featured !== undefined ? product.featured : false,
      })
    } else {
      setForm(EMPTY)
    }
    setOpen(true)
  }

  // ── save product ──────────────────────────────────────────────────
  const handleSave = async () => {
    // basic validation
    if (!form.name.trim())        { toast.error('Product name is required'); return }
    if (!form.price)              { toast.error('Price is required'); return }
    if (!form.stockQuantity)      { toast.error('Stock quantity is required'); return }
    if (!form.sku.trim())         { toast.error('SKU is required'); return }
    if (!form.categoryId)         { toast.error('Please select a category'); return }

    setSaving(true)
    try {
      const payload = {
        name:          form.name.trim(),
        description:   form.description.trim(),
        price:         parseFloat(form.price),
        salePrice:     form.salePrice ? parseFloat(form.salePrice) : null,
        stockQuantity: parseInt(form.stockQuantity),
        sku:           form.sku.trim(),
        categoryId:    parseInt(form.categoryId),
        material:      form.material   || null,
        dimensions:    form.dimensions || null,
        color:         form.color      || null,
        finish:        form.finish     || null,
        thickness:     form.thickness  ? parseInt(form.thickness) : null,
        woodGrade:     form.woodGrade  || null,
        active:        form.active,
        featured:      form.featured,
      }

      console.log('Saving product payload:', payload) // debug

      if (editing) {
        await axiosInstance.put(`/api/products/${editing.id}`, payload)
        toast.success('Product updated successfully')
      } else {
        await axiosInstance.post('/api/products', payload)
        toast.success('Product created successfully')
      }
      setOpen(false)
      fetchProducts()
    } catch (err) {
      console.error('Product save error:', err.response?.data)
      const msg = err.response?.data?.message
        || err.response?.data?.error
        || JSON.stringify(err.response?.data)
        || 'Save failed'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  // ── delete product ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await axiosInstance.delete(`/api/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: val }))
  }

  return (
    <Container sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>Manage Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
          Add Product
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#e0a96d' }} />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No products yet.</Typography>
            <Button sx={{ mt: 2, color: '#e0a96d' }} onClick={() => handleOpen()}>
              Add your first product
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#f9f5f0' } }}>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(p => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{p.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.material}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {p.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>{p.category?.name || '—'}</TableCell>
                    <TableCell>
                      <Typography fontWeight={700} color="#e0a96d">
                        {formatPrice(p.salePrice || p.price)}
                      </Typography>
                      {p.salePrice && (
                        <Typography variant="caption"
                          sx={{ textDecoration: 'line-through', color: '#999' }}>
                          {formatPrice(p.price)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.stockQuantity}
                        size="small"
                        color={
                          p.stockQuantity <= 5 ? 'error'
                          : p.stockQuantity <= 20 ? 'warning'
                          : 'success'
                        } />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                        <Chip
                          label={p.active ? 'Active' : 'Inactive'}
                          color={p.active ? 'success' : 'default'}
                          size="small" />
                        {p.featured && (
                          <Chip label="Featured" color="warning" size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpen(p)}
                        sx={{ color: '#1a1a2e', mr: 0.5 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(p.id)}
                        color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ── Add / Edit Product Dialog ── */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #f0f0f0', pb: 2 }}>
          {editing ? `Edit — ${editing.name}` : 'Add New Product'}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2.5}>

            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700}
                sx={{ mb: 1.5, color: '#888', textTransform: 'uppercase', fontSize: 11 }}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField label="Product Name *" fullWidth
                value={form.name} onChange={set('name')} />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Description" fullWidth multiline rows={3}
                value={form.description} onChange={set('description')} />
            </Grid>

            <Grid item xs={4}>
              <TextField label="Price (₹) *" fullWidth type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={form.price} onChange={set('price')} />
            </Grid>

            <Grid item xs={4}>
              <TextField label="Sale Price (₹)" fullWidth type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={form.salePrice} onChange={set('salePrice')}
                helperText="Leave empty if no sale" />
            </Grid>

            <Grid item xs={4}>
              <TextField label="Stock Quantity *" fullWidth type="number"
                inputProps={{ min: 0 }}
                value={form.stockQuantity} onChange={set('stockQuantity')} />
            </Grid>

            <Grid item xs={6}>
              <TextField label="SKU *" fullWidth
                value={form.sku} onChange={set('sku')}
                helperText="Unique product code e.g. DOO-TEAK-001" />
            </Grid>

            {/* ── CATEGORY DROPDOWN ── */}
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel id="category-label">Category *</InputLabel>
                <Select
                  labelId="category-label"
                  value={form.categoryId}
                  label="Category *"
                  onChange={set('categoryId')}
                  displayEmpty>
                  {catLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} sx={{ mr: 1 }} /> Loading categories...
                    </MenuItem>
                  ) : categories.length === 0 ? (
                    <MenuItem disabled>
                      No categories found — add categories first
                    </MenuItem>
                  ) : (
                    categories.map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.parent ? `↳ ${c.name}` : `📁 ${c.name}`}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              {categories.length === 0 && !catLoading && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  Please add categories from Admin → Manage Categories first
                </Typography>
              )}
            </Grid>

            {/* Furniture Specs */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" fontWeight={700}
                sx={{ mb: 1.5, color: '#888', textTransform: 'uppercase', fontSize: 11 }}>
                Furniture Specifications
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <TextField label="Material" fullWidth
                value={form.material} onChange={set('material')}
                placeholder="e.g. Teak Wood, UPVC" />
            </Grid>

            <Grid item xs={4}>
              <TextField label="Dimensions" fullWidth
                value={form.dimensions} onChange={set('dimensions')}
                placeholder="e.g. 200x80x75 cm" />
            </Grid>

            <Grid item xs={4}>
              <TextField label="Color" fullWidth
                value={form.color} onChange={set('color')} />
            </Grid>

            <Grid item xs={4}>
              <TextField label="Finish" fullWidth
                value={form.finish} onChange={set('finish')}
                placeholder="e.g. Matte, Gloss, Natural" />
            </Grid>

            <Grid item xs={4}>
              <TextField label="Thickness (mm)" fullWidth type="number"
                value={form.thickness} onChange={set('thickness')} />
            </Grid>

            <Grid item xs={4}>
              <TextField label="Wood Grade" fullWidth
                value={form.woodGrade} onChange={set('woodGrade')}
                placeholder="e.g. BWP, MR, BR" />
            </Grid>

            {/* Toggles */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" fontWeight={700}
                sx={{ mb: 1.5, color: '#888', textTransform: 'uppercase', fontSize: 11 }}>
                Visibility
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.active}
                    onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1a1a2e' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#1a1a2e' } }} />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Active</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Visible to customers
                    </Typography>
                  </Box>
                } />
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.featured}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#e0a96d' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#e0a96d' } }} />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Featured</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Show on homepage
                    </Typography>
                  </Box>
                } />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ bgcolor: '#1a1a2e', px: 4,
                  '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
            {saving
              ? <CircularProgress size={20} sx={{ color: '#fff' }} />
              : editing ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminProducts