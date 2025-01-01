import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { TemplateBuilder } from './TemplateBuilder';
import { createTemplate } from '../../lib/database/templates';
import type { Question } from '../../lib/database/types';
import { X } from 'lucide-react';

interface TemplateFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function TemplateForm({ onClose, onSuccess }: TemplateFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'self_reflection' | 'manager_review'>('self_reflection');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || questions.length === 0) return;

    setLoading(true);
    try {
      await createTemplate({
        title,
        description,
        type,
        questions
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating template:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto">
        <div className="flex justify-between items-center p-4 border-b border-sage-200">
          <h2 className="text-lg font-semibold text-sage-900">Create Review Template</h2>
          <button onClick={onClose} className="text-sage-500 hover:text-sage-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-sage-700">
                Template Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-sage-200"
                required
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
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-sage-700">
                Template Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as 'self_reflection' | 'manager_review')}
                className="mt-1 block w-full rounded-md border-sage-200"
              >
                <option value="self_reflection">Self Reflection</option>
                <option value="manager_review">Manager Review</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-sage-700 mb-4">Questions</h3>
            <TemplateBuilder questions={questions} onChange={setQuestions} />
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
              disabled={loading || !title || questions.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}