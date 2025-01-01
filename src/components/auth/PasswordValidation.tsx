import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { PasswordValidation } from '../../lib/auth/validation';

interface PasswordValidationProps {
  validation: PasswordValidation;
}

export function PasswordValidationHints({ validation }: PasswordValidationProps) {
  if (validation.errors.length === 0) return null;

  return (
    <div className="mt-2 text-sm">
      {validation.errors.map((error, index) => (
        <div key={index} className="flex items-center text-red-600">
          <XCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      ))}
    </div>
  );
}