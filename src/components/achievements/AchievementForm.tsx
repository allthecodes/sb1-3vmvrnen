import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createAchievement } from '../../lib/database/achievements';
import { getJobs } from '../../lib/database/jobs';
import { FileInput } from './FileInput';
import { Modal } from '../ui/Modal';
import { JobSelect } from '../jobs/JobSelect';
import { X } from 'lucide-react';
import type { Job } from '../../lib/database/types';

interface AchievementFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AchievementForm({ onClose, onSuccess }: AchievementFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      getJobs(user.id).then(setJobs).catch(console.error);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createAchievement({
        user_id: user.id,
        job_id: selectedJobId,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        category: formData.get('category') as string,
        impact_level: formData.get('impact_level') as 'low' | 'medium' | 'high',
        attachments: files
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating achievement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
        <div className="flex justify-between items-center p-4 border-b border-sage-200">
          <h2 className="text-lg font-semibold text-sage-900">Log Achievement</h2>
          <button onClick={onClose} className="text-sage-500 hover:text-sage-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="job_id" className="block text-sm font-medium text-sage-700">
              Related Job (Optional)
            </label>
            <JobSelect
              jobs={jobs}
              value={selectedJobId}
              onChange={setSelectedJobId}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-sage-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-sage-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-sage-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                required
                className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-sage-700">
                Category
              </label>
              <select
                name="category"
                id="category"
                className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="technical">Technical</option>
                <option value="leadership">Leadership</option>
                <option value="communication">Communication</option>
                <option value="innovation">Innovation</option>
              </select>
            </div>

            <div>
              <label htmlFor="impact_level" className="block text-sm font-medium text-sage-700">
                Impact Level
              </label>
              <select
                name="impact_level"
                id="impact_level"
                required
                className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <FileInput files={files} setFiles={setFiles} />

          <div className="flex justify-end space-x-3 pt-4 border-t border-sage-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-sage-700 hover:text-sage-800 bg-sage-50 hover:bg-sage-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Achievement'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}