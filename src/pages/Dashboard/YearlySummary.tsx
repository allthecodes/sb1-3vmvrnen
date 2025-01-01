import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function YearlySummary() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-sage-800">Yearly Progress</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-sage-600 text-sm">
          Your year-to-date achievements and growth will be summarized here.
        </p>
      </div>
    </div>
  );
}