import React from 'react';
import type { Question } from '../../../lib/database/types';

interface QuestionResponseProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}

export function QuestionResponse({ question, value, onChange }: QuestionResponseProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required={question.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required={question.required}
          />
        );
      
      case 'rating':
        return (
          <div className="mt-1 flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating)}
                className={`w-10 h-10 rounded-full ${
                  value === rating
                    ? 'bg-primary-600 text-white'
                    : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );
      
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-sage-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'multiselect':
        return (
          <div className="mt-1 space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    onChange(newValues);
                  }}
                  className="rounded border-sage-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sage-700">{option}</span>
              </label>
            ))}
          </div>
        );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-sage-700">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
    </div>
  );
}