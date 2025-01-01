import React from 'react';
import TemplatesList from './TemplatesList';
import { Settings } from 'lucide-react';

export default function TemplateAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-6 w-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-sage-800">Template Administration</h1>
      </div>
      
      <TemplatesList />
    </div>
  );
}