'use client';

import React from 'react';
import { Undo, Trash2, Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
    onUndo: () => void;
    onClear: () => void;
    onDownload: () => void;
    canUndo: boolean;
    onReset: () => void;
    labels: {
        undo: string;
        clear: string;
        new: string;
        download: string;
    };
}

export const Toolbar: React.FC<ToolbarProps> = ({
    onUndo,
    onClear,
    onDownload,
    canUndo,
    onReset,
    labels
}) => {
    return (
        <div className="flex items-center gap-2 p-2 glass rounded-2xl border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onUndo}
                disabled={!canUndo}
                className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200",
                    canUndo
                        ? "hover:bg-white/5 active:scale-95 text-foreground"
                        : "opacity-30 cursor-not-allowed text-muted"
                )}
                title={labels.undo}
            >
                <Undo className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{labels.undo}</span>
            </button>

            <button
                onClick={onClear}
                disabled={!canUndo}
                className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200",
                    canUndo
                        ? "hover:bg-white/5 active:scale-95 text-foreground"
                        : "opacity-30 cursor-not-allowed text-muted"
                )}
                title={labels.clear}
            >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{labels.clear}</span>
            </button>

            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/5 active:scale-95 text-foreground transition-all duration-200"
                title={labels.new}
            >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{labels.new}</span>
            </button>

            <button
                onClick={onDownload}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 active:scale-95 text-accent-foreground font-semibold transition-all duration-200 shadow-lg shadow-accent/20"
            >
                <Download className="w-4 h-4" />
                <span className="text-sm">{labels.download}</span>
            </button>
        </div>
    );
};
