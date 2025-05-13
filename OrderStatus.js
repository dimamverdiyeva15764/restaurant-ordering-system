import React, { useEffect, useState } from 'react';
import { getOrderStatus } from '../api';

function OrderStatus({ orderId }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (orderId) {
      const interval = setInterval(() => {
        getOrderStatus(orderId).then(data => {
          setStatus(data.status);
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  if (!orderId) return <p>No order submitted yet.</p>;

  return (
    <div>
      <h2>Order Status</h2>
      <p>Current status: {status}</p>
    </div>
  );
}

export default OrderStatus;
