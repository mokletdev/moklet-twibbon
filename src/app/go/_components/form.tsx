"use client";
import { Button } from "@/app/_components/global/button";
import { P } from "@/app/_components/global/text";
import { useTwibbonCanvas } from "@/hooks/useTwibbonCanvas";
import cn from "@/lib/clsx";
import ClipboardJS from "clipboard";
import { useCallback, useEffect, useState } from "react";
import { FaFileImage, FaSearch, FaUndo, FaRedo, FaShare } from "react-icons/fa";
import { FaCopy, FaDownload, FaSpinner } from "react-icons/fa6";
import {
  MdBrightness6,
  MdContrast,
  MdFileUpload,
  MdSettings,
  MdShare,
} from "react-icons/md";
import { toast } from "sonner";
import Canvas from "./canvas";

interface Props {
  searchParams: {
    title?: string;
    frameUrl?: string;
    caption?: string;
    slug?: string;
  };
}

function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Form({ searchParams }: Readonly<Props>) {
  const { frameUrl } = searchParams;
  const canvasHook = useTwibbonCanvas();

  const [fileName, setFileName] = useState<string>();
  const [scale, setScale] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [editHistory, setEditHistory] = useState<
    Array<{
      scale: number;
      brightness: number;
      contrast: number;
    }>
  >([{ scale: 1, brightness: 0, contrast: 0 }]);

  const addToHistory = useCallback(
    (scale: number, brightness: number, contrast: number) => {
      setEditHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, { scale, brightness, contrast }];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
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
  }, [historyIndex, editHistory]);

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
  }, [historyIndex, editHistory]);

  const applyImageFilters = useCallback(
    (brightnessValue: number, contrastValue: number) => {
      if (!canvasHook.fabricCanvas) return;

      canvasHook.applyImageFilters(brightnessValue, contrastValue);
    },
    [canvasHook],
  );

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
        { type: "image/jpeg" },
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

  const handleBrightnessChange = useCallback(
    (value: number) => {
      setBrightness(value);
      applyImageFilters(value, contrast);
      addToHistory(scale, value, contrast);
    },
    [scale, contrast, applyImageFilters, addToHistory],
  );

  const handleContrastChange = useCallback(
    (value: number) => {
      setContrast(value);
      applyImageFilters(brightness, value);
      addToHistory(scale, brightness, value);
    },
    [scale, brightness, applyImageFilters, addToHistory],
  );

  const handleScaleChange = useCallback(
    (newScale: number) => {
      setScale(newScale);
      addToHistory(newScale, brightness, contrast);
    },
    [brightness, contrast, addToHistory],
  );

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

  useEffect(() => {
    if (searchParams?.slug) {
      window.history.pushState({}, "", `/${searchParams?.slug}`);
      localStorage.setItem(searchParams.slug, JSON.stringify(searchParams));
    }

    setIsLoading(true);
    canvasHook
      .addBackground(frameUrl!)
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false);
        toast.error("Failed to load frame. Please try again.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    canvasHook.setScaled(scale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

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

              setEditHistory([{ scale, brightness: 0, contrast: 0 }]);
              setHistoryIndex(0);
              setBrightness(0);
              setContrast(0);
            })
            .catch(() => {
              setIsLoading(false);
              toast.error("Failed to load image. Please try again.");
            });
        } else {
          toast.error("Please upload an image file.");
        }
      }
    },
    [scale],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

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

  const handleUploadClick = useCallback(() => {
    if (!fileName) {
      document.getElementById("foto")?.click();
    }
  }, [fileName]);

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm">
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-md">
          <div className="text-white flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl mb-2" />
            <P className="text-white">Loading...</P>
          </div>
        </div>
      )}
      <div
        className={cn(
          "z-[1000] relative flex justify-center items-center flex-col space-y-4 w-full rounded-lg overflow-hidden transition-all duration-300 group",
          isDragging
            ? "bg-blue-50 border-2 border-dashed border-blue-300 scale-[0.99]"
            : fileName
            ? "border-none shadow-sm"
            : "border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleUploadClick}
      >
        <Canvas
          width={canvasHook.recommendedSize.width}
          height={canvasHook.recommendedSize.height}
          canvasid="twibbon"
          ref={canvasHook.canvasRef}
          className="group-hover:opacity-95 transition-all duration-300"
        />

        {!fileName && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-60 transition-opacity group-hover:bg-opacity-90 cursor-pointer">
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
      {fileName && (
        <div className="flex justify-center gap-3 mt-2">
          <Button
            variant="quartiary"
            onClick={handleUndo}
            disabled={historyIndex <= 0 || isLoading}
            className="!rounded-md !px-3 !py-2 shadow-sm hover:shadow transition-all duration-200"
            title="Undo"
          >
            <FaUndo />
          </Button>
          <Button
            variant="quartiary"
            onClick={handleRedo}
            disabled={historyIndex >= editHistory.length - 1 || isLoading}
            className="!rounded-md !px-3 !py-2 shadow-sm hover:shadow transition-all duration-200"
            title="Redo"
          >
            <FaRedo />
          </Button>
        </div>
      )}
      {fileName && (
        <>
          <div className="w-full bg-gray-50 p-4 rounded-xl shadow-inner">
            <div className="grid grid-cols-1 gap-5">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="zoom"
                    className="text-sm font-medium text-slate-700 flex items-center"
                  >
                    <FaSearch className="h-4 w-4 mr-1" />
                    Zoom
                  </label>
                  <span className="text-sm bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                    {(Math.round((scale + Number.EPSILON) * 100) / 100).toFixed(
                      2,
                    )}
                    x
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="quartiary"
                    onClick={() =>
                      handleScaleChange(Math.max(0.2, scale - 0.05))
                    }
                    className="!rounded-lg !px-2 !py-1 !text-sm !bg-white shadow-sm"
                  >
                    -
                  </Button>
                  <input
                    id="zoom"
                    type="range"
                    min="0.2"
                    max="3"
                    step="0.01"
                    value={scale}
                    onChange={(e) =>
                      handleScaleChange(parseFloat(e.currentTarget.value))
                    }
                    className="w-full h-2 flex-1 bg-primary-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <Button
                    variant="quartiary"
                    onClick={() => handleScaleChange(Math.min(3, scale + 0.05))}
                    className="!rounded-lg !px-2 !py-1 !text-sm !bg-white shadow-sm"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 md:flex-row flex-col">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="brightness"
                      className="text-sm font-medium text-slate-700 flex items-center"
                    >
                      <MdBrightness6 className="mr-1" /> Brightness
                    </label>
                    <span className="text-sm bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                      {brightness.toFixed(2)}
                    </span>
                  </div>
                  <input
                    id="brightness"
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.01"
                    value={brightness}
                    onChange={(e) =>
                      handleBrightnessChange(parseFloat(e.currentTarget.value))
                    }
                    className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="contrast"
                      className="text-sm font-medium text-slate-700 flex items-center"
                    >
                      <MdContrast className="mr-1" /> Contrast
                    </label>
                    <span className="text-sm bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                      {contrast.toFixed(2)}
                    </span>
                  </div>
                  <input
                    id="contrast"
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.01"
                    value={contrast}
                    onChange={(e) =>
                      handleContrastChange(parseFloat(e.currentTarget.value))
                    }
                    className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-3">
            <Button
              variant="quartiary"
              onClick={() => document.getElementById("foto")?.click()}
              className="flex items-center gap-2 !py-2 !px-4 !rounded-lg text-sm shadow-sm hover:shadow transition-all duration-200"
            >
              <FaFileImage size={14} /> Change Image
            </Button>
          </div>
        </>
      )}
      <div className="hidden">
        <input
          type="file"
          id="foto"
          accept="image/png, image/jpeg, image/jpg"
          onChange={async (ev) => {
            if (ev.currentTarget.files?.length) {
              setFileName(ev.currentTarget.files[0].name);
              setIsLoading(true);

              try {
                await canvasHook.addFrame(
                  URL.createObjectURL(ev.currentTarget.files[0]),
                );

                setEditHistory([{ scale, brightness: 0, contrast: 0 }]);
                setHistoryIndex(0);
                setBrightness(0);
                setContrast(0);
              } catch (error) {
                toast.error("Failed to load image. Please try again.");
              } finally {
                setIsLoading(false);
              }
            }
          }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        <Button
          onClick={handleDownload}
          variant="primary"
          className="flex items-center gap-2 !py-3 !px-6 shadow hover:shadow-md !rounded-lg transition-all duration-200 transform hover:translate-y-[-2px]"
          disabled={!fileName || isDownloading || isLoading}
        >
          {isDownloading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaDownload />
          )}{" "}
          Download Image
        </Button>
        {searchParams?.caption && (
          <Button
            variant="quartiary"
            className="copy-btn flex items-center gap-2 !py-3 !px-6 shadow hover:shadow-md !rounded-lg transition-all duration-200 transform hover:translate-y-[-2px]"
            data-clipboard-text={searchParams.caption}
            data-clipboard-action="copy"
            disabled={isLoading}
          >
            <FaCopy /> Copy Caption
          </Button>
        )}
        <Button
          onClick={handleShare}
          variant="secondary"
          className="copy-btn flex items-center gap-2 !py-3 !px-6 shadow hover:shadow-md !rounded-lg transition-all duration-200 transform hover:translate-y-[-2px]"
          data-clipboard-text={searchParams.caption}
          data-clipboard-action="copy"
          disabled={!fileName || isLoading}
        >
          <FaShare /> Share
        </Button>
      </div>
      {!fileName && (
        <div className="mt-6 text-center bg-gradient-to-r from-primary-50 to-blue-50 p-5 rounded-xl">
          <h4 className="text-lg font-bold text-primary-600 mb-3">
            How to use:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-primary-100 text-primary-500 rounded-full p-3 mb-2">
                <MdFileUpload size={24} />
              </div>
              <p className="text-sm text-slate-700 text-center">
                Upload your photo
              </p>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-primary-100 text-primary-500 rounded-full p-3 mb-2">
                <MdSettings size={24} />
              </div>
              <p className="text-sm text-slate-700 text-center">
                Adjust position and style
              </p>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-primary-100 text-primary-500 rounded-full p-3 mb-2">
                <FaDownload size={24} />
              </div>
              <p className="text-sm text-slate-700 text-center">
                Download your image
              </p>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-primary-100 text-primary-500 rounded-full p-3 mb-2">
                <MdShare size={24} />
              </div>
              <p className="text-sm text-slate-700 text-center">
                Share on social media
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
