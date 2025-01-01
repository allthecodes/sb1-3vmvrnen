import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
}

export function AuthHeader({ title, subtitle, linkText, linkTo }: AuthHeaderProps) {
  return (
    <div>
      <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
        <Trophy className="h-8 w-8 text-primary-600" />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-sage-800">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-sage-600">
        {subtitle}{' '}
        <Link to={linkTo} className="font-medium text-primary-600 hover:text-primary-500">
          {linkText}
        </Link>
      </p>
    </div>
  );
}