import { Achievement } from '../database/types';
import { startOfMonth, subMonths, isWithinInterval } from 'date-fns';

interface MonthlyStats {
  total: number;
  totalTrend: number;
  highImpact: number;
  highImpactTrend: number;
}

export function getMonthlyStats(achievements: Achievement[]): MonthlyStats {
  const now = new Date();
  const currentMonth = {
    start: startOfMonth(now),
    end: now
  };
  const lastMonth = {
    start: startOfMonth(subMonths(now, 1)),
    end: startOfMonth(now)
  };

  const currentMonthAchievements = achievements.filter(a => 
    isWithinInterval(new Date(a.date), currentMonth)
  );
  
  const lastMonthAchievements = achievements.filter(a => 
    isWithinInterval(new Date(a.date), lastMonth)
  );

  const currentTotal = currentMonthAchievements.length;
  const lastTotal = lastMonthAchievements.length;
  
  const currentHighImpact = currentMonthAchievements.filter(a => 
    a.impact_level === 'high'
  ).length;
  
  const lastHighImpact = lastMonthAchievements.filter(a => 
    a.impact_level === 'high'
  ).length;

  return {
    total: currentTotal,
    totalTrend: calculateTrend(currentTotal, lastTotal),
    highImpact: currentHighImpact,
    highImpactTrend: calculateTrend(currentHighImpact, lastHighImpact)
  };
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}