import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Text, VStack } from '@chakra-ui/react';

const TableScanner = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (tableId) {
      // Store the table ID in session storage
      sessionStorage.setItem('tableId', tableId);
      // Redirect to menu page
      navigate('/menu');
    }
  }, [tableId, navigate]);

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={4}>
        <Text fontSize="2xl">Table Scanner</Text>
        <Box>
          {tableId ? (
            <Text>Redirecting to menu...</Text>
          ) : (
            <Text>Please scan a valid QR code</Text>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default TableScanner; 