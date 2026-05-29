import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Grid } from '@mui/material';
import { registerUser } from '../api/authApi';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', bgcolor: '#f9f5f0', py: 4 }}>
      <Paper sx={{ p: 5, width: '100%', maxWidth: 500, borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: '#1a1a2e' }}>Create Account</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Join Furnitura today</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="First Name" fullWidth required value={form.firstName} onChange={set('firstName')} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Last Name" fullWidth required value={form.lastName} onChange={set('lastName')} />
            </Grid>
          </Grid>
          <TextField label="Email" type="email" fullWidth required value={form.email} onChange={set('email')} />
          <TextField label="Phone" fullWidth value={form.phone} onChange={set('phone')} />
          <TextField label="Password" type="password" fullWidth required value={form.password} onChange={set('password')} />
          <Button type="submit" variant="contained" size="large" disabled={loading}
            sx={{ bgcolor: '#1a1a2e', py: 1.5, fontWeight: 700, borderRadius: 2,
                  '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create Account'}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#e0a96d', fontWeight: 700 }}>Sign In</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;