import React, { useState, useRef } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const handleMove = (clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    const handleMouseMove = (e) => {
        if (isDragging.current) handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
        if (isDragging.current) handleMove(e.touches[0].clientX);
    };

    const startDrag = () => (isDragging.current = true);
    const stopDrag = () => (isDragging.current = false);

    return (
        <div
            className="relative w-full h-full select-none overflow-hidden"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchEnd={stopDrag}
        >
            <div ref={containerRef} className="relative w-full h-full">
                {/* After Image (Background) */}
                <img
                    src={afterImage}
                    alt="After"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                <div className="absolute top-4 right-4 bg-primary/80 text-white px-2 py-1 rounded text-xs z-20 pointer-events-none">
                    Edited
                </div>

                {/* Before Image (Foreground - Clipped) */}
                <div
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img
                        src={beforeImage}
                        alt="Before"
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        Original
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={startDrag}
                    onTouchStart={startDrag}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-black font-bold text-xs opacity-90 hover:scale-110 transition-transform">
                        ⇄
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
