"use client";

import { forwardRef, CSSProperties, useEffect, useState } from "react";
import cn from "@/lib/clsx";

interface CanvasProps {
  width: number;
  height: number;
  canvasid: string;
  className?: string;
  style?: CSSProperties;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ width, height, canvasid, className, style }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    return (
      <div
        className={cn(
          "relative canvas-container transition-all duration-500",
          isVisible ? "opacity-100" : "opacity-0",
          className,
        )}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          ...style,
        }}
      >
        <canvas
          id={canvasid}
          width={width}
          height={height}
          ref={ref}
          className={cn(
            "rounded-lg transition-all duration-500",
            isVisible ? "scale-100" : "scale-95",
          )}
        ></canvas>
      </div>
    );
  },
);

Canvas.displayName = "Canvas";

export default Canvas;
