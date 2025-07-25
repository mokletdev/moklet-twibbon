import { P } from "@/app/_components/global/text";
import cn from "@/lib/clsx";
import React from "react";
import { FaFileImage } from "react-icons/fa";
import Canvas from "./canvas";

interface UploadAreaProps {
  isDragging: boolean;
  fileName: string | undefined;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasWidth: number;
  canvasHeight: number;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onClick: () => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ isDragging, fileName, canvasRef, canvasWidth, canvasHeight, onDrop, onDragOver, onDragLeave, onClick }) => {
  return (
    <div
      className={cn(
        "z-[1000] relative flex justify-center items-center flex-col space-y-4 w-fit h-fit mx-auto rounded-lg transition-all duration-300 group",
        isDragging ? "bg-blue-50 border-2 border-dashed border-blue-300 scale-[0.99]" : fileName ? "border-none shadow-sm" : "border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer"
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      <Canvas width={canvasWidth} height={canvasHeight} canvasid="twibbon" ref={canvasRef} className="group-hover:opacity-95 transition-all duration-300" />

      {!fileName && canvasRef.current && (
        <div className="absolute inset-0 flex -top-4 items-center justify-center bg-gray-50 bg-opacity-60 transition-opacity group-hover:bg-opacity-90 cursor-pointer">
          <div className="text-center p-6 rounded-xl transition-all duration-300 transform group-hover:scale-105">
            <div className="mb-3 bg-primary-100 text-primary-500 rounded-full p-3 inline-block">
              <FaFileImage size={24} />
            </div>
            <P className="text-gray-600 font-medium">
              Drag & drop an image here
              <br />
              or click to upload
            </P>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
