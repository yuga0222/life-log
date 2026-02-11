'use client';

import type { Activity } from '../types/activity';

interface ActivityCardProps {
  activity: Activity;
}

/** アクティビティ種別に応じたバッジのスタイル */
function getTypeBadgeStyle(type: string): string {
  const t = (type ?? '').toLowerCase();
  if (t.includes('run')) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (t.includes('ride') || t.includes('cycle')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (t.includes('swim')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
  if (t.includes('hike') || t.includes('walk')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const distanceKm = ((activity.distance ?? 0) / 1000).toFixed(1);
  const movingMinutes = Math.floor((activity.moving_time ?? 0) / 60);
  const elevation = activity.total_elevation_gain ?? 0;
  const dateStr = activity.start_date
    ? new Date(activity.start_date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-slate-800 line-clamp-2 flex-1 min-w-0">
            {activity.name ?? '—'}
          </h2>
          <span
            className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${getTypeBadgeStyle(
              activity.type ?? ''
            )}`}
          >
            {activity.type ?? '—'}
          </span>
        </div>

        <p className="text-sm text-slate-500 mb-4">{dateStr}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">距離</p>
            <p className="text-lg font-semibold text-slate-800 mt-0.5">
              {distanceKm}
              <span className="text-sm font-normal text-slate-500 ml-0.5">km</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">時間</p>
            <p className="text-lg font-semibold text-slate-800 mt-0.5">
              {movingMinutes}
              <span className="text-sm font-normal text-slate-500 ml-0.5">min</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">標高</p>
            <p className="text-lg font-semibold text-slate-800 mt-0.5">
              {elevation}
              <span className="text-sm font-normal text-slate-500 ml-0.5">m</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
