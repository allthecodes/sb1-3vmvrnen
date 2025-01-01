import React from 'react';
import { Achievement } from '../../../lib/database/types';
import { StatCard } from './StatCard';
import { getMonthlyStats } from '../../../lib/stats/monthlyStats';

interface MonthlyStatsProps {
  achievements: Achievement[];
}

export function MonthlyStats({ achievements }: MonthlyStatsProps) {
  const stats = getMonthlyStats(achievements);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard
        title="Total Achievements"
        value={stats.total}
        trend={stats.totalTrend}
        description="vs last month"
      />
      <StatCard
        title="High Impact"
        value={stats.highImpact}
        trend={stats.highImpactTrend}
        description="vs last month"
      />
    </div>
  );
}