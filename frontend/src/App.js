import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
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
import WelcomePage from './components/WelcomePage';
import TableSelection from './components/TableSelection';

function App() {
    return (
        <AuthProvider>
            <OrderProvider>
                <ChakraProvider>
                    <Router>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<WelcomePage />} />
                            <Route path="/tables" element={<TableSelection />} />
                            <Route path="/menu" element={<MenuPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />
                            <Route path="/status" element={<OrderStatusPage />} />
                            
                            {/* Protected Routes */}
                            <Route 
                                path="/kitchen" 
                                element={
                                    <ProtectedRoute requiredRole="KITCHEN_STAFF">
                                        <KitchenDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            
                            <Route 
                                path="/waiter" 
                                element={
                                    <ProtectedRoute requiredRole="WAITER">
                                        <WaiterDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            
                            <Route 
                                path="/manager" 
                                element={
                                    <ProtectedRoute requiredRole="MANAGER">
                                        <ManagerDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            
                            {/* Default redirect */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </Router>
                </ChakraProvider>
            </OrderProvider>
        </AuthProvider>
    );
}

export default App;
