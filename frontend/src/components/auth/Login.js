import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, useColorModeValue, Icon } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext.js';
import { FaUtensils } from 'react-icons/fa';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });
            const role = response.data.role?.trim().toUpperCase();
            login(response.data);
            if (role === 'KITCHEN_STAFF') navigate('/kitchen');
            else if (role === 'WAITER') navigate('/waiter');
            else if (role === 'MANAGER') navigate('/manager');
            else navigate('/unauthorized');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const cardBg = useColorModeValue('white', 'gray.800');
    const errorBg = useColorModeValue('red.50', 'red.900');
    const errorColor = useColorModeValue('red.600', 'red.300');

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bgGradient="linear(to-br, teal.100, blue.200, purple.100)">
            <Box maxW="md" w="full" p={8} bg={cardBg} borderRadius="2xl" boxShadow="2xl" textAlign="center">
                <Icon as={FaUtensils} w={12} h={12} color="teal.400" mb={2} />
                <Heading mb={2} color="teal.600" fontWeight="extrabold" fontSize="2xl">Restaurant Staff Login</Heading>
                <Text mb={6} color="gray.500">Sign in to access your dashboard</Text>
                {error && (
                    <Box bg={errorBg} color={errorColor} borderRadius="md" p={2} mb={4} fontWeight="bold">
                        {error}
                    </Box>
                )}
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input value={username} onChange={(e) => setUsername(e.target.value)} focusBorderColor="teal.400" size="lg" />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} focusBorderColor="teal.400" size="lg" />
                        </FormControl>
                        <Button type="submit" colorScheme="teal" size="lg" fontWeight="bold" w="full" _hover={{ bg: 'teal.500' }}>
                            Sign in
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Box>
    );
};

export default Login; 