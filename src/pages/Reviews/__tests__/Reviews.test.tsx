import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import Reviews from '../index';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../lib/database/templates', () => ({
  getTemplates: vi.fn(() => Promise.resolve([]))
}));

vi.mock('../../../lib/database/reviews', () => ({
  getReviewResponses: vi.fn(() => Promise.resolve([]))
}));

describe('Reviews', () => {
  const renderReviews = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Reviews />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders reviews page correctly', () => {
    renderReviews();
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderReviews();
    expect(screen.getByText(/Loading reviews/i)).toBeInTheDocument();
  });
});