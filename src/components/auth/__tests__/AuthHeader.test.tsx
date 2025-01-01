import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthHeader } from '../AuthHeader';
import { describe, it, expect } from 'vitest';

describe('AuthHeader', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    linkText: 'Test Link',
    linkTo: '/test'
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: BrowserRouter });
  };

  it('renders all elements correctly', () => {
    renderWithRouter(<AuthHeader {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.linkText)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', defaultProps.linkTo);
  });

  it('renders the trophy icon', () => {
    renderWithRouter(<AuthHeader {...defaultProps} />);
    expect(screen.getByTestId('trophy-icon')).toBeInTheDocument();
  });
});