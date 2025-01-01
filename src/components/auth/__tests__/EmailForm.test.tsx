import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailForm } from '../EmailForm';
import { describe, it, expect, vi } from 'vitest';

describe('EmailForm', () => {
  const defaultProps = {
    email: '',
    password: '',
    loading: false,
    buttonText: 'Submit',
    loadingText: 'Loading...',
    onEmailChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onSubmit: vi.fn()
  };

  it('renders form elements correctly', () => {
    render(<EmailForm {...defaultProps} />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent(defaultProps.buttonText);
  });

  it('handles input changes', () => {
    render(<EmailForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(defaultProps.onEmailChange).toHaveBeenCalledWith('test@example.com');
    expect(defaultProps.onPasswordChange).toHaveBeenCalledWith('password123');
  });

  it('handles form submission', () => {
    render(<EmailForm {...defaultProps} />);

    fireEvent.submit(screen.getByRole('form'));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('disables form when loading', () => {
    render(<EmailForm {...defaultProps} loading={true} />);

    expect(screen.getByPlaceholderText(/email/i)).toBeDisabled();
    expect(screen.getByPlaceholderText(/password/i)).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent(defaultProps.loadingText);
  });
});