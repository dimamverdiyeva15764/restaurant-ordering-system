import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// 1. Mock Chakra components and hooks
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children }) => <div>{children}</div>,
  Heading: ({ children }) => <h1>{children}</h1>,
  Text: ({ children }) => <p>{children}</p>,
  SimpleGrid: ({ children }) => <div>{children}</div>,
  Flex: ({ children }) => <div>{children}</div>,
  Badge: ({ children }) => <span>{children}</span>,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Stack: ({ children }) => <div>{children}</div>,
  Divider: () => <hr />,
  Spinner: () => <div role="status" />,
  useToast: () => () => {},               
}));

jest.mock('../../../components/common/LogoutButton', () => () => <div>logout</div>);

jest.mock('sockjs-client', () => function SockJS() {});

jest.mock('@stomp/stompjs', () => ({
  Stomp: {
    over: () => ({
      connect: (_headers, onConnect) => {
        onConnect({ headers: {} });
      },
      disconnect: () => {},
      subscribe: (destination, callback) => {
        if (destination === '/app/kitchen/active-orders') {
          callback({
            body: JSON.stringify([
              {
                id: 1,
                orderNumber: 101,
                tableNumber: 4,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                items: [
                  { itemName: 'Pizza', quantity: 1, price: 12.99 },
                ],
              },
            ]),
          });
        }
      },
      send: () => {},
      connected: true,
    }),
  },
}));

import KitchenDashboard from '../../../components/kitchen/KitchenDashboard';

describe('KitchenDashboard', () => {
  it('shows a spinner, then renders the fake order', async () => {
    render(<KitchenDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Order #101/)).toBeInTheDocument();
      expect(screen.getByText(/Table 4/)).toBeInTheDocument();
      expect(screen.getByText(/Pizza/)).toBeInTheDocument();
    });
  });
});
