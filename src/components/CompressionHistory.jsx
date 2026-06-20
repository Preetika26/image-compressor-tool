import React from 'react';
import { History, Trash2, ShieldCheck, Zap, HardDrive, Info } from 'lucide-react';
import { formatBytes } from '../utils/helpers';

export default function CompressionHistory({ history, onClearHistory }) {
  const historyList = Array.isArray(history) ? history : [];

  if (historyList.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-darkbg-200/50 p-6 text-center text-gray-500 dark:text-gray-400">
        <History className="h-8 w-8 mx-auto mb-3 text-gray-400 stroke-[1.5]" />
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">No History Yet</h4>
        <p className="text-xs max-w-xs mx-auto text-gray-400 dark:text-gray-500">
          Your compression statistics will show here once you start compressing images.
        </p>
      </div>
    );
  }

  // Calculate totals
  const totalSaved = historyList.reduce((acc, curr) => acc + (curr.originalSize - curr.compressedSize), 0);
  const totalCompressed = historyList.length;
  
  // Get recent 5 items
  const recentItems = historyList.slice(-5).reverse();

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-darkbg-200 p-6 shadow-sm space-y-6">
      
      {/* Header and Clear button */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-brand-500" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white font-sans">
            Compression History Dashboard
          </h3>
        </div>
        
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 text-xxs font-semibold text-rose-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all focus:outline-none"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Stats
        </button>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-darkbg-300/80 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xxs text-gray-400 dark:text-gray-500 font-medium">Images Processed</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">{totalCompressed}</div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-darkbg-300/80 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xxs text-gray-400 dark:text-gray-500 font-medium">Total Size Saved</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">{formatBytes(totalSaved)}</div>
          </div>
        </div>
      </div>

      {/* Detailed Recent Runs */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Recent Compressions
        </h4>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[220px] overflow-y-auto pr-1">
          {recentItems.map((item, index) => {
            const savingsBytes = item.originalSize - item.compressedSize;
            const rawSavingsPercent = item.originalSize > 0 
              ? ((savingsBytes / item.originalSize) * 100).toFixed(0)
              : 0;
            const savingsPercent = Math.abs(rawSavingsPercent);
            const savingsSign = savingsBytes >= 0 ? '-' : '+';

            return (
              <div key={index} className="py-3 flex items-center justify-between text-xs hover:bg-gray-50/20 dark:hover:bg-darkbg-100/10 rounded px-1.5 transition-colors">
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[140px] sm:max-w-[200px]" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-xxs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                    {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Q: {item.quality}% {item.convertedToWebP ? '• WebP' : ''}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`font-bold ${savingsBytes >= 0 ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'} font-mono`}>
                    {savingsSign}{savingsPercent}%
                  </span>
                  <div className="text-xxs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                    saved {formatBytes(savingsBytes)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security statement banner */}
      <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-darkbg-300 p-3">
        <ShieldCheck className="h-4.5 w-4.5 text-green-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
          <span className="font-bold text-gray-700 dark:text-gray-300">Privacy First:</span> OptiPress operates entirely within your browser. None of your image files, previews, or data are ever uploaded or sent to any server.
        </p>
      </div>
    </div>
  );
}
