import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Chip,
  CircularProgress,
} from "@mui/material";
import { getFeaturedProducts } from "../api/productApi";
import { getCategories } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";
import safeArray from "../utils/safeArray";

const HERO_CATEGORIES = ["Doors", "Windows", "Plywood", "Glass Walls", "Walls"];

const STATIC_CATEGORIES = [
  { id: "doors", name: "Doors" },
  { id: "windows", name: "Windows" },
  { id: "plywood", name: "Plywood" },
  { id: "glass-walls", name: "Glass Walls" },
  { id: "walls", name: "Walls" },
  { id: "flooring", name: "Flooring" },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingFeat, setLoadingFeat] = useState(true);

  useEffect(() => {
    // fetch featured products
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedProducts();
        setFeatured(safeArray(res.data));
      } catch {
        setFeatured([]);
      } finally {
        setLoadingFeat(false);
      }
    };

    // fetch categories
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(safeArray(res.data));
      } catch {
        setCategories([]);
      } finally {
        setLoadingCat(false);
      }
    };

    fetchFeatured();
    fetchCategories();
  }, []);

  // use API categories if loaded, otherwise fall back to static list
  const displayCategories =
    categories.length > 0 ? categories : STATIC_CATEGORIES;

  return (
    <Box>
      {/* ── Hero Section ── */}
      <Box
        sx={{
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
          px: { xs: 3, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "45%",
            height: "100%",
            background:
              "linear-gradient(to left, rgba(224,169,109,0.15), transparent)",
          }}
        />

        <Box sx={{ maxWidth: 640, zIndex: 1 }}>
          <Chip
            label="NEW COLLECTION 2024"
            sx={{
              bgcolor: "#e0a96d",
              color: "#1a1a2e",
              fontWeight: 700,
              mb: 3,
            }}
          />

          <Typography
            variant="h2"
            sx={{ color: "#fff", fontWeight: 900, lineHeight: 1.1, mb: 2 }}
          >
            Build Your Space
            <br />
            <Box component="span" sx={{ color: "#e0a96d" }}>
              With Confidence
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "#aaa", fontWeight: 400, mb: 4, lineHeight: 1.7 }}
          >
            Premium doors, windows, plywood, glass walls and every building
            material you need — all in one place.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#e0a96d",
                color: "#1a1a2e",
                fontWeight: 800,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                "&:hover": { bgcolor: "#c8923c" },
              }}
            >
              Shop Now
            </Button>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#fff",
                color: "#fff",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                "&:hover": { borderColor: "#e0a96d", color: "#e0a96d" },
              }}
            >
              Browse Categories
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, mt: 4, flexWrap: "wrap" }}>
            {HERO_CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={c}
                component={Link}
                to={`/products?keyword=${c}`}
                clickable
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "#ccc",
                  "&:hover": { bgcolor: "#e0a96d", color: "#1a1a2e" },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Categories Section ── */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, mb: 4, textAlign: "center" }}
        >
          Shop by Category
        </Typography>

        {loadingCat ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#e0a96d" }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {displayCategories.slice(0, 6).map((cat) => (
              <Grid item xs={6} sm={4} md={2} key={cat.id}>
                <Box
                  component={Link}
                  to={
                    typeof cat.id === "number"
                      ? `/products?categoryId=${cat.id}`
                      : `/products?keyword=${cat.name}`
                  }
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    textAlign: "center",
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "#f9f5f0",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#1a1a2e",
                      "& .cat-label": { color: "#e0a96d" },
                    },
                  }}
                >
                  <Typography
                    className="cat-label"
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "#1a1a2e",
                      transition: "color 0.2s",
                    }}
                  >
                    {cat.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* ── Featured Products Section ── */}
      <Box sx={{ bgcolor: "#f9f5f0", py: 8 }}>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Featured Products
            </Typography>
            <Button
              component={Link}
              to="/products"
              sx={{ color: "#e0a96d", fontWeight: 700 }}
            >
              View All →
            </Button>
          </Box>

          {loadingFeat ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress sx={{ color: "#e0a96d" }} />
            </Box>
          ) : featured.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                No featured products yet.
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                sx={{
                  bgcolor: "#1a1a2e",
                  "&:hover": { bgcolor: "#e0a96d", color: "#1a1a2e" },
                }}
              >
                Browse All Products
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {featured.slice(0, 8).map((p) => (
                <Grid item xs={12} sm={6} md={3} key={p.id}>
                  <ProductCard product={p} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* ── Why Choose Us ── */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, mb: 5, textAlign: "center" }}
        >
          Why Choose Furnitura
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              icon: "🚚",
              title: "Free Delivery",
              desc: "Free shipping on orders above ₹5,000",
            },
            {
              icon: "✅",
              title: "Quality Assured",
              desc: "All products are quality tested",
            },
            {
              icon: "↩️",
              title: "Easy Returns",
              desc: "7-day hassle-free return policy",
            },
            {
              icon: "🔒",
              title: "Secure Payment",
              desc: "Razorpay secured payment gateway",
            },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Typography sx={{ fontSize: 40, mb: 2 }}>
                  {item.icon}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
