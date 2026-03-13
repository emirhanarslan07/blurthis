export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const drawImageOnCanvas = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement
) => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
};

export const applyBlurToRect = (
    ctx: CanvasRenderingContext2D,
    rect: Rect,
    blurAmount: number = 12
) => {
    ctx.save();

    // Create a temporary path for the rectangle
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.clip();

    // Apply blur filter
    ctx.filter = `blur(${blurAmount}px)`;

    // Re-draw the area onto itself to apply blur
    // We draw the original image part again
    ctx.drawImage(
        ctx.canvas,
        rect.x - blurAmount * 2, rect.y - blurAmount * 2, rect.width + blurAmount * 4, rect.height + blurAmount * 4,
        rect.x - blurAmount * 2, rect.y - blurAmount * 2, rect.width + blurAmount * 4, rect.height + blurAmount * 4
    );

    ctx.restore();
    ctx.filter = 'none';
};
