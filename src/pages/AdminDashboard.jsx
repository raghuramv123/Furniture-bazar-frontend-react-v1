import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { formatPrice } from "../utils/formatPrice";

const StatCard = ({ label, value, color = "#1a1a2e" }) => (
  <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
    <Typography variant="h3" fontWeight={900} sx={{ color }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      {label}
    </Typography>
  </Paper>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/api/admin/dashboard"),
      axiosInstance.get("/api/admin/orders"),
    ])
      .then(([s, o]) => {
        setStats(s.data);
        setOrders(o.data.slice(0, 10));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#e0a96d" }} />
      </Box>
    );

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={6} md={3}>
          <StatCard label="Total Users" value={stats?.totalUsers || 0} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Total Products"
            value={stats?.totalProducts || 0}
            color="#e0a96d"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Orders This Month"
            value={stats?.ordersThisMonth || 0}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Revenue This Month"
            value={formatPrice(stats?.revenueThisMonth || 0)}
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      {/* Low Stock */}
      {stats?.lowStockProducts?.length > 0 && (
        <Paper
          sx={{ p: 3, borderRadius: 3, mb: 4, border: "1px solid #ffccbc" }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            color="error"
            sx={{ mb: 2 }}
          >
            ⚠ Low Stock Products
          </Typography>
          {stats.lowStockProducts.map((p) => (
            <Box
              key={p.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 1,
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {p.name}
              </Typography>
              <Chip
                label={`${p.stockQuantity} left`}
                color="error"
                size="small"
              />
            </Box>
          ))}
        </Paper>
      )}

      {/* Recent Orders */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            Recent Orders
          </Typography>
          {/* <Button
            component={Link}
            to="/admin/products"
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#1a1a2e",
              "&:hover": { bgcolor: "#e0a96d", color: "#1a1a2e" },
            }}
          >
            Manage Products
          </Button>
          
          <Button
            component={Link}
            to="/admin/categories"
            variant="outlined"
            size="small"
            sx={{ borderColor: "#1a1a2e", color: "#1a1a2e" }}
          >
            Manage Categories
          </Button> */}
          <Box sx={{ display: 'flex', gap: 2 }}>
  <Button component={Link} to="/admin/products"
    variant="contained" size="small"
    sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e0a96d', color: '#1a1a2e' } }}>
    Manage Products
  </Button>
  <Button component={Link} to="/admin/categories"
    variant="outlined" size="small"
    sx={{ borderColor: '#1a1a2e', color: '#1a1a2e',
          '&:hover': { borderColor: '#e0a96d', color: '#e0a96d' } }}>
    Manage Categories
  </Button>
</Box>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "#f9f5f0" } }}>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={700}>
                    {o.orderNumber}
                  </Typography>
                </TableCell>
                <TableCell>{o.user?.email}</TableCell>
                <TableCell fontWeight={700}>
                  {formatPrice(o.totalAmount)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={o.status}
                    size="small"
                    color={
                      o.status === "DELIVERED"
                        ? "success"
                        : o.status === "CANCELLED"
                          ? "error"
                          : "default"
                    }
                  />
                </TableCell>
                <TableCell>
                  {new Date(o.orderedAt).toLocaleDateString("en-IN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
