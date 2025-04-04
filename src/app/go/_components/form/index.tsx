"use client";

import { H1 } from "@/app/_components/global/text";
import { OBJECT_NAMES, useTwibbonCanvas } from "@/hooks/useTwibbonCanvas";
import ClipboardJS from "clipboard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Props, useValidateFrameUrl } from "@/hooks/useValidateFrameUrl";
import ActionButtons from "./action-buttons";
import EditingControls from "./editing-controls";
import HelpSection from "./help-section";
import HiddenFileInput from "./hidden-file-input";
import LoadingOverlay from "./loading-overlay";
import UploadArea from "./upload-area";

interface EditHistoryItem {
  scale: number;
  brightness: number;
  contrast: number;
}

/**
 * Helper function to trigger a download of a data URI
 * @param uri - Data URI of the image to download
 * @param name - Filename for the downloaded file
 */
function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Twibbon Form component for image editing with frame overlay
 *
 * This component handles both validation of the frame URL and provides a UI for users to:
 * - Upload an image
 * - Adjust the image (scale, brightness, contrast)
 * - Download the resulting image with a frame overlay
 * - Share the image on social media
 *
 * @param props - Component props
 * @returns React component
 */
export default function TwibbonForm({ searchParams }: Readonly<Props>) {
  // Validate frame URL or retrieve from localStorage
  const validatedParams = useValidateFrameUrl(searchParams);

  // If there's no valid frame URL, return error message
  if (!validatedParams?.frameUrl) {
    return <H1>There is no frame URL available!</H1>;
  }

  // Proceed with the form rendering using validated parameters
  return <TwibbonFormContent searchParams={validatedParams} />;
}

/**
 * Main content component for the Twibbon form
 */
const TwibbonFormContent = ({
  searchParams,
}: Readonly<{ searchParams: Props["searchParams"] }>) => {
  const frameUrl = useMemo(() => {
    const { frameUrl } = searchParams;
    if (!frameUrl) return localStorage.getItem("customFrameUrl");

    return frameUrl;
  }, [searchParams]);
  const canvasHook = useTwibbonCanvas();

  // State management
  const [fileName, setFileName] = useState<string>();
  const [scale, setScale] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [editHistory, setEditHistory] = useState<EditHistoryItem[]>([
    { scale: 1, brightness: 0, contrast: 0 },
  ]);

  // Image filter application
  const applyImageFilters = useCallback(
    (brightnessValue: number, contrastValue: number) => {
      if (!canvasHook.fabricCanvas) return;
      canvasHook.applyImageFilters(brightnessValue, contrastValue);
    },
    [canvasHook]
  );

  // History management
  const addToHistory = useCallback(
    (scale: number, brightness: number, contrast: number) => {
      setEditHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, { scale, brightness, contrast }];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const {
        scale: prevScale,
        brightness: prevBrightness,
        contrast: prevContrast,
      } = editHistory[newIndex];

      setScale(prevScale);
      setBrightness(prevBrightness);
      setContrast(prevContrast);
      setHistoryIndex(newIndex);

      applyImageFilters(prevBrightness, prevContrast);
    }
  }, [historyIndex, editHistory, applyImageFilters]);

  const handleRedo = useCallback(() => {
    if (historyIndex < editHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const {
        scale: nextScale,
        brightness: nextBrightness,
        contrast: nextContrast,
      } = editHistory[newIndex];

      setScale(nextScale);
      setBrightness(nextBrightness);
      setContrast(nextContrast);
      setHistoryIndex(newIndex);

      applyImageFilters(nextBrightness, nextContrast);
    }
  }, [historyIndex, editHistory, applyImageFilters]);

  // Image adjustment handlers
  const handleBrightnessChange = useCallback(
    (value: number) => {
      setBrightness(value);
      applyImageFilters(value, contrast);
      addToHistory(scale, value, contrast);
    },
    [scale, contrast, applyImageFilters, addToHistory]
  );

  const handleContrastChange = useCallback(
    (value: number) => {
      setContrast(value);
      applyImageFilters(brightness, value);
      addToHistory(scale, brightness, value);
    },
    [scale, brightness, applyImageFilters, addToHistory]
  );

  const handleScaleChange = useCallback(
    (newScale: number) => {
      setScale(newScale);
      addToHistory(newScale, brightness, contrast);
    },
    [brightness, contrast, addToHistory]
  );

  // File handling
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (/image.*/.exec(file.type)) {
          setFileName(file.name);
          setIsLoading(true);

          canvasHook
            .addFrame(URL.createObjectURL(file))
            .then(() => {
              setIsLoading(false);
              // Reset filters and history
              setEditHistory([{ scale, brightness: 0, contrast: 0 }]);
              setHistoryIndex(0);
              setBrightness(0);
              setContrast(0);
            })
            .catch((error) => {
              console.error(error);

              setIsLoading(false);
              toast.error("Failed to load image. Please try again.");
            });
        } else {
          toast.error("Please upload an image file.");
        }
      }
    },
    [canvasHook, scale]
  );

  const handleFileUpload = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.currentTarget.files?.length) {
      setFileName(ev.currentTarget.files[0].name);
      setIsLoading(true);

      try {
        await canvasHook.addFrame(
          URL.createObjectURL(ev.currentTarget.files[0])
        );

        setEditHistory([{ scale, brightness: 0, contrast: 0 }]);
        setHistoryIndex(0);
        setBrightness(0);
        setContrast(0);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleUploadClick = useCallback(() => {
    if (!fileName) {
      document.getElementById("foto")?.click();
    }
  }, [fileName]);

  // File operations
  const handleDownload = useCallback(() => {
    setIsDownloading(true);
    try {
      const data = canvasHook.toDataUrl();
      if (data) {
        downloadURI(data, `Twibbon ${searchParams?.title ?? "Moklet"}.jpg`);
        toast.success("Image downloaded successfully!");
      } else {
        toast.error("Failed to download. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [canvasHook, searchParams?.title]);

  const handleShare = useCallback(async () => {
    if (!canvasHook.fabricCanvas) {
      toast.error("Canvas tidak tersedia. Silakan coba lagi.");
      return;
    }

    try {
      setIsLoading(true);
      const imageData = canvasHook.toDataUrl();

      if (!imageData) {
        toast.error("Gagal mendapatkan gambar. Silakan coba lagi.");
        return;
      }

      const response = await fetch(imageData);
      const blob = await response.blob();
      const imageFile = new File(
        [blob],
        `Twibbon ${searchParams?.title ?? "Moklet"}.jpg`,
        { type: "image/jpeg" }
      );

      const shareData: ShareData = {
        files: [imageFile],
        title: `Twibbon ${searchParams?.title ?? "Moklet"}`,
      };

      if (searchParams?.caption) {
        shareData.text = searchParams.caption;
      }

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Berhasil membagikan twibbon!");
      } else {
        toast.error("Browser Anda tidak mendukung fitur berbagi.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Gagal membagikan gambar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [canvasHook, searchParams?.title, searchParams?.caption]);

  // Side effects
  // Initialize clipboard for caption copying
  useEffect(() => {
    const clipboard = new ClipboardJS(".copy-btn");

    clipboard.on("success", (e) => {
      toast.success("Caption copied successfully!");
      e.clearSelection();
    });

    clipboard.on("error", (e) => {
      console.log(e);
      toast.error("Failed to copy caption!");
    });

    return () => {
      clipboard.destroy();
    };
  }, []);

  // Initialize canvas with frame
  useEffect(() => {
    if (searchParams?.slug) {
      const { slug, frameUrl } = searchParams;

      window.history.pushState({}, "", `/${slug}`);

      // Ensure frameUrl is not a data URI
      if (frameUrl?.startsWith("data:")) {
        searchParams.frameUrl = undefined;
      }

      localStorage.setItem(slug, JSON.stringify(searchParams));
    }

    if (!!frameUrl) {
      const hasBackground = canvasHook.fabricCanvas
        ?.getObjects()
        .some((obj) => (obj as any).name === OBJECT_NAMES.BACKGROUND);

      if (!hasBackground) {
        setIsLoading(true);
        canvasHook
          .addBackground(frameUrl)
          .then(() => setIsLoading(false))
          .catch((error) => {
            console.error(error);

            setIsLoading(false);
            toast.error("Failed to load frame. Please try again.");
          });
      }
    }
  }, [canvasHook, frameUrl, searchParams]);

  // Update canvas when scale changes
  useEffect(() => {
    canvasHook.setScaled(scale);
  }, [scale, canvasHook]);

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm">
      <LoadingOverlay isLoading={isLoading} />

      <UploadArea
        isDragging={isDragging}
        fileName={fileName}
        canvasRef={canvasHook.canvasRef}
        canvasWidth={canvasHook.recommendedSize.width}
        canvasHeight={canvasHook.recommendedSize.height}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleUploadClick}
      />

      {fileName && (
        <EditingControls
          scale={scale}
          brightness={brightness}
          contrast={contrast}
          historyIndex={historyIndex}
          editHistoryLength={editHistory.length}
          isLoading={isLoading}
          onScaleChange={handleScaleChange}
          onBrightnessChange={handleBrightnessChange}
          onContrastChange={handleContrastChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onChangeImage={() => document.getElementById("foto")?.click()}
        />
      )}

      <HiddenFileInput onChange={handleFileUpload} />

      <ActionButtons
        fileName={fileName}
        isDownloading={isDownloading}
        isLoading={isLoading}
        caption={searchParams?.caption}
        onDownload={handleDownload}
        onShare={handleShare}
      />

      {!fileName && <HelpSection />}
    </div>
  );
};
