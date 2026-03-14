'use client';

import { useEffect, useState } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { BlurCanvas } from '@/components/BlurCanvas';
import { Toolbar } from '@/components/Toolbar';
import { Ghost, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [historyLength, setHistoryLength] = useState(0);
  const [undoTrigger, setUndoTrigger] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);

  // Global drag-and-drop protection
  useEffect(() => {
    const preventDefault = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);

    return () => {
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', preventDefault);
    };
  }, []);

  const handleImageUpload = (img: HTMLImageElement) => {
    setImage(img);
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `blurthis-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-6 md:px-12 selection:bg-accent/30 tracking-tight">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-12 max-w-4xl text-center"
          >
            <header className="space-y-6 text-center flex flex-col items-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter gradient-text whitespace-pre-line text-center">
                Blurthis instantly blurs sensitive data in screenshots.
              </h1>
              <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed text-center opacity-90">
                Zero setup. Zero tracking. Just drag, select, and download. Perfect for developers and builders sharing on Twitter.
              </p>
            </header>

            <UploadZone
              onImageUpload={handleImageUpload}
              label="Upload Screenshot"
              subLabel="Drag and drop or click to upload"
              privacyText="Privacy first: Processing happens in your browser"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
              {[
                { 
                  icon: Ghost, 
                  title: "Privacy First", 
                  desc: "No data ever leaves your computer. Everything stays in your browser." 
                },
                { 
                  icon: ShieldCheck, 
                  title: "Zero Dependencies", 
                  desc: "Native Canvas API for maximum speed and zero tracking scripts." 
                },
                { 
                  icon: UploadIcon, 
                  title: "Pure Workflow", 
                  desc: "Optimized for speed. Drag, select a region, download as PNG." 
                }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center gap-4 p-8 rounded-[2rem] border border-border bg-surface/30 backdrop-blur-sm hover:bg-surface/50 transition-colors duration-300">
                  <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                    <feature.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-base text-muted leading-relaxed text-center">{feature.desc}</p>
                </div>
              ))}
            </div>

            <footer className="mt-12 text-sm text-muted/50 font-mono">
              built with precision · blurthis.realseye.com
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 w-full max-w-7xl animate-in fade-in zoom-in-95 duration-700"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                  <Ghost className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Blur Editor</h2>
                  <p className="text-xs text-muted">Select regions to blur sensitive content</p>
                </div>
              </div>

              <Toolbar
                onUndo={() => setUndoTrigger(prev => prev + 1)}
                onClear={() => setClearTrigger(prev => prev + 1)}
                onDownload={handleDownload}
                canUndo={historyLength > 1}
                onReset={() => setImage(null)}
                labels={{
                  undo: "Undo",
                  clear: "Clear",
                  new: "New Image",
                  download: "Download PNG"
                }}
              />
            </div>

            <div className="w-full h-full flex items-center justify-center min-h-[50vh] p-4 lg:p-8 rounded-[2rem] border border-border bg-surface/50 backdrop-blur-xl">
              <BlurCanvas
                image={image}
                onHistoryChange={setHistoryLength}
                undoTrigger={undoTrigger}
                clearTrigger={clearTrigger}
                onDownload={() => { }}
              />
            </div>

            <div className="flex items-center gap-2 text-[10px] text-muted uppercase tracking-[0.2em] font-medium opacity-50">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Processing locally in-browser
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const UploadIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);
