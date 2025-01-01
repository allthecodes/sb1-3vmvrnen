import React, { useState, useEffect } from 'react';
import { PlusCircle, Trophy, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAchievements } from '../../lib/database/achievements';
import { AchievementForm } from '../../components/achievements/AchievementForm';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import type { Achievement } from '../../lib/database/types';

export default function WeeklyHighlights() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

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

  const weeklyAchievements = achievements.filter(achievement => {
    const achievementDate = new Date(achievement.date);
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Start week on Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    return isWithinInterval(achievementDate, {
      start: weekStart,
      end: weekEnd
    });
  });

  const handleSuccess = () => {
    fetchAchievements();
    setShowForm(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-sage-800">This Week's Highlights</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="text-primary-600 hover:text-primary-700 transition-colors"
            aria-label="Add achievement"
          >
            <PlusCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            <p className="text-sage-600 text-sm">Loading achievements...</p>
          ) : weeklyAchievements.length > 0 ? (
            weeklyAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="flex items-start space-x-3 p-3 bg-sage-50 rounded-lg"
              >
                <Trophy className="h-5 w-5 text-primary-600 mt-1" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-sage-800">{achievement.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      achievement.impact_level === 'high' 
                        ? 'bg-primary-100 text-primary-800'
                        : achievement.impact_level === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-sage-100 text-sage-800'
                    }`}>
                      {achievement.impact_level?.charAt(0).toUpperCase() + achievement.impact_level?.slice(1)} Impact
                    </span>
                  </div>
                  {achievement.description && (
                    <p className="mt-1 text-sm text-sage-600">{achievement.description}</p>
                  )}
                  <div className="mt-2 flex items-center space-x-4 text-sm text-sage-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{format(new Date(achievement.date), 'MMM d, yyyy')}</span>
                    </div>
                    {achievement.job && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{achievement.job.title} at {achievement.job.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sage-600 text-sm">
              No achievements logged this week.
              Click the plus icon to add your first highlight!
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <AchievementForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}