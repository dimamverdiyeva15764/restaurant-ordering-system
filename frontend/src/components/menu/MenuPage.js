import React, { useContext } from "react";
import { OrderContext } from "../context/OrderContext";
import "./MenuPage.css";

const sampleMenu = [
  { id: 1, name: "Burger", price: 8.99, category: "Main Course" },
  { id: 2, name: "Fries", price: 3.49, category: "Appetizers" },
  { id: 3, name: "Coke", price: 1.99, category: "Drinks" }
];

function MenuPage() {
  const { orderItems, addItem, updateQuantity, removeItem } = useContext(OrderContext);

  const total = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

  return (
    <div className="menu-container">
      <h1>Menu</h1>
      {sampleMenu.map(item => (
        <div key={item.id} className="menu-item">
          <span>{item.name} - ${item.price}</span>
          <button onClick={() => addItem(item)}>Add</button>
        </div>
      ))}

      <div className="order-summary">
        <h2>Your Order</h2>
        {orderItems.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name}</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              min="1"
            />
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
        <div>Total: ${total}</div>
      </div>
    </div>
  );
}

export default MenuPage;