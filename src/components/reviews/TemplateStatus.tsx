import React from 'react';
import { updateTemplateStatus } from '../../lib/database/templates';
import type { TemplateStatus as Status } from '../../lib/database/types';

interface TemplateStatusProps {
  id: string;
  status: Status;
  onStatusChange: () => void;
}

export function TemplateStatus({ id, status, onStatusChange }: TemplateStatusProps) {
  const toggleStatus = async () => {
    try {
      await updateTemplateStatus(id, status === 'draft' ? 'active' : 'draft');
      onStatusChange();
    } catch (error) {
      console.error('Error updating template status:', error);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'active'
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      }`}
      data-testid="template-status-toggle"
    >
      {status === 'active' ? 'Active' : 'Draft'}
    </button>
  );
}