import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

// 🧪 Mock useAuth directly
jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../../../context/AuthContext';

const DummyComponent = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;
const UnauthorizedPage = () => <div>Unauthorized Page</div>;

function renderRoute() {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute requiredRole="MANAGER">
              <DummyComponent />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </MemoryRouter>
  );
}

test('redirects to login if not authenticated', () => {
  useAuth.mockReturnValue({
    isAuthenticated: () => false,
    hasRole: () => false,
  });

  renderRoute();
  expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
});

test('redirects to unauthorized if role does not match', () => {
  useAuth.mockReturnValue({
    isAuthenticated: () => true,
    hasRole: () => false,
  });

  renderRoute();
  expect(screen.getByText(/Unauthorized Page/i)).toBeInTheDocument();
});

test('renders children if authenticated and role matches', () => {
  useAuth.mockReturnValue({
    isAuthenticated: () => true,
    hasRole: () => true,
  });

  renderRoute();
  expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
});
