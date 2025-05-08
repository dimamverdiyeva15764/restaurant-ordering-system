import React, { useState } from 'react';
import Menu from './components/Menu';
import Cart from './components/Cart';
import OrderSummary from './components/OrderSummary';
import menuItems from './data/menuItems';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div>
      <h1>Restaurant Ordering App</h1>
      <Menu items={menuItems} addToCart={addToCart} />
      <Cart cart={cart} />
      <OrderSummary cart={cart} />
    </div>
  );
}

export default App;
