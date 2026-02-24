'use client';

import type { Activity } from '../types/activity';

interface ActivityCardProps {
  activity: Activity;
  /** トップページなどで大きく表示する場合 true */
  large?: boolean;
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

export default function ActivityCard({ activity, large = false }: ActivityCardProps) {
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

  const cardPadding = large ? 'p-6 md:p-8' : 'p-5';
  const titleClass = large ? 'text-xl md:text-2xl font-semibold' : 'text-lg font-semibold';
  const badgeClass = large ? 'text-sm px-3 py-1.5' : 'text-xs px-2.5 py-1';
  const dateClass = large ? 'text-base text-slate-500' : 'text-sm text-slate-500';
  const labelClass = large ? 'text-sm text-slate-500 uppercase tracking-wide' : 'text-xs text-slate-500 uppercase tracking-wide';
  const valueClass = large ? 'text-xl md:text-2xl font-semibold text-slate-800 mt-1' : 'text-lg font-semibold text-slate-800 mt-0.5';
  const unitClass = large ? 'text-base font-normal text-slate-500 ml-1' : 'text-sm font-normal text-slate-500 ml-0.5';

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className={cardPadding}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className={`${titleClass} text-slate-800 line-clamp-2 flex-1 min-w-0`}>
            {activity.name ?? '—'}
          </h2>
          <span
            className={`shrink-0 font-medium rounded-full border ${badgeClass} ${getTypeBadgeStyle(
              activity.type ?? ''
            )}`}
          >
            {activity.type ?? '—'}
          </span>
        </div>

        <p className={`${dateClass} mb-4`}>{dateStr}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className={labelClass}>距離</p>
            <p className={valueClass}>
              {distanceKm}
              <span className={unitClass}>km</span>
            </p>
          </div>
          <div className="text-center">
            <p className={labelClass}>時間</p>
            <p className={valueClass}>
              {movingMinutes}
              <span className={unitClass}>min</span>
            </p>
          </div>
          <div className="text-center">
            <p className={labelClass}>標高</p>
            <p className={valueClass}>
              {elevation}
              <span className={unitClass}>m</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
