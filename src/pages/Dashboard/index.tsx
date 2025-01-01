import React from 'react';
import WeeklyHighlights from './WeeklyHighlights';
import MonthlySummary from './MonthlySummary';
import YearlySummary from './YearlySummary';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-sage-800">Your Career Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WeeklyHighlights />
        <MonthlySummary />
        <YearlySummary />
      </div>
    </div>
  );
}