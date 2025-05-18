import React from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Button
            leftIcon={<Icon as={FiLogOut} />}
            colorScheme="red"
            variant="ghost"
            onClick={handleLogout}
            position="absolute"
            top="4"
            right="4"
        >
            Logout
        </Button>
    );
};

export default LogoutButton; 