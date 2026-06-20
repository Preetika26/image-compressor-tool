import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import SingleCompressor from './components/SingleCompressor';
import BatchCompressor from './components/BatchCompressor';
import CompressionHistory from './components/CompressionHistory';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getImageDimensions, convertToWebpBlob } from './utils/helpers';
import imageCompression from 'browser-image-compression';
import confetti from 'canvas-confetti';
import { Shield, Sparkles, Zap, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('optipress-dark-mode', false);
  const [history, setHistory] = useLocalStorage('optipress-history', []);
  
  // App view modes: 'upload' | 'single' | 'batch'
  const [mode, setMode] = useState('upload');
  
  // Single image states
  const [file, setFile] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [compressedMeta, setCompressedMeta] = useState(null);
  const [quality, setQuality] = useState(75);
  const [convertToWebP, setConvertToWebP] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Batch images states
  const [files, setFiles] = useState([]);
  const [batchItems, setBatchItems] = useState([]);
  const [globalQuality, setGlobalQuality] = useState(75);
  const [globalWebP, setGlobalWebP] = useState(false);

  // Sync Dark/Light theme classes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync global batch configuration settings to pending batch items
  useEffect(() => {
    if (mode === 'batch') {
      setBatchItems(prev =>
        prev.map(item => {
          if (item.status === 'idle') {
            return { ...item, quality: globalQuality };
          }
          return item;
        })
      );
    }
  }, [globalQuality, mode]);

  useEffect(() => {
    if (mode === 'batch') {
      setBatchItems(prev =>
        prev.map(item => {
          if (item.status === 'idle') {
            return { ...item, convertToWebP: globalWebP };
          }
          return item;
        })
      );
    }
  }, [globalWebP, mode]);

  // Reset function to clear inputs
  const handleReset = () => {
    // Revoke old object URLs to prevent memory leaks
    if (fileMeta?.previewUrl) URL.revokeObjectURL(fileMeta.previewUrl);
    if (compressedMeta?.previewUrl) URL.revokeObjectURL(compressedMeta.previewUrl);
    
    batchItems.forEach(item => {
      if (item.fileMeta?.previewUrl) URL.revokeObjectURL(item.fileMeta.previewUrl);
      if (item.compressedMeta?.previewUrl) URL.revokeObjectURL(item.compressedMeta.previewUrl);
    });

    setFile(null);
    setFileMeta(null);
    setCompressedFile(null);
    setCompressedMeta(null);
    setQuality(75);
    setConvertToWebP(false);
    setIsCompressing(false);

    setFiles([]);
    setBatchItems([]);
    setGlobalQuality(75);
    setGlobalWebP(false);
    
    setMode('upload');
  };

  // Handle files passed from DropZone
  const handleFilesSelected = async (selectedFiles) => {
    if (selectedFiles.length === 1) {
      const selected = selectedFiles[0];
      const previewUrl = URL.createObjectURL(selected);
      const dims = await getImageDimensions(selected);
      
      setFile(selected);
      setFileMeta({
        width: dims.width,
        height: dims.height,
        previewUrl
      });
      setMode('single');
    } else {
      const items = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const itemFile = selectedFiles[i];
        const previewUrl = URL.createObjectURL(itemFile);
        const dims = await getImageDimensions(itemFile);
        
        items.push({
          file: itemFile,
          fileMeta: {
            width: dims.width,
            height: dims.height,
            previewUrl
          },
          status: 'idle',
          quality: globalQuality,
          convertToWebP: globalWebP,
          compressedFile: null,
          compressedMeta: null
        });
      }
      setFiles(selectedFiles);
      setBatchItems(items);
      setMode('batch');
    }
  };

  // Run single compression
  const handleCompressSingle = async () => {
    if (!file) return;
    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 50,
        useWebWorker: true,
        initialQuality: quality / 100,
        alwaysKeepResolution: true
      };

      let compressed = await imageCompression(file, options);

      if (convertToWebP && compressed.type !== 'image/webp') {
        compressed = await convertToWebpBlob(compressed, quality / 100);
      }

      const compressedPreview = URL.createObjectURL(compressed);
      const dims = await getImageDimensions(compressed);

      setCompressedFile(compressed);
      setCompressedMeta({
        width: dims.width,
        height: dims.height,
        previewUrl: compressedPreview
      });

      // Log in history
      const logItem = {
        name: file.name,
        originalSize: file.size,
        compressedSize: compressed.size,
        quality,
        convertedToWebP: convertToWebP,
        timestamp: Date.now()
      };
      setHistory(prev => [...prev, logItem]);

      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.65 }
      });
    } catch (err) {
      console.error('Single image compression error: ', err);
    } finally {
      setIsCompressing(false);
    }
  };

  // Run batch compression sequential list
  const handleCompressBatch = async () => {
    setIsCompressing(true);
    const updated = [...batchItems];

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      if (item.status === 'success') continue;

      updated[i] = { ...item, status: 'compressing' };
      setBatchItems([...updated]);

      try {
        const options = {
          maxSizeMB: 50,
          useWebWorker: true,
          initialQuality: item.quality / 100,
          alwaysKeepResolution: true
        };

        let compressed = await imageCompression(item.file, options);

        if (item.convertToWebP && compressed.type !== 'image/webp') {
          compressed = await convertToWebpBlob(compressed, item.quality / 100);
        }

        const compressedPreview = URL.createObjectURL(compressed);
        const dims = await getImageDimensions(compressed);

        updated[i] = {
          ...item,
          status: 'success',
          compressedFile: compressed,
          compressedMeta: {
            width: dims.width,
            height: dims.height,
            previewUrl: compressedPreview
          }
        };

        const logItem = {
          name: item.file.name,
          originalSize: item.file.size,
          compressedSize: compressed.size,
          quality: item.quality,
          convertedToWebP: item.convertToWebP,
          timestamp: Date.now()
        };
        setHistory(prev => [...prev, logItem]);
      } catch (err) {
        console.error(`Batch item [${item.file.name}] compression error: `, err);
        updated[i] = { ...item, status: 'error' };
      }
      setBatchItems([...updated]);
    }

    setIsCompressing(false);

    // Batch completion confetti!
    confetti({
      particleCount: 150,
      spread: 85,
      origin: { y: 0.65 }
    });
  };

  // Remove individual batch items from list
  const handleRemoveBatchItem = (index) => {
    const item = batchItems[index];
    if (item.fileMeta?.previewUrl) URL.revokeObjectURL(item.fileMeta.previewUrl);
    if (item.compressedMeta?.previewUrl) URL.revokeObjectURL(item.compressedMeta.previewUrl);

    const nextItems = batchItems.filter((_, idx) => idx !== index);
    const nextFiles = files.filter((_, idx) => idx !== index);
    
    setBatchItems(nextItems);
    setFiles(nextFiles);

    if (nextItems.length === 0) {
      handleReset();
    }
  };

  // Update granular quality per batch item
  const handleUpdateItemQuality = (index, itemQuality) => {
    setBatchItems(prev =>
      prev.map((item, idx) => (idx === index ? { ...item, quality: itemQuality } : item))
    );
  };

  // Update granular WebP conversion per batch item
  const handleUpdateItemWebP = (index, convertWebP) => {
    setBatchItems(prev =>
      prev.map((item, idx) => (idx === index ? { ...item, convertToWebP: convertWebP } : item))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-darkbg-300 dark:text-gray-100 transition-colors duration-300 flex flex-col font-sans">
      
      {/* Navbar Header */}
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Main Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Hero Banner Header */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200/30 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>OptiPress Engine v1.0</span>
          </div>
          
          <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight text-gray-900 dark:text-white font-sans leading-[1.1]">
            Compress images in seconds,{' '}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-300">
              zero quality loss
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Upload, compress, and convert PNG, JPG, and WebP files. All computations run securely in-browser. Your data never leaves your system.
          </p>
        </section>

        {/* Dashboard Workspace */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Compression Console */}
          <div className="lg:col-span-8">
            {mode === 'upload' && (
              <DropZone onFilesSelected={handleFilesSelected} />
            )}

            {mode === 'single' && (
              <SingleCompressor
                file={file}
                fileMeta={fileMeta}
                compressedFile={compressedFile}
                compressedMeta={compressedMeta}
                isCompressing={isCompressing}
                quality={quality}
                setQuality={setQuality}
                convertToWebP={convertToWebP}
                setConvertToWebP={setConvertToWebP}
                onCompress={handleCompressSingle}
                onReset={handleReset}
              />
            )}

            {mode === 'batch' && (
              <BatchCompressor
                files={files}
                batchItems={batchItems}
                isCompressing={isCompressing}
                globalQuality={globalQuality}
                setGlobalQuality={setGlobalQuality}
                globalWebP={globalWebP}
                setGlobalWebP={setGlobalWebP}
                onCompressAll={handleCompressBatch}
                onReset={handleReset}
                onRemoveItem={handleRemoveBatchItem}
                onUpdateItemQuality={handleUpdateItemQuality}
                onUpdateItemWebP={handleUpdateItemWebP}
              />
            )}
          </div>

          {/* Sidebar Stats and Impact dashboard */}
          <div className="lg:col-span-4">
            <CompressionHistory
              history={history}
              onClearHistory={() => setHistory([])}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800/80 bg-white/50 dark:bg-darkbg-300/50 py-8 transition-colors duration-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span>100% Client-Side • Secure Offline Image Compression</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} OptiPress. Built with React & Tailwind CSS.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
