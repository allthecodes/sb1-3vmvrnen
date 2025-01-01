import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { X } from 'lucide-react';
import type { Question, ReflectionTemplate, ReviewResponse } from '../../../lib/database/types';

interface ReviewViewProps {
  template: ReflectionTemplate;
  response: ReviewResponse;
  onClose: () => void;
}

export function ReviewView({ template, response, onClose }: ReviewViewProps) {
  const renderResponse = (question: Question) => {
    const value = response.responses[question.id];

    switch (question.type) {
      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <div
                key={rating}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  value === rating
                    ? 'bg-primary-600 text-white'
                    : 'bg-sage-100 text-sage-600'
                }`}
              >
                {rating}
              </div>
            ))}
          </div>
        );

      case 'select':
        return <p className="text-sage-800">{value}</p>;

      case 'multiselect':
        return (
          <ul className="list-disc list-inside space-y-1">
            {value?.map((item: string) => (
              <li key={item} className="text-sage-800">{item}</li>
            ))}
          </ul>
        );

      default:
        return <p className="text-sage-800">{value}</p>;
    }
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

        <div className="p-4 space-y-6">
          {template.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <h3 className="text-sm font-medium text-sage-700">
                {question.text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {renderResponse(question)}
            </div>
          ))}

          <div className="flex justify-end pt-4 border-t border-sage-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-sage-700 hover:text-sage-800 bg-sage-50 hover:bg-sage-100 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}