import React, { useState } from 'react';
import { Download, RefreshCw, Layers, Settings, Check, Loader2, AlertCircle, Trash2, FileCheck } from 'lucide-react';
import { formatBytes } from '../utils/helpers';
import JSZip from 'jszip';

export default function BatchCompressor({
  files,
  batchItems,
  isCompressing,
  globalQuality,
  setGlobalQuality,
  globalWebP,
  setGlobalWebP,
  onCompressAll,
  onReset,
  onRemoveItem,
  onUpdateItemQuality,
  onUpdateItemWebP
}) {
  const [downloadingZip, setDownloadingZip] = useState(false);

  // Compute overall statistics
  const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);
  
  const completedItems = batchItems.filter(item => item.status === 'success');
  const totalCompressedSize = batchItems.reduce((acc, item) => {
    return acc + (item.compressedFile ? item.compressedFile.size : item.file.size);
  }, 0);

  const totalSavedBytes = totalOriginalSize - totalCompressedSize;
  const averageSavedPercent = totalOriginalSize > 0 
    ? ((totalSavedBytes / totalOriginalSize) * 100).toFixed(1)
    : 0;

  const handleDownloadAllAsZip = async () => {
    const successItems = batchItems.filter(item => item.status === 'success' && item.compressedFile);
    if (successItems.length === 0) return;

    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      successItems.forEach((item) => {
        zip.file(item.compressedFile.name, item.compressedFile);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `optipress_batch_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP file:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDownloadSingle = (item) => {
    if (!item.compressedFile) return;
    const url = URL.createObjectURL(item.compressedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.compressedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const allCompleted = batchItems.length > 0 && batchItems.every(item => item.status === 'success' || item.status === 'error');

  return (
    <div className="w-full space-y-6 animate-scale-in">
      
      {/* Global settings and Batch Actions */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-darkbg-200 p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <Layers className="h-5 w-5 text-brand-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-sans">
            Batch Settings ({files.length} items selected)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quality Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Global Quality: <span className="text-brand-600 dark:text-brand-400 font-mono text-base">{globalQuality}%</span>
              </label>
              <span className="text-xs text-gray-400 dark:text-gray-500">Applies to all selected images</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={globalQuality}
              onChange={(e) => setGlobalQuality(parseInt(e.target.value))}
              disabled={isCompressing}
              className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-500 disabled:opacity-50"
            />
            <div className="flex justify-between text-xxs text-gray-400 dark:text-gray-500 px-1 font-mono">
              <span>10% (Smallest size)</span>
              <span>100% (Best quality)</span>
            </div>
          </div>

          {/* Global Format Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
              Global Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGlobalWebP(false)}
                disabled={isCompressing}
                className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-200 focus:outline-none ${
                  !globalWebP
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-300 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-darkbg-100 text-gray-600 dark:text-gray-400'
                }`}
              >
                Keep Original Format
              </button>
              <button
                type="button"
                onClick={() => setGlobalWebP(true)}
                disabled={isCompressing}
                className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-200 focus:outline-none ${
                  globalWebP
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-300 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-darkbg-100 text-gray-600 dark:text-gray-400'
                }`}
              >
                Convert All to WebP
              </button>
            </div>
          </div>
        </div>

        {/* Action triggers */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
          <button
            onClick={onReset}
            disabled={isCompressing}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-darkbg-100 text-gray-600 dark:text-gray-400 text-sm font-medium transition-all focus:outline-none"
          >
            <RefreshCw className="h-4 w-4" />
            Reset List
          </button>
          
          <button
            onClick={onCompressAll}
            disabled={isCompressing || batchItems.length === 0}
            className="flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
          >
            {isCompressing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Compressing Batch...
              </>
            ) : (
              `Compress All (${files.length} Images)`
            )}
          </button>
        </div>
      </div>

      {/* Aggregate Savings Banner */}
      {completedItems.length > 0 && (
        <div className="rounded-2xl border border-brand-100 dark:border-brand-900 bg-brand-50/20 dark:bg-brand-950/10 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 animate-scale-in">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white font-bold text-lg font-mono shadow-md shadow-brand-500/10">
              {averageSavedPercent}%
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Savings (Batch)</div>
              <div className="text-base font-bold text-gray-900 dark:text-white">
                Saved {formatBytes(totalSavedBytes)} across {completedItems.length} files
              </div>
            </div>
          </div>
          
          {allCompleted && (
            <button
              onClick={handleDownloadAllAsZip}
              disabled={downloadingZip}
              className="w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-500/10 focus:outline-none transition-all active:scale-95 disabled:opacity-50"
            >
              {downloadingZip ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating ZIP...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download All as ZIP
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Files List Table/Cards */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-darkbg-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-darkbg-300 text-xxs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <th className="p-4 pl-6">Image Name</th>
                <th className="p-4 min-w-[120px]">Original Size</th>
                <th className="p-4 min-w-[140px]">Settings</th>
                <th className="p-4 min-w-[140px]">Status / Saved</th>
                <th className="p-4 pr-6 text-right min-w-[90px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {batchItems.map((item, index) => {
                const itemSavingsBytes = item.file.size - (item.compressedFile?.size || 0);
                const itemSavingsPercent = item.file.size > 0 
                  ? ((itemSavingsBytes / item.file.size) * 100).toFixed(0)
                  : 0;

                return (
                  <tr key={index} className="hover:bg-gray-50/30 dark:hover:bg-darkbg-100/20 transition-colors">
                    {/* Image metadata */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {item.fileMeta?.previewUrl ? (
                          <img
                            src={item.fileMeta.previewUrl}
                            alt="preview"
                            className="h-10 w-10 rounded object-cover bg-gray-100 dark:bg-darkbg-300 border border-gray-200/50 dark:border-gray-800"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <Layers className="h-5 w-5" />
                          </div>
                        )}
                        <div className="max-w-[180px] sm:max-w-[280px]">
                          <div className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={item.file.name}>
                            {item.file.name}
                          </div>
                          <div className="text-xxs text-gray-400 dark:text-gray-500 font-mono mt-0.5 break-words">
                            {item.fileMeta?.width ? `${item.fileMeta.width}x${item.fileMeta.height} px` : 'Loading size...'} • {item.file.type.split('/')[1]?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Original Size */}
                    <td className="p-4 text-gray-700 dark:text-gray-300 font-mono font-medium whitespace-nowrap">
                      {formatBytes(item.file.size)}
                    </td>

                    {/* Controls (Quality slider / webp checkbox) */}
                    <td className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Custom Item Quality */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xxs text-gray-400 dark:text-gray-500">Q:</span>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={item.quality}
                            disabled={isCompressing || item.status === 'success'}
                            onChange={(e) => {
                              const q = Math.max(10, Math.min(100, parseInt(e.target.value) || 75));
                              onUpdateItemQuality(index, q);
                            }}
                            className="w-14 py-1 px-1.5 text-center text-xs border border-gray-200 rounded dark:border-gray-800 bg-white dark:bg-darkbg-300 font-mono text-gray-800 dark:text-gray-200 focus:outline-none focus:border-brand-500 disabled:opacity-60"
                          />
                        </div>

                        {/* Custom Item WebP Toggle */}
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xxs text-gray-400 dark:text-gray-500">
                          <input
                            type="checkbox"
                            checked={item.convertToWebP}
                            disabled={isCompressing || item.status === 'success'}
                            onChange={(e) => onUpdateItemWebP(index, e.target.checked)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 disabled:opacity-60"
                          />
                          <span>WebP</span>
                        </label>
                      </div>
                    </td>

                    {/* Compression status / savings */}
                    <td className="p-4 min-w-[140px]">
                      {item.status === 'idle' && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xxs font-medium text-gray-500 dark:text-gray-400">
                          Pending
                        </span>
                      )}
                      {item.status === 'compressing' && (
                        <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 text-xxs font-semibold">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Compressing...
                        </div>
                      )}
                      {item.status === 'success' && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xxs font-semibold">
                            <FileCheck className="h-3 w-3" />
                            Saved {itemSavingsPercent}%
                          </div>
                          <div className="text-xxs text-gray-400 dark:text-gray-500 font-mono">
                            Now {formatBytes(item.compressedFile.size)}
                          </div>
                        </div>
                      )}
                      {item.status === 'error' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 text-xxs font-medium text-rose-700 dark:text-rose-400">
                          <AlertCircle className="h-3 w-3" />
                          Failed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      {item.status === 'success' ? (
                        <button
                          onClick={() => handleDownloadSingle(item)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-brand-50 dark:bg-gray-800 dark:hover:bg-brand-950/40 text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-300 transition-all focus:outline-none"
                          title="Download Image"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onRemoveItem(index)}
                          disabled={isCompressing}
                          className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-all focus:outline-none disabled:opacity-50"
                          title="Remove File"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
