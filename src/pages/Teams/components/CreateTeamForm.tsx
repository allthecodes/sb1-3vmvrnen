import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { createTeam } from '../../../lib/database/teams';
import { X } from 'lucide-react';

interface CreateTeamFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTeamForm({ onClose, onSuccess }: CreateTeamFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      await createTeam(name.trim(), description.trim() || undefined);
      onSuccess();
    } catch (err) {
      console.error('Error creating team:', err);
      setError('Failed to create team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto">
        <div className="flex justify-between items-center p-4 border-b border-sage-200">
          <h2 className="text-lg font-semibold text-sage-900">Create Team</h2>
          <button 
            onClick={onClose} 
            className="text-sage-500 hover:text-sage-700"
            type="button"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-sage-700">
              Team Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-sage-200"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-sage-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-sage-200"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-sage-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-sage-700 hover:text-sage-800 bg-sage-50 hover:bg-sage-100 rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}