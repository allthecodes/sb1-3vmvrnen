import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import Teams from '../index';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../lib/database/teams', () => ({
  getTeams: vi.fn(() => Promise.resolve([])),
  createTeam: vi.fn(() => Promise.resolve({ id: 'team1', name: 'Test Team' }))
}));

describe('Teams', () => {
  const renderTeams = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Teams />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders teams page correctly', () => {
    renderTeams();
    expect(screen.getByText(/Teams/i)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderTeams();
    expect(screen.getByText(/Loading teams/i)).toBeInTheDocument();
  });

  it('shows empty state when no teams exist', async () => {
    renderTeams();
    expect(await screen.findByText(/You haven't joined any teams yet/i)).toBeInTheDocument();
  });
});