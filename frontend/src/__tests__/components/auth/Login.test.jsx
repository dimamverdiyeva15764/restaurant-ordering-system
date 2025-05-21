import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../../components/auth/Login';
import axios from 'axios';

jest.mock('@chakra-ui/react', () => ({
  Box: ({ children }) => <div>{children}</div>,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  FormControl: ({ children }) => <div>{children}</div>,
  FormLabel: ({ children }) => <span>{children}</span>,
  Input: (props) => <input {...props} />,
  Heading: ({ children }) => <h1>{children}</h1>,
  Text: ({ children }) => <p>{children}</p>,
  VStack: ({ children }) => <div>{children}</div>,
  Icon: () => <span>icon</span>,
  useColorModeValue: (light) => light,
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');

describe('Login Component', () => {
  const renderLogin = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  test('renders form inputs and button', () => {
    renderLogin();

    expect(screen.getByText(/Username/i)).toBeInTheDocument();
    expect(screen.getByText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('submits form and navigates on successful login (KITCHEN_STAFF)', async () => {
    axios.post.mockResolvedValueOnce({ data: { role: 'KITCHEN_STAFF' } });

    renderLogin();

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'john' } });

    // fallback to querying all inputs and pick by type for password
    const passwordInput = screen.getAllByRole('textbox').find(input => input.type === 'password') ||
                          screen.getByDisplayValue('');

    fireEvent.change(passwordInput, { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/kitchen');
    });
  });

  test('shows error on failed login', async () => {
    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderLogin();

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'baduser' } });

    const passwordInput = screen.getAllByRole('textbox').find(input => input.type === 'password') ||
                          screen.getByDisplayValue('');

    fireEvent.change(passwordInput, { target: { value: 'badpass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
