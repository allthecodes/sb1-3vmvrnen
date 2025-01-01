import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../../lib/utils/cn';

interface StatCardProps {
  title: string;
  value: number;
  trend: number;
  description: string;
}

export function StatCard({ title, value, trend, description }: StatCardProps) {
  const isPositive = trend >= 0;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-sage-600">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-sage-900">{value}</p>
        <p className={cn(
          "ml-2 flex items-center text-sm",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          {Math.abs(trend)}%
        </p>
      </div>
      <p className="mt-1 text-sm text-sage-500">{description}</p>
    </div>
  );
}