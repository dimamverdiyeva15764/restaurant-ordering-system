import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TableSelection from '../../../components/TableSelection';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@chakra-ui/react', () => ({
  Box:             ({ children }) => <div>{children}</div>,
  SimpleGrid:      ({ children }) => <div>{children}</div>,
  Container:       ({ children }) => <div>{children}</div>,
  Heading:         ({ children }) => <h1>{children}</h1>,
  Button:          ({ children, isDisabled, ...props }) => <button disabled={isDisabled} {...props}>{children}</button>,
  VStack:          ({ children }) => <div>{children}</div>,
  Text:            ({ children }) => <p>{children}</p>,
  useColorModeValue: () => 'light',
  useToast:          () => jest.fn(),
}));

jest.mock('../../../components/TableQRCode', () => ({ tableNumber }) => (
  <div data-testid="qrcode">QR-{tableNumber}</div>
));

import axios from 'axios';
jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TableSelection', () => {
  afterEach(() => jest.clearAllMocks());

  it('fetches and displays tables with correct button states', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { tableNumber: 'T1', status: 'AVAILABLE', location: 'Window', id: 1 },
        { tableNumber: 'T2', status: 'OCCUPIED', location: 'Bar',    id: 2 },
      ],
    });

    render(
      <MemoryRouter>
        <TableSelection />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Status: AVAILABLE')).toBeInTheDocument();
      expect(screen.getByText('Status: OCCUPIED')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Seat at Table T1/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Table Not Available/i })).toBeDisabled();
  });

  it('selects an available table and navigates', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [{ tableNumber: 'T3', status: 'AVAILABLE', location: 'Patio', id: 3 }],
      })
      .mockResolvedValueOnce({ data: { id: 3, status: 'AVAILABLE' } });

    axios.put.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <TableSelection />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Status: AVAILABLE')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Seat at Table T3/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/menu');
    });
  });
});
