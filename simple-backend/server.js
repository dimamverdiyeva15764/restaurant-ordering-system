// Simple Express server that returns menu items and handles orders
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for React frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Parse JSON request body
app.use(express.json());

// Menu items data
const menuItems = [
  {
    id: 101,
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 4.99,
    category: 'Appetizers',
    imageUrl: 'https://www.allrecipes.com/thmb/GrV_mWqrxIh9ysH8PELYfGXeSFg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/4526061-24b9144c4f734b5c9433248c952ba5e6.jpg',
    available: true
  },
  {
    id: 102,
    name: 'Mozzarella Sticks',
    description: 'Breaded mozzarella with marinara sauce',
    price: 6.99,
    category: 'Appetizers',
    imageUrl: 'https://www.allrecipes.com/thmb/BeVxirh6GosXjLy6o-YrfHSuteM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/23596-fried-mozzarella-cheese-sticks-DDMFS-4x3-842a0e27e0b34acda76d0fb57006027e.jpg',
    available: true
  },
  {
    id: 201,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'Main Courses',
    imageUrl: 'https://www.allrecipes.com/thmb/tMhYAjIOyyHYgLJRkMYOPXN5cfs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Pizza-Margherita-2000-ff105840fdbe4d818177bfcb3e840053.jpg',
    available: true
  },
  {
    id: 202,
    name: 'Cheeseburger',
    description: 'Beef patty with cheese, lettuce, tomato, and special sauce',
    price: 10.99,
    category: 'Main Courses',
    imageUrl: 'https://www.allrecipes.com/thmb/ltJFUPcaMfk-HS7Xgqz7ux-mQC4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/49409-Juiciest-Hamburgers-Ever-2000-f96594f1c2384e629db92ce6e357e2eb.jpg',
    available: true
  },
  {
    id: 301,
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with ganache',
    price: 5.99,
    category: 'Desserts',
    imageUrl: 'https://www.allrecipes.com/thmb/beqM4NrWGNGbzM3U1D4OMi-m2D8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8379761-triple-layer-chocolate-cake-with-chocolate-frostin-DDMFS-4x3-2000-d4344a929db44c69886dd50ec3ecb552.jpg',
    available: true
  },
  {
    id: 302,
    name: 'Ice Cream',
    description: 'Three scoops of your choice of flavors',
    price: 4.99,
    category: 'Desserts',
    imageUrl: 'https://www.allrecipes.com/thmb/1bAsGASKyAEcUvbGQi6BvX_VCnk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/vanilla-ice-cream-3145-e697eca2e93842bab39fb5ac1fab8d7f.jpg',
    available: true
  },
  {
    id: 401,
    name: 'Soft Drink',
    description: 'Your choice of cola, lemon-lime, or root beer',
    price: 2.49,
    category: 'Beverages',
    imageUrl: 'https://images.immediate.co.uk/production/volatile/sites/30/2021/05/soft-drinks-74b7698.jpg?quality=90&resize=440,400',
    available: true
  },
  {
    id: 402,
    name: 'Coffee',
    description: 'Regular or decaf',
    price: 2.29,
    category: 'Beverages',
    imageUrl: 'https://www.allrecipes.com/thmb/Oag1_0cRg-_wmmHH0JygYFrwTLI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1225598339-2000-1c95377ac156498eb1e74a503a9dbbb2.jpg',
    available: true
  }
];

// In-memory orders storage
const orders = {};

// Order status options
const ORDER_STATUS = {
  RECEIVED: 'Received',
  PREPARING: 'Preparing',
  READY: 'Ready',
  DELIVERED: 'Delivered'
};

// Menu endpoint
app.get('/menu', (req, res) => {
  res.json(menuItems);
});

// Create new order
app.post('/api/orders', (req, res) => {
  const { tableId, items, notes } = req.body;
  
  if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }
  
  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Generate order ID
  const orderId = Date.now().toString();
  
  const newOrder = {
    id: orderId,
    tableId,
    items,
    notes,
    total,
    status: ORDER_STATUS.RECEIVED,
    createdAt: new Date().toISOString()
  };
  
  orders[orderId] = newOrder;
  
  res.status(201).json(newOrder);
});

// Get order status
app.get('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  
  if (!orders[orderId]) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(orders[orderId]);
});

// Get all orders for a table
app.get('/api/orders/table/:tableId', (req, res) => {
  const { tableId } = req.params;
  
  const tableOrders = Object.values(orders).filter(order => order.tableId === tableId);
  
  res.json(tableOrders);
});

// Update order status (could be used by staff)
app.put('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  if (!orders[orderId]) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (!Object.values(ORDER_STATUS).includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  orders[orderId].status = status;
  
  res.json(orders[orderId]);
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Menu endpoint: http://localhost:8080/menu');
  console.log('API endpoints: /api/orders');
});
