import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { FilterOptions, DATE_RANGE_OPTIONS, IMPACT_LEVEL_OPTIONS } from '../../lib/filters/achievementFilters';
import { getJobs } from '../../lib/database/jobs';
import { useAuth } from '../../contexts/AuthContext';
import { Job } from '../../lib/database/types';

interface AchievementFiltersProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
}

export default function AchievementFilters({ filters, onChange }: AchievementFiltersProps) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (user) {
      getJobs(user.id).then(setJobs).catch(console.error);
    }
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-primary-600" />
        <h2 className="font-medium text-sage-800">Filters</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-sage-700">
            Job
          </label>
          <select
            value={filters.jobId || ''}
            onChange={(e) => onChange({ ...filters, jobId: e.target.value || null })}
            className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title} at {job.company}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700">
            Impact Level
          </label>
          <select
            value={filters.impactLevel}
            onChange={(e) => onChange({ ...filters, impactLevel: e.target.value })}
            className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {IMPACT_LEVEL_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-sage-700">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onChange({ ...filters, dateRange: e.target.value })}
            className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {DATE_RANGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}