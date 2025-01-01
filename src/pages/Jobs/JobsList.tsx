import React from 'react';
import { Job } from '../../lib/database/types';
import { format } from 'date-fns';
import { Briefcase } from 'lucide-react';

interface JobsListProps {
  jobs: Job[];
  loading: boolean;
}

export default function JobsList({ jobs, loading }: JobsListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
        <div className="text-center text-sage-600">Loading jobs...</div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
        <div className="text-center text-sage-600">
          No jobs added yet. Add your first job to start tracking your career journey!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100">
      <div className="p-4 border-b border-sage-100">
        <h2 className="text-lg font-semibold text-sage-800">Your Jobs</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-start space-x-4 p-4 bg-sage-50 rounded-lg border border-sage-100">
              <Briefcase className="h-5 w-5 text-primary-600 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sage-800">{job.title}</h3>
                  {job.current && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                      Current Role
                    </span>
                  )}
                </div>
                <p className="text-sage-600">{job.company}</p>
                <div className="mt-2 text-sm text-sage-500">
                  {format(new Date(job.start_date), 'MMMM yyyy')} - {
                    job.current ? 'Present' : 
                    job.end_date ? format(new Date(job.end_date), 'MMMM yyyy') : 'Present'
                  }
                </div>
                {job.description && (
                  <p className="mt-2 text-sm text-sage-600">{job.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}