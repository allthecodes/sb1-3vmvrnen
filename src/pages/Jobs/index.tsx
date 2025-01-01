import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getJobs } from '../../lib/database/jobs';
import { Job } from '../../lib/database/types';
import JobsList from './JobsList';
import { JobForm } from './JobForm';
import { PlusCircle } from 'lucide-react';

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return;
    try {
      const data = await getJobs(user.id);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-sage-800">Career History</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Job
        </button>
      </div>

      <JobsList jobs={jobs} loading={loading} />

      {showForm && (
        <JobForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchJobs();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}