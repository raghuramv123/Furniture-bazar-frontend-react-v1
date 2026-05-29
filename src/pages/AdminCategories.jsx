import React, { useEffect, useState } from 'react'
import {
  Container, Typography, Box, Button, Paper,
  Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Select, MenuItem, FormControl,
  InputLabel, IconButton, CircularProgress, Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import axiosInstance from '../api/axiosInstance'
import toast from 'react-hot-toast'

const EMPTY = { name: '', slug: '', parentId: '', displayOrder: 0, imageUrl: '' }

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [open, setOpen]             = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [saving, setSaving]         = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const r = await axiosInstance.get('/api/categories')
      const data = r.data
      setCategories(Array.isArray(data) ? data : data?.content || [])
    } catch {
      setCategories([])
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const generateSlug = (name) =>
    name.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  const handleOpen = (cat = null) => {
    setEditing(cat)
    setForm(cat ? {
      name:         cat.name         || '',
      slug:         cat.slug         || '',
      parentId:     cat.parent?.id   || '',
      displayOrder: cat.displayOrder || 0,
      imageUrl:     cat.imageUrl     || '',
    } : EMPTY)
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (!form.slug.trim()) { toast.error('Slug is required'); return }

    setSaving(true)
    try {
      const payload = {
        name:         form.name.trim(),
        slug:         form.slug.trim(),
        parentId:     form.parentId   || null,
        displayOrder: Number(form.displayOrder) || 0,
        imageUrl:     form.imageUrl.trim() || null,
      }

      if (editing) {
        await axiosInstance.put(`/api/categories/${editing.id}`, payload)
        toast.success('Category updated successfully')
      } else {
        await axiosInstance.post('/api/categories', payload)
        toast.success('Category created successfully')
      }
      setOpen(false)
      fetchCategories()
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.error
        || 'Save failed'
      toast.error(msg)
      console.error('Category save error:', err.response?.data)
    } finally {
      setSaving(false)
    }
  }

  const set = (field) => (e) => {
    const val = e.target.value
    setForm(f => ({
      ...f,
      [field]: val,
      ...(field === 'name' && !editing ? { slug: generateSlug(val) } : {})
    }))
  }

  const rootCategories  = categories.filter(c => !c.parent)
  const childCategories = categories.filter(c => c.parent)

  return (
    <Container sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>Manage Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}
          sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
          Add Category
        </Button>
      </Box>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
    <IconButton onClick={() => navigate('/admin')}
        sx={{ bgcolor: '#f9f5f0', '&:hover': { bgcolor: '#e0a96d' } }}>
        <ArrowBackIcon />
    </IconButton>
    <Typography variant="h4" fontWeight={800}>Manage Products</Typography>
</Box>
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#e0a96d' }} />
          </Box>
        ) : categories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No categories yet.</Typography>
            <Button sx={{ mt: 2, color: '#e0a96d' }} onClick={() => handleOpen()}>
              Add your first category
            </Button>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#f9f5f0' } }}>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rootCategories.map(cat => (
                <TableRow key={cat.id} hover sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 700 }}>📁 {cat.name}</TableCell>
                  <TableCell sx={{ color: '#888', fontFamily: 'monospace', fontSize: 12 }}>
                    {cat.slug}
                  </TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>
                    {cat.imageUrl
                      ? <Box component="img" src={cat.imageUrl} alt={cat.name}
                          sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} />
                      : <Typography variant="caption" color="text.secondary">No image</Typography>}
                  </TableCell>
                  <TableCell>{cat.displayOrder}</TableCell>
                  <TableCell>
                    <Chip label={cat.active !== false ? 'Active' : 'Inactive'}
                      color={cat.active !== false ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpen(cat)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {childCategories.map(cat => (
                <TableRow key={cat.id} hover>
                  <TableCell sx={{ pl: 5 }}>↳ {cat.name}</TableCell>
                  <TableCell sx={{ color: '#888', fontFamily: 'monospace', fontSize: 12 }}>
                    {cat.slug}
                  </TableCell>
                  <TableCell>{cat.parent?.name}</TableCell>
                  <TableCell>
                    {cat.imageUrl
                      ? <Box component="img" src={cat.imageUrl} alt={cat.name}
                          sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} />
                      : <Typography variant="caption" color="text.secondary">No image</Typography>}
                  </TableCell>
                  <TableCell>{cat.displayOrder}</TableCell>
                  <TableCell>
                    <Chip label={cat.active !== false ? 'Active' : 'Inactive'}
                      color={cat.active !== false ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpen(cat)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editing ? `Edit — ${editing.name}` : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>

            <Grid item xs={12}>
              <TextField label="Category Name *" fullWidth
                value={form.name} onChange={set('name')} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Slug *" fullWidth
                value={form.slug} onChange={set('slug')}
                helperText="Auto-generated from name. e.g. interior-doors" />
            </Grid>

            {/* ── IMAGE URL field added ── */}
            <Grid item xs={12}>
              <TextField
                label="Image URL (optional)" fullWidth
                value={form.imageUrl} onChange={set('imageUrl')}
                placeholder="https://example.com/image.jpg"
                helperText="Paste a direct image URL for this category" />
              {form.imageUrl && (
                <Box component="img" src={form.imageUrl} alt="preview"
                  sx={{ mt: 1.5, width: '100%', height: 120,
                        objectFit: 'cover', borderRadius: 2 }}
                  onError={e => { e.target.style.display = 'none' }} />
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Parent Category (optional)</InputLabel>
                <Select value={form.parentId}
                  label="Parent Category (optional)"
                  onChange={set('parentId')}>
                  <MenuItem value="">None — Root Category</MenuItem>
                  {rootCategories.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Display Order" fullWidth type="number"
                value={form.displayOrder} onChange={set('displayOrder')}
                helperText="Lower number appears first (0 = first)" />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
            {saving ? <CircularProgress size={20} /> : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminCategories