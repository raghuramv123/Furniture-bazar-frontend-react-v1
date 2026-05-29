import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1a1a2e", boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "#e0a96d",
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          FURNITURA
        </Typography>

        {/* Nav Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} to="/products" sx={{ color: "#fff" }}>
            Shop
          </Button>
          {/* ── FIXED: /categories → /products (no separate categories route) ── */}
          <Button component={Link} to="/products" sx={{ color: "#fff" }}>
            Categories
          </Button>
          {isAdmin() && (
            <Button component={Link} to="/admin" sx={{ color: "#e0a96d" }}>
              Admin
            </Button>
          )}
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user && (
            <>
              <IconButton
                component={Link}
                to="/wishlist"
                sx={{ color: "#fff" }}
              >
                <FavoriteIcon />
              </IconButton>
              <IconButton component={Link} to="/cart" sx={{ color: "#fff" }}>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </>
          )}

          {user ? (
            <>
              <IconButton
                onClick={(e) => setAnchor(e.currentTarget)}
                sx={{ color: "#fff" }}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={() => setAnchor(null)}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/orders"
                  onClick={() => setAnchor(null)}
                >
                  My Orders
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchor(null);
                    handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ color: "#fff" }}>
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{ bgcolor: "#e0a96d", color: "#1a1a2e", fontWeight: 700 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
