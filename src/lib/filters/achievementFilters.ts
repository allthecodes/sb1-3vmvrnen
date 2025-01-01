import { Achievement } from '../database/types';
import { startOfWeek, startOfMonth, startOfYear, isAfter } from 'date-fns';

export type FilterOptions = {
  impactLevel: string;
  dateRange: string;
  jobId: string | null;
};

export const IMPACT_LEVEL_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: 'high', label: 'High Impact' },
  { value: 'medium', label: 'Medium Impact' },
  { value: 'low', label: 'Low Impact' }
];

export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

export function filterAchievements(achievements: Achievement[], filters: FilterOptions): Achievement[] {
  return achievements.filter(achievement => {
    const matchesImpact = !filters.impactLevel || achievement.impact_level === filters.impactLevel;
    const matchesDate = matchesDateRange(achievement, filters.dateRange);
    const matchesJob = !filters.jobId || achievement.job_id === filters.jobId;

    return matchesImpact && matchesDate && matchesJob;
  });
}

function matchesDateRange(achievement: Achievement, dateRange: string): boolean {
  if (!dateRange || dateRange === 'all') return true;

  const achievementDate = new Date(achievement.date);
  const now = new Date();
  
  switch (dateRange) {
    case 'week':
      return isAfter(achievementDate, startOfWeek(now));
    case 'month':
      return isAfter(achievementDate, startOfMonth(now));
    case 'year':
      return isAfter(achievementDate, startOfYear(now));
    default:
      return true;
  }
}