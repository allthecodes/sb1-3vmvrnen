import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, Briefcase } from 'lucide-react';
import { Achievement, Job } from '../../lib/database/types';
import { format } from 'date-fns';
import { getJobs } from '../../lib/database/jobs';
import { useAuth } from '../../contexts/AuthContext';

interface AchievementsListProps {
  achievements: Achievement[];
  loading: boolean;
}

export default function AchievementsList({ achievements, loading }: AchievementsListProps) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Record<string, Job>>({});

  useEffect(() => {
    if (user) {
      getJobs(user.id).then(jobsList => {
        const jobsMap = jobsList.reduce((acc, job) => ({
          ...acc,
          [job.id]: job
        }), {});
        setJobs(jobsMap);
      }).catch(console.error);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
        <div className="text-center text-sage-600">Loading achievements...</div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
        <div className="text-center text-sage-600">
          No achievements found. Add your first achievement to start tracking your growth!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100">
      <div className="p-4 border-b border-sage-100">
        <h2 className="text-lg font-semibold text-sage-800">Your Achievements</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const job = achievement.job_id ? jobs[achievement.job_id] : null;
            
            return (
              <div key={achievement.id} className="flex items-start space-x-4 p-4 bg-sage-50 rounded-lg border border-sage-100">
                <Trophy className="h-5 w-5 text-primary-600 mt-1" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-sage-800">{achievement.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      achievement.impact_level === 'high' ? 'bg-primary-100 text-primary-800' :
                      achievement.impact_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-sage-100 text-sage-800'
                    }`}>
                      {achievement.impact_level?.charAt(0).toUpperCase() + achievement.impact_level?.slice(1)} Impact
                    </span>
                    {achievement.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sage-100 text-sage-800">
                        {achievement.category}
                      </span>
                    )}
                  </div>
                  {achievement.description && (
                    <p className="mt-1 text-sm text-sage-600">{achievement.description}</p>
                  )}
                  <div className="mt-2 flex items-center space-x-4 text-sm text-sage-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{format(new Date(achievement.date), 'MMMM d, yyyy')}</span>
                    </div>
                    {job && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{job.title} at {job.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}