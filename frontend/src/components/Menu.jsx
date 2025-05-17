import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { getMenuItems } from '../services/menuService';
import { toast } from 'react-toastify';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        console.log('Attempting to fetch menu items...');
        const items = await getMenuItems();
        console.log('Fetched menu items:', items);
        
        if (!items || items.length === 0) {
          console.warn('No menu items returned from API');
          setError('No menu items available');
        } else {
          setMenuItems(items);
          const uniqueCategories = ['all', ...new Set(items.map(item => item.category))];
          setCategories(uniqueCategories);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        console.error('Error details:', error.response || error.message || error);
        setError('Failed to load menu items. Please try again later.');
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
    console.error(`Image for item ${id} failed to load`);
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Fallback images by category
  const fallbackImages = {
    'Appetizers': 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Main Courses': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Desserts': 'https://images.pexels.com/photos/1098592/pexels-photo-1098592.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Beverages': 'https://images.pexels.com/photos/452737/pexels-photo-452737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  };
  
  const defaultImage = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Typography variant="body1">
          Please make sure the backend server is running and accessible.
        </Typography>
      </Box>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6">No menu items found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Our Menu
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              value={category}
            />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {filteredItems.map((item) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  src={imageErrors[item.id] 
                    ? (fallbackImages[item.category] || defaultImage) 
                    : item.imageUrl}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                  onError={() => handleImageError(item.id)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      ${item.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        addToCart(item);
                        toast.success(`Added ${item.name} to cart`);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Menu; 