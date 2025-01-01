import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../supabase';
import { createTeam, getTeams, updateTeamMemberRole, leaveTeam } from '../teams';

vi.mock('../../supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}));

describe('teams', () => {
  const mockUser = { id: 'user123' };
  const mockTeam = {
    id: 'team123',
    name: 'Test Team',
    description: 'Test Description'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTeam', () => {
    it('creates a team and adds creator as owner', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({ data: { user: mockUser } });
      (supabase.from as any)().insert().select().single
        .mockResolvedValueOnce({ data: mockTeam, error: null });

      const result = await createTeam('Test Team', 'Test Description');
      expect(result).toEqual(mockTeam);
    });

    it('throws error when not authenticated', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({ data: { user: null } });
      await expect(createTeam('Test Team')).rejects.toThrow('Not authenticated');
    });

    it('handles database errors', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({ data: { user: mockUser } });
      (supabase.from as any)().insert().select().single
        .mockResolvedValueOnce({ data: null, error: new Error('Database error') });

      await expect(createTeam('Test Team')).rejects.toThrow('Database error');
    });
  });

  describe('getTeams', () => {
    it('fetches teams with members', async () => {
      const mockTeams = [{ ...mockTeam, members: [] }];
      (supabase.from as any)().select().order.mockResolvedValue({
        data: mockTeams,
        error: null
      });

      const result = await getTeams('user123');
      expect(result).toEqual(mockTeams);
    });

    it('handles fetch error', async () => {
      (supabase.from as any)().select().order.mockResolvedValue({
        data: null,
        error: new Error('Failed to fetch teams')
      });

      await expect(getTeams('user123')).rejects.toThrow('Failed to fetch teams');
    });
  });

  describe('updateTeamMemberRole', () => {
    it('updates member role successfully', async () => {
      const mockUpdate = vi.fn(() => Promise.resolve({ error: null }));
      (supabase.from as any)().update().eq.mockImplementation(() => ({
        eq: mockUpdate
      }));

      await updateTeamMemberRole('team123', 'user123', 'admin');
      expect(mockUpdate).toHaveBeenCalled();
    });

    it('handles update error', async () => {
      const mockUpdate = vi.fn(() => Promise.resolve({ error: new Error('Update failed') }));
      (supabase.from as any)().update().eq.mockImplementation(() => ({
        eq: mockUpdate
      }));

      await expect(updateTeamMemberRole('team123', 'user123', 'admin')).rejects.toThrow('Update failed');
    });
  });

  describe('leaveTeam', () => {
    it('removes member from team successfully', async () => {
      const mockDelete = vi.fn(() => Promise.resolve({ error: null }));
      (supabase.from as any)().delete().eq.mockImplementation(() => ({
        eq: mockDelete
      }));

      await leaveTeam('team123', 'user123');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('handles leave error', async () => {
      const mockDelete = vi.fn(() => Promise.resolve({ error: new Error('Leave failed') }));
      (supabase.from as any)().delete().eq.mockImplementation(() => ({
        eq: mockDelete
      }));

      await expect(leaveTeam('team123', 'user123')).rejects.toThrow('Leave failed');
    });
  });
});