import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateTeamForm } from '../components/CreateTeamForm';
import { createTeam } from '../../../lib/database/teams';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../../lib/database/teams', () => ({
  createTeam: vi.fn()
}));

describe('CreateTeamForm', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onSuccess: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<CreateTeamForm {...defaultProps} />);

    expect(screen.getByLabelText(/team name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create team/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    (createTeam as any).mockResolvedValue({ id: 'team123' });

    render(<CreateTeamForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/team name/i), {
      target: { value: 'Test Team' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' }
    });
    fireEvent.click(screen.getByRole('button', { name: /create team/i }));

    await waitFor(() => {
      expect(createTeam).toHaveBeenCalledWith('Test Team', 'Test Description');
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('disables submit button when name is empty', () => {
    render(<CreateTeamForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create team/i });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/team name/i), {
      target: { value: 'Test Team' }
    });

    expect(submitButton).toBeEnabled();
  });

  it('handles errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    (createTeam as any).mockRejectedValue(new Error('Failed to create team'));

    render(<CreateTeamForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/team name/i), {
      target: { value: 'Test Team' }
    });
    fireEvent.click(screen.getByRole('button', { name: /create team/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to create team/i)).toBeInTheDocument();
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });
});