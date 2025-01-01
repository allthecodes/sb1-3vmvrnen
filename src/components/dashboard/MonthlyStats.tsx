import React from 'react';
import { BarChart, TrendingUp, TrendingDown } from 'lucide-react';
import { format, startOfMonth, subMonths, isWithinInterval } from 'date-fns';
import type { Achievement } from '../../lib/database/types';

interface MonthlyStatsProps {
  achievements: Achievement[];
}

export function MonthlyStats({ achievements }: MonthlyStatsProps) {
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

  const stats = [
    {
      title: 'Total Achievements',
      current: currentMonthAchievements.length,
      previous: lastMonthAchievements.length
    },
    {
      title: 'High Impact',
      current: currentMonthAchievements.filter(a => a.impact_level === 'high').length,
      previous: lastMonthAchievements.filter(a => a.impact_level === 'high').length
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-sage-800">Monthly Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const trend = stat.previous === 0 
            ? (stat.current > 0 ? 100 : 0)
            : Math.round(((stat.current - stat.previous) / stat.previous) * 100);
          const isPositive = trend >= 0;

          return (
            <div key={index} className="bg-sage-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-sage-600">{stat.title}</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-sage-900">{stat.current}</p>
                <p className={`ml-2 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(trend)}%
                </p>
              </div>
              <p className="mt-1 text-sm text-sage-500">vs last month</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-sage-600 mb-3">Recent Achievements</h3>
        {currentMonthAchievements.length > 0 ? (
          <div className="space-y-3">
            {currentMonthAchievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="bg-sage-50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-sage-800">{achievement.title}</h4>
                    <p className="text-xs text-sage-600 mt-1">
                      {format(new Date(achievement.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    achievement.impact_level === 'high' 
                      ? 'bg-primary-100 text-primary-800'
                      : achievement.impact_level === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-sage-100 text-sage-800'
                  }`}>
                    {achievement.impact_level?.charAt(0).toUpperCase() + achievement.impact_level?.slice(1)} Impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-sage-500">No achievements recorded this month</p>
        )}
      </div>
    </div>
  );
}