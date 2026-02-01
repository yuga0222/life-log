'use client';

import { useEffect, useState } from 'react';

interface Activity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
}

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/strava/activities/');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div className="p-8">Loading activities...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Strava Activities</h1>
      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold">{activity.name}</h2>
              <p className="text-gray-600">{activity.type}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <p><span className="font-semibold">Distance:</span> {(activity.distance / 1000).toFixed(2)} km</p>
                <p><span className="font-semibold">Elevation:</span> {activity.total_elevation_gain} m</p>
                <p><span className="font-semibold">Moving Time:</span> {Math.floor(activity.moving_time / 60)} min</p>
                <p><span className="font-semibold">Date:</span> {new Date(activity.start_date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
