import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import SignUp from '../SignUp';
import { describe, it, expect, vi } from 'vitest';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('SignUp', () => {
  const renderSignUp = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <SignUp />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders signup form correctly', () => {
    renderSignUp();

    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up with email/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    renderSignUp();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByText(/sign up with email/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/failed to create account/i)).not.toBeInTheDocument();
    });
  });

  it('displays error message on failed signup', async () => {
    renderSignUp();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByText(/sign up with email/i);

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create account/i)).toBeInTheDocument();
    });
  });
});