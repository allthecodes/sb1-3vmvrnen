import React, { useState, useEffect } from 'react';
import { getTemplates } from '../../lib/database/templates';
import { TemplateForm } from '../../components/reviews/TemplateForm';
import { TemplateStatus } from '../../components/reviews/TemplateStatus';
import { PlusCircle, FileText } from 'lucide-react';
import type { ReflectionTemplate } from '../../lib/database/types';

export default function TemplatesList() {
  const [templates, setTemplates] = useState<ReflectionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-sage-800">Review Templates</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Template
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
          <div className="text-center text-sage-600">Loading templates...</div>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
          <div className="text-center text-sage-600">
            No templates found. Create your first template to get started!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-sage-100 p-6 hover:border-primary-300 transition-colors"
            >
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
                  onStatusChange={fetchTemplates}
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
          ))}
        </div>
      )}

      {showForm && (
        <TemplateForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchTemplates();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}