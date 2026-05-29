import React, { useState } from 'react'
import {
  Container, Typography, Paper, Box, TextField,
  Button, Grid, Divider, CircularProgress
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import axiosInstance from '../api/axiosInstance'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const [form, setForm]       = useState({ firstName: '', lastName: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axiosInstance.put('/api/users/profile', form)
      toast.success('Profile updated')
    } catch { toast.error('Update failed') }
    finally { setLoading(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match'); return
    }
    try {
      await axiosInstance.put('/api/users/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      })
      toast.success('Password updated')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>My Profile</Typography>

      {/* Account Info */}
      <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Account Information</Typography>
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f9f5f0', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">Email</Typography>
          <Typography variant="body1" fontWeight={600}>{user?.email}</Typography>
        </Box>
        <Box component="form" onSubmit={handleProfileUpdate}>
          <Grid container spacing={2.5}>
            <Grid item xs={6}>
              <TextField label="First Name" fullWidth
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Last Name" fullWidth
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Phone" fullWidth
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 3, bgcolor: '#1a1a2e',
            '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Update Profile'}
          </Button>
        </Box>
      </Paper>

      {/* Change Password */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Change Password</Typography>
        <Box component="form" onSubmit={handlePasswordChange}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Current Password" type="password" fullWidth
            value={pwForm.currentPassword}
            onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} />
          <TextField label="New Password" type="password" fullWidth
            value={pwForm.newPassword}
            onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} />
          <TextField label="Confirm New Password" type="password" fullWidth
            value={pwForm.confirmPassword}
            onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))} />
          <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start',
            bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
            Update Password
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Profile