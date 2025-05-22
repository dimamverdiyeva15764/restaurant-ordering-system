import React from 'react';
import { QRCode } from 'react-qr-code';
import {
    Box,
    VStack,
    Text,
    useColorModeValue,
    Container,
    Heading,
    Badge
} from '@chakra-ui/react';

const TableQRCode = ({ tableNumber }) => {
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    // This would be a real URL in production
    const dummyUrl = `http://restaurant.example.com/menu?table=${tableNumber}`;

    return (
        <Container maxW="sm" py={8}>
            <VStack
                spacing={6}
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                p={6}
                align="center"
                boxShadow="lg"
            >
                <Badge
                    colorScheme="teal"
                    fontSize="lg"
                    paddingX={4}
                    paddingY={2}
                    borderRadius="full"
                >
                    Table {tableNumber}
                </Badge>

                <Box
                    bg="white"
                    p={4}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    <QRCode
                        value={dummyUrl}
                        size={200}
                        level="H"
                    />
                </Box>

                <VStack spacing={2} textAlign="center">
                    <Heading size="md">Scan to Order</Heading>
                    <Text color="gray.500" fontSize="sm">
                        Scan this QR code to access our digital menu and place your order
                    </Text>
                </VStack>
            </VStack>
        </Container>
    );
};

export default TableQRCode; 