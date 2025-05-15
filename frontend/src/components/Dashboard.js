import React from 'react';
import KitchenDisplay from './kitchen/KitchenDisplay';
import WaiterDashboard from './waiter/WaiterDashboard';

const ManagerDashboard = () => (
  <div>
    <KitchenDisplay />
    <WaiterDashboard />
  </div>
);

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return null;
  if (user.role === 'KITCHEN_STAFF') return <KitchenDisplay />;
  if (user.role === 'WAITER') return <WaiterDashboard />;
  if (user.role === 'MANAGER') return <ManagerDashboard />;
  return null;
};

export default Dashboard;
