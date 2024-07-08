"use client";
import { Button } from "@/app/_components/global/button";
import { useTwibbonCanvas } from "@/hooks/useTwibbonCanvas";
import cn from "@/lib/clsx";
import ClipboardJS from "clipboard";
import { useEffect, useRef, useState } from "react";
import { FaFileImage } from "react-icons/fa";
import { FaCopy, FaDownload } from "react-icons/fa6";
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
  const [scale, setScale] = useState<number>(0.5);

  useEffect(() => {
    const clipboard = new ClipboardJS("#copy-btn");

    clipboard.on("success", (e) => {
      toast.success("Copied caption successfully!");
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
    }

    canvasHook.addBackground(frameUrl!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasHook]);

  useEffect(() => {
    canvasHook.setScaled(scale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
      <div className="flex justify-center items-center space-y-4 flex-col">
        <Canvas
          width={canvasHook.recommendedSize.width}
          height={canvasHook.recommendedSize.height}
          canvasid="twibbon"
          ref={canvasHook.canvasRef}
        />
        <div
          className={cn(
            "w-full flex flex-col items-center gap-4 mt-10 justify-center",
            !fileName ? "hidden" : null
          )}
        >
          <label
            htmlFor="zoom"
            className="text-lg font-semibold text-slate-600"
          >
            Zoom {(Math.round((scale + Number.EPSILON) * 100) / 100).toString()}
            x
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant={"primary"}
              onClick={() => setScale((prev) => prev - 0.01)}
            >
              -
            </Button>
            <input
              id="zoom"
              type="range"
              min="0.01"
              max="5"
              step="0.01"
              value={scale}
              onChange={(e) => {
                setScale(parseFloat(e.currentTarget.value));
              }}
              className="w-full bg-red-500"
            />
            <Button
              variant={"primary"}
              onClick={() => setScale((prev) => prev + 0.01)}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center mx-auto">
        <input
          type="file"
          id="foto"
          accept="image/png, image/jpeg, image/jpg"
          onChange={async (ev) => {
            setFileName(ev.currentTarget.files?.[0]?.name);

            if (ev.currentTarget.files?.length) {
              canvasHook.addFrame(
                URL.createObjectURL(ev.currentTarget.files[0])
              );
            }
          }}
          hidden
        />
        <label
          htmlFor="foto"
          className="flex items-center gap-2 truncate max-w-[18rem] md:max-w-sm py-1 px-2 lg:py-2 lg:px-4 rounded-md border-0 lg:text-lg text-md font-semibold bg-red-100 text-red-700 hover:bg-red-300 cursor-pointer duration-100"
        >
          <FaFileImage /> {fileName ?? "Choose image"}
        </label>
      </div>
      <div className="space-x-4 flex items-center justify-center">
        <Button
          onClick={() => {
            const data = canvasHook.toDataUrl();

            if (data) {
              downloadURI(
                data,
                `Twibbon ${searchParams?.title ?? "Moklet"}.jpg`
              );
            }
          }}
          variant={"primary"}
          className="flex items-center gap-2"
        >
          <FaDownload /> Download
        </Button>
        {searchParams?.caption && (
          <>
            <Button
              id="copy-btn"
              variant={"quartiary"}
              className="flex items-center gap-2"
              data-clipboard-text="hello there"
              data-clipboard-action="copy"
            >
              <FaCopy /> Caption
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
