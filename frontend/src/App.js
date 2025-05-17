import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import KitchenDashboard from './components/kitchen/KitchenDashboard';
import WaiterDashboard from './components/waiter/WaiterDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import Unauthorized from './components/auth/Unauthorized';
import MenuPage from './components/MenuPage';
import OrderStatusPage from './components/OrderStatusPage';

const App = () => {
    return (
        <AuthProvider>
            <OrderProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route path="/" element={<MenuPage />} />
                        <Route path="/status" element={<OrderStatusPage />} />
                        
                        {/* Kitchen Staff Routes */}
                        <Route 
                            path="/kitchen" 
                            element={
                                <ProtectedRoute requiredRole="KITCHEN_STAFF">
                                    <KitchenDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Waiter Routes */}
                        <Route 
                            path="/waiter" 
                            element={
                                <ProtectedRoute requiredRole="WAITER">
                                    <WaiterDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Manager Routes */}
                        <Route 
                            path="/manager" 
                            element={
                                <ProtectedRoute requiredRole="MANAGER">
                                    <ManagerDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Default redirect */}
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </OrderProvider>
        </AuthProvider>
    );
};

export default App;
