// src/__tests__/components/auth/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../../components/auth/Login';

// 1) Mock Chakra UI so no focusBorderColor/colorScheme leaks through
jest.mock('@chakra-ui/react', () => ({
  Box:              ({ children }) => <div>{children}</div>,
  Button:           ({ children, ...rest }) => <button {...rest}>{children}</button>,
  FormControl:      ({ children }) => <div>{children}</div>,
  FormLabel:        ({ children }) => <span>{children}</span>,
  Input:            ({ focusBorderColor, ...rest }) => <input {...rest} />,
  Heading:          ({ children }) => <h1>{children}</h1>,
  Text:             ({ children }) => <p>{children}</p>,
  VStack:           ({ children }) => <div>{children}</div>,
  Icon:             () => <span>icon</span>,
  useColorModeValue:(light) => light,
}));

// 2) Mock AuthContext
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ login: jest.fn() }),
}));

// 3) Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 4) Mock axios
import axios from 'axios';
jest.mock('axios', () => ({ post: jest.fn() }));

describe('Login Component', () => {
  function renderLogin() {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  }

  test('renders two inputs and the sign in button', () => {
    const { container } = renderLogin();

    // find all <input> elements (username + password)
    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(2);

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('submits form and navigates on successful login (KITCHEN_STAFF)', async () => {
    axios.post.mockResolvedValueOnce({ data: { role: 'KITCHEN_STAFF' } });

    const { container } = renderLogin();
    const inputs = container.querySelectorAll('input');
    const [usernameInput, passwordInput] = inputs;

    fireEvent.change(usernameInput, { target: { value: 'john' } });
    fireEvent.change(passwordInput, { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/kitchen');
    });
  });

  test('shows error on failed login', async () => {
    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { container } = renderLogin();
    const inputs = container.querySelectorAll('input');
    const [usernameInput, passwordInput] = inputs;

    fireEvent.change(usernameInput, { target: { value: 'baduser' } });
    fireEvent.change(passwordInput, { target: { value: 'badpass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
