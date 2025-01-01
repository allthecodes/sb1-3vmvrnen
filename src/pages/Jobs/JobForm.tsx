import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createJob } from '../../lib/database/jobs';
import { Modal } from '../../components/ui/Modal';
import { X } from 'lucide-react';

interface JobFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function JobForm({ onClose, onSuccess }: JobFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createJob({
        user_id: user.id,
        title: formData.get('title') as string,
        company: formData.get('company') as string,
        start_date: formData.get('start_date') as string,
        end_date: current ? null : (formData.get('end_date') as string || null),
        current,
        description: formData.get('description') as string
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
        <div className="flex justify-between items-center p-4 border-b border-sage-200">
          <h2 className="text-lg font-semibold text-sage-900">Add New Job</h2>
          <button onClick={onClose} className="text-sage-500 hover:text-sage-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-sage-700">
              Job Title
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
            <label htmlFor="company" className="block text-sm font-medium text-sage-700">
              Company
            </label>
            <input
              type="text"
              name="company"
              id="company"
              required
              className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-sage-700">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                required
                className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-sage-700">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                id="end_date"
                disabled={current}
                className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-sage-50 disabled:text-sage-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="current"
              checked={current}
              onChange={(e) => setCurrent(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-sage-300 rounded"
            />
            <label htmlFor="current" className="ml-2 block text-sm text-sage-700">
              This is my current role
            </label>
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
              {loading ? 'Saving...' : 'Save Job'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}