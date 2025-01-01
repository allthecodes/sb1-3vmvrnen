import { describe, it, expect } from 'vitest';
import { getMonthlyStats } from '../monthlyStats';
import { Achievement } from '../../database/types';
import { subDays, format } from 'date-fns';

describe('getMonthlyStats', () => {
  const today = new Date();
  const lastMonth = subDays(today, 35);
  
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      user_id: 'user1',
      job_id: 'job1',
      title: 'Recent high impact',
      description: 'Test',
      date: format(today, 'yyyy-MM-dd'),
      impact_level: 'high',
      category: 'technical',
      created_at: '',
      updated_at: ''
    },
    {
      id: '2',
      user_id: 'user1',
      job_id: 'job1',
      title: 'Last month high impact',
      description: 'Test',
      date: format(lastMonth, 'yyyy-MM-dd'),
      impact_level: 'high',
      category: 'technical',
      created_at: '',
      updated_at: ''
    }
  ];

  it('calculates monthly stats correctly', () => {
    const stats = getMonthlyStats(mockAchievements);
    
    expect(stats.total).toBe(1);
    expect(stats.highImpact).toBe(1);
    expect(stats.totalTrend).toBe(0);
    expect(stats.highImpactTrend).toBe(0);
  });

  it('handles empty achievements', () => {
    const stats = getMonthlyStats([]);
    
    expect(stats.total).toBe(0);
    expect(stats.highImpact).toBe(0);
    expect(stats.totalTrend).toBe(0);
    expect(stats.highImpactTrend).toBe(0);
  });
});