mport React, { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);

  const addItem = (item) => {
    const existing = orderItems.find(i => i.id === item.id);
    if (existing) {
      setOrderItems(orderItems.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const removeItem = (itemId) => {
    setOrderItems(orderItems.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId, qty) => {
    setOrderItems(orderItems.map(i =>
      i.id === itemId ? { ...i, quantity: qty } : i
    ));
  };

  const clearOrder = () => setOrderItems([]);

  return (
    <OrderContext.Provider value={{
      orderItems,
      addItem,
      removeItem,
      updateQuantity,
      clearOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};
