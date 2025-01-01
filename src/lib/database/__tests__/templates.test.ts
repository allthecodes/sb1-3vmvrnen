import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../supabase';
import { createTemplate, updateTemplateStatus } from '../templates';

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
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      }))
    }))
  },
  retryOperation: vi.fn((fn) => fn())
}));

describe('templates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTemplate', () => {
    it('creates a template with draft status', async () => {
      const mockUser = { id: 'user123' };
      const mockTemplate = {
        title: 'Test Template',
        description: 'Test Description',
        questions: [],
        type: 'self_reflection' as const
      };

      (supabase.auth.getUser as any).mockResolvedValue({ data: { user: mockUser } });
      (supabase.from as any)().insert().select().single.mockResolvedValue({
        data: { ...mockTemplate, status: 'draft', user_id: mockUser.id }
      });

      const result = await createTemplate(mockTemplate);

      expect(result).toEqual(expect.objectContaining({
        ...mockTemplate,
        status: 'draft',
        user_id: mockUser.id
      }));
    });
  });

  describe('updateTemplateStatus', () => {
    it('updates template status', async () => {
      const mockTemplate = {
        id: 'template123',
        status: 'active'
      };

      (supabase.from as any)().update().eq().select().single.mockResolvedValue({
        data: mockTemplate
      });

      const result = await updateTemplateStatus('template123', 'active');

      expect(result).toEqual(mockTemplate);
    });
  });
});