import React from 'react';
import { FileText } from 'lucide-react';
import { TemplateStatus } from '../../../components/templates/TemplateStatus';
import type { ReflectionTemplate } from '../../../lib/database/types';

interface TemplateCardProps {
  template: ReflectionTemplate;
  onStatusChange: () => void;
}

export function TemplateCard({ template, onStatusChange }: TemplateCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-6 hover:border-primary-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-lg font-medium text-sage-800">{template.title}</h3>
            <p className="text-sm text-sage-600">{template.description}</p>
          </div>
        </div>
        <TemplateStatus
          id={template.id}
          status={template.status}
          onStatusChange={onStatusChange}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-sage-600">
          {template.questions.length} question{template.questions.length === 1 ? '' : 's'}
        </p>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {template.type === 'self_reflection' ? 'Self Review' : 'Manager Review'}
        </span>
      </div>
    </div>
  );
}