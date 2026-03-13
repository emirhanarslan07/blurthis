'use client';

import React, { useRef, useState } from 'react';
import { Upload, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
    onImageUpload: (img: HTMLImageElement) => void;
    label: string;
    subLabel: string;
    privacyText: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
    onImageUpload,
    label,
    subLabel,
    privacyText
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file (PNG, JPG, etc.).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => onImageUpload(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const onDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Only set to false if we are leaving the main container, 
        // not just moving between children
        if (e.currentTarget === e.target) {
            setIsDragging(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div
            className={cn(
                "relative group cursor-pointer transition-all duration-300",
                "w-full max-w-xl aspect-[16/10] rounded-3xl border-2 border-dashed",
                "flex flex-col items-center justify-center gap-4",
                isDragging
                    ? "border-accent bg-accent/10 scale-[1.02] shadow-2xl shadow-accent/20"
                    : "border-border hover:border-accent/50 bg-surface/50"
            )}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            <div className="p-6 rounded-full bg-surface border border-border group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-10 h-10 text-accent" />
            </div>

            <div className="text-center px-6">
                <h3 className="text-2xl font-bold mb-2 tracking-tight">{label}</h3>
                <p className="text-muted text-base opacity-80">{subLabel}</p>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-accent font-medium uppercase tracking-wider bg-accent/5 px-4 py-1.5 rounded-full border border-accent/20 backdrop-blur-md whitespace-nowrap group-hover:bg-accent/10 transition-colors duration-300">
                <ShieldAlert className="w-3.5 h-3.5" />
                {privacyText}
            </div>

            {/* Glow Effect */}
            <div className="absolute -z-10 inset-0 bg-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
    );
};
