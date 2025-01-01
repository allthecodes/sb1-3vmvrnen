import React, { useState } from 'react';
import { createReviewResponse, updateReviewResponse } from '../../lib/database/reviews';
import { Modal } from '../../components/ui/Modal';
import { X } from 'lucide-react';
import type { Question, ReflectionTemplate, ReviewResponse } from '../../lib/database/types';
import { QuestionResponse } from './components/QuestionResponse';

interface ReviewFormProps {
  template: ReflectionTemplate;
  existingResponse?: ReviewResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewForm({ template, existingResponse, onClose, onSuccess }: ReviewFormProps) {
  const [responses, setResponses] = useState<Record<string, any>>(
    existingResponse?.responses || {}
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, status: 'in_progress' | 'completed') => {
    e.preventDefault();
    setLoading(true);

    try {
      if (existingResponse) {
        await updateReviewResponse(existingResponse.id, {
          responses,
          status
        });
      } else {
        await createReviewResponse(template.id, responses, status);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto">
        <div className="flex justify-between items-center p-4 border-b border-sage-200">
          <div>
            <h2 className="text-lg font-semibold text-sage-900">{template.title}</h2>
            {template.description && (
              <p className="mt-1 text-sm text-sage-600">{template.description}</p>
            )}
          </div>
          <button onClick={onClose} className="text-sage-500 hover:text-sage-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'completed')} className="p-4 space-y-6">
          {template.questions.map((question: Question) => (
            <QuestionResponse
              key={question.id}
              question={question}
              value={responses[question.id]}
              onChange={(value) => handleResponseChange(question.id, value)}
            />
          ))}

          <div className="flex justify-end space-x-3 pt-4 border-t border-sage-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-sage-700 hover:text-sage-800 bg-sage-50 hover:bg-sage-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'in_progress')}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-sage-700 bg-sage-100 hover:bg-sage-200 rounded-md disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Review'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}