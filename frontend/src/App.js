import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Button } from '@chakra-ui/react';
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

function App() {
    return (
        <AuthProvider>
            <OrderProvider>
                <ChakraProvider>
                    <Router>
                        <Box>
                            <Flex 
                                as="nav" 
                                bg="teal.500" 
                                color="white" 
                                p={4} 
                                justify="center" 
                                gap={4}
                            >
                                <Link to="/kitchen">
                                    <Button colorScheme="teal" variant="outline">
                                        Kitchen Dashboard
                                    </Button>
                                </Link>
                                <Link to="/waiter">
                                    <Button colorScheme="teal" variant="outline">
                                        Waiter Dashboard
                                    </Button>
                                </Link>
                                <Link to="/manager">
                                    <Button colorScheme="teal" variant="outline">
                                        Manager Dashboard
                                    </Button>
                                </Link>
                                <Link to="/">
                                    <Button colorScheme="teal" variant="outline">
                                        Menu
                                    </Button>
                                </Link>
                            </Flex>

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
                        </Box>
                    </Router>
                </ChakraProvider>
            </OrderProvider>
        </AuthProvider>
    );
}

export default App;
