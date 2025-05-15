import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import KitchenDashboard from './components/kitchen/KitchenDashboard';
import WaiterDashboard from './components/waiter/WaiterDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import Unauthorized from './components/auth/Unauthorized';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    
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
                            <ProtectedRoute requiredRole="waiter">
                                <WaiterDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Manager Routes */}
                    <Route 
                        path="/manager" 
                        element={
                            <ProtectedRoute requiredRole="manager">
                                <ManagerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
