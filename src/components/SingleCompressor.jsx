import React, { useState, useEffect } from 'react';
import { Download, Copy, RefreshCw, FileImage, Settings, Eye, Check, Loader2, ArrowRight } from 'lucide-react';
import { formatBytes, copyTextToClipboard } from '../utils/helpers';

export default function SingleCompressor({
  file,
  fileMeta,
  compressedFile,
  compressedMeta,
  isCompressing,
  quality,
  setQuality,
  convertToWebP,
  setConvertToWebP,
  onCompress,
  onReset
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('side-by-side'); // 'side-by-side' or 'comparison'
  const [splitPosition, setSplitPosition] = useState(50);

  const savingsBytes = file.size - (compressedFile?.size || 0);
  const savingsPercent = file.size > 0 ? ((savingsBytes / file.size) * 100).toFixed(1) : 0;

  const handleCopyStats = async () => {
    if (!compressedFile) return;
    const statsText = `Image Compression Report (OptiPress)
--------------------------------------
File Name: ${file.name}
Original Size: ${formatBytes(file.size)} (${fileMeta.width}x${fileMeta.height} px)
Compressed Size: ${formatBytes(compressedFile.size)} (${compressedMeta?.width}x${compressedMeta?.height} px)
Size Reduced By: ${formatBytes(savingsBytes)}
Percentage Saved: ${savingsPercent}%
Compression Settings: ${quality}% quality${convertToWebP ? ' (Converted to WebP)' : ''}`;
    
    const success = await copyTextToClipboard(statsText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = compressedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6 animate-scale-in">
      {/* Control Card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-darkbg-200 p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <Settings className="h-5 w-5 text-brand-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-sans">
            Compression Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quality Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Quality: <span className="text-brand-600 dark:text-brand-400 font-mono text-base">{quality}%</span>
              </label>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {quality >= 80 ? 'High' : quality >= 40 ? 'Medium (Recommended)' : 'Low'}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              disabled={isCompressing}
              className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-500 disabled:opacity-50"
            />
            <div className="flex justify-between text-xxs text-gray-400 dark:text-gray-500 px-1 font-mono">
              <span>10% (Smallest size)</span>
              <span>100% (Best quality)</span>
            </div>
          </div>

          {/* Target Format */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
              Output Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConvertToWebP(false)}
                disabled={isCompressing}
                className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-200 focus:outline-none ${
                  !convertToWebP
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-300 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-darkbg-100 text-gray-600 dark:text-gray-400'
                }`}
              >
                Original Format
              </button>
              <button
                type="button"
                onClick={() => setConvertToWebP(true)}
                disabled={isCompressing}
                className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-200 focus:outline-none ${
                  convertToWebP
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-300 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-darkbg-100 text-gray-600 dark:text-gray-400'
                }`}
              >
                Convert to WebP
              </button>
            </div>
          </div>
        </div>

        {/* Compression Action Button */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
          <button
            onClick={onReset}
            disabled={isCompressing}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-darkbg-100 text-gray-600 dark:text-gray-400 text-sm font-medium transition-all focus:outline-none"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
          
          <button
            onClick={onCompress}
            disabled={isCompressing}
            className="flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
          >
            {isCompressing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Compressing...
              </>
            ) : (
              'Compress Image'
            )}
          </button>
        </div>
      </div>

      {/* Previews & Stats Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Previews Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-darkbg-300 p-1.5 rounded-xl border border-gray-200/50 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 pl-3">Image Visualizer</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab('side-by-side')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'side-by-side'
                    ? 'bg-white dark:bg-darkbg-100 shadow-sm text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'comparison'
                    ? 'bg-white dark:bg-darkbg-100 shadow-sm text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                Split Preview
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-darkbg-200 overflow-hidden shadow-sm w-full min-h-[360px] flex flex-col p-4 relative">
            {activeTab === 'side-by-side' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
                {/* Original Preview */}
                <div className="relative flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-gray-50 dark:bg-darkbg-300 p-2 border border-gray-100 dark:border-gray-800 overflow-hidden group">
                  <img
                    src={fileMeta.previewUrl}
                    alt="Original"
                    className="max-w-full max-h-[260px] object-contain rounded shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xxs font-semibold px-2 py-1 rounded">
                    Original
                  </div>
                </div>

                {/* Compressed Preview */}
                <div className="relative flex flex-col items-center justify-center rounded-xl bg-gray-50 dark:bg-darkbg-300 p-2 border border-gray-100 dark:border-gray-800 overflow-hidden group">
                  {compressedMeta?.previewUrl ? (
                    <img
                      src={compressedMeta.previewUrl}
                      alt="Compressed"
                      className="max-w-full max-h-[260px] object-contain rounded shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="text-center text-gray-400 dark:text-gray-500 p-8">
                      <FileImage className="h-10 w-10 mx-auto mb-2 stroke-[1.5]" />
                      <p className="text-xs">Compressed preview will show here after compression</p>
                    </div>
                  )}
                  {compressedMeta?.previewUrl && (
                    <div className="absolute bottom-3 left-3 bg-brand-600/90 backdrop-blur-sm text-white text-xxs font-semibold px-2 py-1 rounded">
                      Compressed
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[260px] overflow-hidden bg-gray-50 dark:bg-darkbg-300 rounded-xl border border-gray-100 dark:border-gray-800">
                {compressedMeta?.previewUrl ? (
                  <>
                    <img
                      src={fileMeta.previewUrl}
                      alt="Original"
                      className="absolute inset-0 h-full w-full object-contain"
                    />

                    <div
                      className="absolute inset-y-0 left-0 overflow-hidden"
                      style={{ width: `${splitPosition}%` }}
                    >
                      <img
                        src={compressedMeta.previewUrl}
                        alt="Compressed"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div
                      className="absolute inset-y-0 right-0 w-px bg-white/70"
                      style={{ left: `${splitPosition}%` }}
                    />

                    <div className="absolute top-4 left-4 rounded-full bg-slate-900/80 text-white text-xxs px-3 py-1.5 flex items-center gap-2 shadow-lg">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Split Preview</span>
                    </div>

                    <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-slate-950/80 p-3 text-center text-[11px] text-white/80">
                      <div className="mb-2">Drag the slider to compare original and compressed images</div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={splitPosition}
                        onChange={(e) => setSplitPosition(parseInt(e.target.value, 10))}
                        className="w-full accent-brand-500"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 p-8">
                    <FileImage className="h-10 w-10 mx-auto mb-2 stroke-[1.5]" />
                    <p className="text-xs">Compress to enable split preview</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Metadata Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-darkbg-200 p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              File Details
            </h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">File Name</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 max-w-[150px] truncate" title={file.name}>
                  {file.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Original Size</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 font-mono">
                  {formatBytes(file.size)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Dimensions</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 font-mono">
                  {fileMeta.width ? `${fileMeta.width} x ${fileMeta.height} px` : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 uppercase">
                  {file.type.split('/')[1] || 'image'}
                </span>
              </div>
            </div>
          </div>

          {/* Compressed Stats / Savings Card */}
          {compressedFile && (
            <div className="rounded-2xl border border-brand-100 dark:border-brand-900 bg-brand-50/20 dark:bg-brand-950/10 p-5 shadow-sm space-y-4 animate-scale-in">
              <h4 className="text-sm font-bold text-brand-800 dark:text-brand-400 uppercase tracking-wider">
                Compression Stats
              </h4>

              <div className="space-y-4">
                {/* Savings Circle/Metric */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white font-bold text-lg font-mono shadow-md shadow-brand-500/10">
                    {savingsPercent}%
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Storage Savings</div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      Saved {formatBytes(savingsBytes)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs border-t border-brand-100 dark:border-brand-950 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Compressed Size</span>
                    <span className="font-bold text-green-600 dark:text-green-400 font-mono">
                      {formatBytes(compressedFile.size)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">New Dimensions</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 font-mono">
                      {compressedMeta?.width ? `${compressedMeta.width} x ${compressedMeta.height} px` : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">New Format</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 uppercase font-mono">
                      {compressedFile.type.split('/')[1] || 'image'}
                    </span>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="grid grid-cols-2 gap-3 border-t border-brand-100 dark:border-brand-950 pt-4">
                  <button
                    onClick={handleCopyStats}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-darkbg-100 text-gray-700 dark:text-gray-300 text-xs font-semibold focus:outline-none transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Stats
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm shadow-brand-500/10 focus:outline-none transition-all active:scale-95"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
