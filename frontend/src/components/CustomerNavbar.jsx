import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  QrCodeScanner as ScannerIcon,
  Restaurant as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const tableId = sessionStorage.getItem('tableId');
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/menu')}
        >
          Restaurant Ordering
          {tableId && <Typography variant="caption" sx={{ ml: 2 }}>Table #{tableId}</Typography>}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            title="Scan Table QR"
          >
            <ScannerIcon />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={() => navigate('/menu')}
            title="Menu"
          >
            <MenuIcon />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={() => navigate('/cart')}
            title="Cart"
          >
            <Badge badgeContent={totalItems} color="error">
              <CartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomerNavbar; 