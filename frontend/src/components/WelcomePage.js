import React from 'react';
import { Box, Container, Heading, VStack, Button, Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaUsersCog } from 'react-icons/fa';

const WelcomePage = () => {
    const navigate = useNavigate();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <Box 
            minH="100vh" 
            bg={bgColor} 
            py={20}
        >
            <Container maxW="container.md">
                <VStack spacing={10} align="center">
                    <Heading 
                        as="h1" 
                        size="2xl" 
                        textAlign="center"
                        bgGradient="linear(to-r, teal.500, blue.500)"
                        bgClip="text"
                    >
                        Welcome to Our Restaurant
                    </Heading>
                    
                    <Text fontSize="xl" textAlign="center" color="gray.600">
                        Experience the finest dining with our carefully curated menu and exceptional service.
                    </Text>

                    <Box 
                        w="full" 
                        p={8} 
                        bg={cardBg} 
                        boxShadow="xl" 
                        rounded="lg"
                    >
                        <VStack spacing={6}>
                            <Button
                                leftIcon={<FaUtensils />}
                                colorScheme="teal"
                                size="lg"
                                w="full"
                                onClick={() => navigate('/tables')}
                            >
                                Select Your Table
                            </Button>

                            <Button
                                leftIcon={<FaUsersCog />}
                                colorScheme="blue"
                                size="lg"
                                w="full"
                                variant="outline"
                                onClick={() => navigate('/login')}
                            >
                                Staff Login
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default WelcomePage; 