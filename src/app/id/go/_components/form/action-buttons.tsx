import { Button } from "@/app/_components/global/button";
import React from "react";
import { FaCopy, FaDownload, FaShare, FaSpinner } from "react-icons/fa6";

interface ActionButtonsProps {
  fileName: string | undefined;
  isDownloading: boolean;
  isLoading: boolean;
  caption?: string;
  onDownload: () => void;
  onShare: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  fileName,
  isDownloading,
  isLoading,
  caption,
  onDownload,
  onShare,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
      <Button
        onClick={onDownload}
        variant="primary"
        className="flex items-center gap-2 !py-3 !px-6 shadow hover:shadow-md !rounded-lg transition-all duration-200 transform hover:translate-y-[-2px]"
        disabled={!fileName || isDownloading || isLoading}
      >
        {isDownloading ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <FaDownload />
        )}{" "}
        Unduh Gambar
      </Button>
      {caption && (
        <Button
          variant="quartiary"
          className="copy-btn flex items-center gap-2 !py-3 !px-6 shadow hover:shadow-md !rounded-lg transition-all duration-200 transform hover:translate-y-[-2px]"
          data-clipboard-text={decodeURIComponent(caption)}
          data-clipboard-action="copy"
          disabled={isLoading}
        >
          <FaCopy /> Salin Caption
        </Button>
      )}
      <Button
        onClick={onShare}
        variant="secondary"
        className="flex items-center gap-2 !py-3 !px-6 shadow hover:shadow-md !rounded-lg transition-all duration-200 transform hover:translate-y-[-2px]"
        disabled={!fileName || isLoading}
      >
        <FaShare /> Bagikan
      </Button>
    </div>
  );
};

export default ActionButtons;
