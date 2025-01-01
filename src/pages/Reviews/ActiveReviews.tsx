import React, { useState } from 'react';
import { ReviewForm } from './ReviewForm';
import { ReviewView } from './components/ReviewView';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import type { ReflectionTemplate, ReviewResponse } from '../../lib/database/types';

interface ActiveReviewsProps {
  templates: ReflectionTemplate[];
  responses: ReviewResponse[];
  onUpdate: () => void;
}

export default function ActiveReviews({ templates, responses, onUpdate }: ActiveReviewsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ReflectionTemplate | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<ReviewResponse | null>(null);
  const [showView, setShowView] = useState(false);

  const activeTemplates = templates.filter(t => t.status === 'active');

  const handleReviewClick = (template: ReflectionTemplate, response?: ReviewResponse) => {
    setSelectedTemplate(template);
    setSelectedResponse(response || null);
    setShowView(response?.status === 'completed' || false);
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setSelectedResponse(null);
    setShowView(false);
  };

  if (activeTemplates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
        <div className="text-center text-sage-600">No active reviews available.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-sage-800">Active Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTemplates.map((template) => {
          const response = responses.find(r => r.template_id === template.id);
          const isCompleted = response?.status === 'completed';
          const isInProgress = response?.status === 'in_progress';

          return (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-sage-100 p-6"
            >
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-primary-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-sage-800">{template.title}</h3>
                  <p className="mt-1 text-sm text-sage-600">{template.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    {isCompleted ? (
                      <span className="inline-flex items-center text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center text-sm text-yellow-600">
                        <Clock className="h-4 w-4 mr-1" />
                        In Progress
                      </span>
                    ) : (
                      <span className="text-sm text-sage-600">
                        Not started
                      </span>
                    )}
                    
                    <button
                      onClick={() => handleReviewClick(template, response)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      {isInProgress ? 'Continue' : isCompleted ? 'View' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTemplate && (
        showView ? (
          <ReviewView
            template={selectedTemplate}
            response={selectedResponse!}
            onClose={handleClose}
          />
        ) : (
          <ReviewForm
            template={selectedTemplate}
            existingResponse={selectedResponse || undefined}
            onClose={handleClose}
            onSuccess={onUpdate}
          />
        )
      )}
    </div>
  );
}