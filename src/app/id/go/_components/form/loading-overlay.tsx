import React from "react";
import { FaSpinner } from "react-icons/fa";
import { P } from "@/app/_components/global/text";

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-md">
      <div className="text-white flex flex-col items-center">
        <FaSpinner className="animate-spin text-4xl mb-2" />
        <P className="text-white">Memuat...</P>
      </div>
    </div>
  );
};

export default LoadingOverlay;
