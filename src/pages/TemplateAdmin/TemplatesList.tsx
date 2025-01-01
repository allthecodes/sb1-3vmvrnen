import React, { useState, useEffect } from 'react';
import { getTemplates } from '../../lib/database/templates';
import { TemplateForm } from '../../components/templates/TemplateForm';
import { TemplateCard } from './components/TemplateCard';
import { PlusCircle } from 'lucide-react';
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
            <TemplateCard
              key={template.id}
              template={template}
              onStatusChange={fetchTemplates}
            />
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