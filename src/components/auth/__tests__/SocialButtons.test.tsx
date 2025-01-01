import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SocialButtons } from '../SocialButtons';
import { describe, it, expect, vi } from 'vitest';

describe('SocialButtons', () => {
  const defaultProps = {
    onGoogleClick: vi.fn(),
    onAppleClick: vi.fn()
  };

  it('renders social buttons correctly', () => {
    render(<SocialButtons {...defaultProps} />);

    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    expect(screen.getByText(/continue with apple/i)).toBeInTheDocument();
  });

  it('handles button clicks', () => {
    render(<SocialButtons {...defaultProps} />);

    fireEvent.click(screen.getByText(/continue with google/i));
    expect(defaultProps.onGoogleClick).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/continue with apple/i));
    expect(defaultProps.onAppleClick).toHaveBeenCalled();
  });

  it('renders divider text', () => {
    render(<SocialButtons {...defaultProps} />);
    expect(screen.getByText(/or continue with email/i)).toBeInTheDocument();
  });
});