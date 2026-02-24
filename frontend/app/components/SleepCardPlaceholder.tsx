'use client';

/**
 * 睡眠ログ用の仮カード（バックエンドAPI連携前）
 * 本実装では Sleep as Android API などから取得したデータを表示する想定
 */
export default function SleepCardPlaceholder() {
  return (
    <article className="bg-white rounded-xl border border-slate-200 border-dashed shadow-md overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800">睡眠</h2>
          <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border bg-slate-100 text-slate-600 border-slate-200">
            準備中
          </span>
        </div>
        <p className="text-slate-500 mb-4">睡眠ログはバックエンドAPI未連携のため仮表示です。</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">就寝</p>
            <p className="text-lg font-semibold text-slate-400 mt-0.5">11:13</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">起床</p>
            <p className="text-lg font-semibold text-slate-400 mt-0.5">06:34</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">睡眠時間</p>
            <p className="text-lg font-semibold text-slate-400 mt-0.5">7 h 21 min</p>
          </div>
        </div>
      </div>
    </article>
  );
}
