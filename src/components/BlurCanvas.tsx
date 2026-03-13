'use client';

import React, { useRef, useEffect, useState } from 'react';
import { applyBlurToRect, Rect } from '@/lib/canvasUtils';

interface BlurCanvasProps {
    image: HTMLImageElement;
    onHistoryChange: (historyLength: number) => void;
    undoTrigger: number;
    clearTrigger: number;
    onDownload: (blob: Blob) => void;
}

export const BlurCanvas: React.FC<BlurCanvasProps> = ({
    image,
    onHistoryChange,
    undoTrigger,
    clearTrigger,
    onDownload
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    // Initialize canvas
    useEffect(() => {
        if (!canvasRef.current || !overlayRef.current || !image) return;

        const canvas = canvasRef.current;
        const overlay = overlayRef.current;
        const ctx = canvas.getContext('2d');
        const octx = overlay.getContext('2d');

        if (!ctx || !octx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        overlay.width = image.width;
        overlay.height = image.height;

        ctx.drawImage(image, 0, 0);
        setHistory([canvas.toDataURL()]);
    }, [image]);

    // Handle Undo
    useEffect(() => {
        if (undoTrigger === 0 || history.length <= 1) return;

        const newHistory = [...history];
        newHistory.pop();
        const lastState = newHistory[newHistory.length - 1];

        const img = new Image();
        img.onload = () => {
            const ctx = canvasRef.current?.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            ctx?.drawImage(img, 0, 0);
        };
        img.src = lastState;

        setHistory(newHistory);
        onHistoryChange(newHistory.length);
    }, [undoTrigger]);

    // Handle Clear
    useEffect(() => {
        if (clearTrigger === 0) return;
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.drawImage(image, 0, 0);
        const initialState = canvasRef.current?.toDataURL();
        if (initialState) {
            setHistory([initialState]);
            onHistoryChange(1);
        }
    }, [clearTrigger]);

    const getMousePos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        const pos = getMousePos(e, overlayRef.current!);
        setIsDrawing(true);
        setStartPos(pos);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const pos = getMousePos(e, overlayRef.current!);
        const ctx = overlayRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.setLineDash([10, 5]);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        ctx.strokeRect(
            startPos.x,
            startPos.y,
            pos.x - startPos.x,
            pos.y - startPos.y
        );
    };

    const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const pos = getMousePos(e, overlayRef.current!);
        const octx = overlayRef.current?.getContext('2d');
        octx?.clearRect(0, 0, octx.canvas.width, octx.canvas.height);

        const rect: Rect = {
            x: Math.min(startPos.x, pos.x),
            y: Math.min(startPos.y, pos.y),
            width: Math.abs(pos.x - startPos.x),
            height: Math.abs(pos.y - startPos.y)
        };

        if (rect.width < 5 || rect.height < 5) return;

        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            applyBlurToRect(ctx, rect);
            const newState = canvasRef.current?.toDataURL();
            if (newState) {
                const nextHistory = [...history, newState];
                setHistory(nextHistory);
                onHistoryChange(nextHistory.length);
            }
        }
    };

    return (
        <div className="relative inline-block max-w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
            <canvas
                ref={canvasRef}
                className="block max-w-full h-auto touch-none"
            />
            <canvas
                ref={overlayRef}
                className="absolute inset-0 block max-w-full h-auto cursor-crosshair touch-none"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            />
        </div>
    );
};
