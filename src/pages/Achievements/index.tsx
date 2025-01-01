import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAchievements } from '../../lib/database/achievements';
import { Achievement } from '../../lib/database/types';
import { filterAchievements, FilterOptions } from '../../lib/filters/achievementFilters';
import AchievementsList from './AchievementsList';
import AchievementFilters from './AchievementFilters';
import { AchievementForm } from '../../components/achievements/AchievementForm';
import { PlusCircle } from 'lucide-react';

export default function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    impactLevel: '',
    dateRange: 'all',
    jobId: null
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    if (!user) return;
    try {
      const data = await getAchievements(user.id);
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = filterAchievements(achievements, filters);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-sage-800">Career Achievements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Achievement
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <AchievementFilters
            filters={filters}
            onChange={setFilters}
          />
        </div>
        <div className="lg:col-span-3">
          <AchievementsList
            achievements={filteredAchievements}
            loading={loading}
          />
        </div>
      </div>

      {showForm && (
        <AchievementForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchAchievements();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}