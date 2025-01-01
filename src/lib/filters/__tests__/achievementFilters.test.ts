import { describe, it, expect } from 'vitest';
import { filterAchievements, FilterOptions } from '../achievementFilters';
import { Achievement } from '../../database/types';
import { subDays, format } from 'date-fns';

describe('filterAchievements', () => {
  const today = new Date();
  const lastWeek = subDays(today, 7);
  const lastMonth = subDays(today, 30);
  const lastYear = subDays(today, 365);

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
      job_id: 'job2',
      title: 'Week old medium impact',
      description: 'Test',
      date: format(lastWeek, 'yyyy-MM-dd'),
      impact_level: 'medium',
      category: 'technical',
      created_at: '',
      updated_at: ''
    },
    {
      id: '3',
      user_id: 'user1',
      job_id: null,
      title: 'Month old low impact',
      description: 'Test',
      date: format(lastMonth, 'yyyy-MM-dd'),
      impact_level: 'low',
      category: 'technical',
      created_at: '',
      updated_at: ''
    },
    {
      id: '4',
      user_id: 'user1',
      job_id: 'job1',
      title: 'Year old high impact',
      description: 'Test',
      date: format(lastYear, 'yyyy-MM-dd'),
      impact_level: 'high',
      category: 'technical',
      created_at: '',
      updated_at: ''
    }
  ];

  it('should return all achievements when no filters are applied', () => {
    const filters: FilterOptions = {
      impactLevel: '',
      dateRange: 'all',
      jobId: null
    };

    const result = filterAchievements(mockAchievements, filters);
    expect(result).toHaveLength(4);
  });

  it('should filter by impact level', () => {
    const filters: FilterOptions = {
      impactLevel: 'high',
      dateRange: 'all',
      jobId: null
    };

    const result = filterAchievements(mockAchievements, filters);
    expect(result).toHaveLength(2);
    expect(result.every(a => a.impact_level === 'high')).toBe(true);
  });

  it('should filter by date range - week', () => {
    const filters: FilterOptions = {
      impactLevel: '',
      dateRange: 'week',
      jobId: null
    };

    const result = filterAchievements(mockAchievements, filters);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some(a => a.title === 'Recent high impact')).toBe(true);
  });

  it('should filter by job', () => {
    const filters: FilterOptions = {
      impactLevel: '',
      dateRange: 'all',
      jobId: 'job1'
    };

    const result = filterAchievements(mockAchievements, filters);
    expect(result).toHaveLength(2);
    expect(result.every(a => a.job_id === 'job1')).toBe(true);
  });

  it('should combine multiple filters', () => {
    const filters: FilterOptions = {
      impactLevel: 'high',
      dateRange: 'week',
      jobId: 'job1'
    };

    const result = filterAchievements(mockAchievements, filters);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Recent high impact');
  });
});