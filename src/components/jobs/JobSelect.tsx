import React from 'react';
import type { Job } from '../../lib/database/types';

interface JobSelectProps {
  jobs: Job[];
  value: string | null;
  onChange: (jobId: string | null) => void;
  className?: string;
}

export function JobSelect({ jobs, value, onChange, className = '' }: JobSelectProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className={`block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${className}`}
    >
      <option value="">No Job Selected</option>
      {jobs.map((job) => (
        <option key={job.id} value={job.id}>
          {job.title} at {job.company}
          {job.current ? ' (Current)' : ''}
        </option>
      ))}
    </select>
  );
}