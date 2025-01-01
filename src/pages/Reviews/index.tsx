import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ActiveReviews from './ActiveReviews';
import { getTemplates } from '../../lib/database/templates';
import { getReviewResponses } from '../../lib/database/reviews';
import type { ReflectionTemplate, ReviewResponse } from '../../lib/database/types';

export default function Reviews() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ReflectionTemplate[]>([]);
  const [responses, setResponses] = useState<ReviewResponse[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [templatesData, responsesData] = await Promise.all([
        getTemplates(),
        user ? getReviewResponses(user.id) : []
      ]);
      
      setTemplates(templatesData);
      setResponses(responsesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-sage-800">Reviews</h1>
        <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
          <div className="text-center text-sage-600">Loading reviews...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-sage-800">Reviews</h1>
        <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-sage-800">Reviews</h1>
      <ActiveReviews templates={templates} responses={responses} onUpdate={fetchData} />
    </div>
  );
}