import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';

const Footer = () => (
  <Box sx={{ bgcolor: '#1a1a2e', color: '#ccc', mt: 8, py: 6, px: 4 }}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Typography variant="h5" sx={{ color: '#e0a96d', fontWeight: 800, mb: 2 }}>FURNITURA</Typography>
        <Typography variant="body2">Premium furniture and building materials for every space.</Typography>
      </Grid>
      <Grid item xs={6} md={2}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Shop</Typography>
        {['Doors', 'Windows', 'Walls', 'Plywood', 'Glass'].map(c => (
          <Typography key={c} variant="body2" sx={{ mb: 1 }}>
            <Link href={`/products?keyword=${c}`} sx={{ color: '#ccc', textDecoration: 'none', '&:hover': { color: '#e0a96d' } }}>{c}</Link>
          </Typography>
        ))}
      </Grid>
      <Grid item xs={6} md={2}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Account</Typography>
        {['My Orders', 'Wishlist', 'Profile', 'Addresses'].map(l => (
          <Typography key={l} variant="body2" sx={{ mb: 1 }}>
            <Link href="#" sx={{ color: '#ccc', textDecoration: 'none', '&:hover': { color: '#e0a96d' } }}>{l}</Link>
          </Typography>
        ))}
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Contact</Typography>
        <Typography variant="body2">📧 support@furnitura.in</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>📞 +91 98765 43210</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>📍 Mumbai, India</Typography>
      </Grid>
    </Grid>
    <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: '#666' }}>
      © 2024 Furnitura. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;