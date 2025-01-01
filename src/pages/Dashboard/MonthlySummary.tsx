import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAchievements } from '../../lib/database/achievements';
import { MonthlyStats } from '../../components/dashboard/MonthlyStats';
import type { Achievement } from '../../lib/database/types';

export default function MonthlySummary() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getAchievements(user.id)
        .then(setAchievements)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-6">
        <div className="h-32 flex items-center justify-center">
          <p className="text-sage-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return <MonthlyStats achievements={achievements} />;
}