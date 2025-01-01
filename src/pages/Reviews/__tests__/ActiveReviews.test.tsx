import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import ActiveReviews from '../ActiveReviews';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../lib/database/templates', () => ({
  getTemplates: vi.fn(() => Promise.resolve([]))
}));

vi.mock('../../../lib/database/reviews', () => ({
  getReviewResponses: vi.fn(() => Promise.resolve([]))
}));

describe('ActiveReviews', () => {
  const renderActiveReviews = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <ActiveReviews />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders active reviews section correctly', () => {
    renderActiveReviews();
    expect(screen.getByText(/Active Reviews/i)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderActiveReviews();
    expect(screen.getByText(/Loading reviews/i)).toBeInTheDocument();
  });
});