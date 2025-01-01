import { describe, it, expect, vi } from 'vitest';
import { retryOperation } from '../supabase';

describe('retryOperation', () => {
  it('should return result on successful operation', async () => {
    const operation = vi.fn().mockResolvedValue('success');
    const result = await retryOperation(operation);
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and succeed eventually', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');

    const result = await retryOperation(operation);
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should throw after max retries', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('fail'));
    await expect(retryOperation(operation)).rejects.toThrow('fail');
    expect(operation).toHaveBeenCalledTimes(3);
  });
});