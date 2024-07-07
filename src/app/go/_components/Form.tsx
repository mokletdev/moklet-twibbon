"use client";
import { useTwibbonCanvas } from "@/hooks/useTwibbonCanvas";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { Button } from "@/app/global/Button";
import cn from "@/lib/clsx";
import { TextField } from "@/app/global/Input";
import { FaFileImage } from "react-icons/fa";

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
  const [scale, setScale] = useState<number>(0.1);

  useEffect(() => {
    if (searchParams?.slug) {
      window.history.pushState({}, "", `/${searchParams?.slug}`);
    }

    canvasHook.addBackground(frameUrl!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasHook]);

  useEffect(() => {
    canvasHook.setScaled(scale);
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
            Zoom
          </label>
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
          <TextField
            type="number"
            handleChange={(e) => {
              setScale(parseFloat(e.currentTarget.value) / 100);
            }}
            value={parseInt((scale * 100).toString()).toString()}
            className="w-[15%]"
          />
        </div>
      </div>
      <div className="flex flex-row items-center mx-auto">
        <input
          type="file"
          id="foto"
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
        >
          Download
        </Button>
        {searchParams?.caption && (
          <Button
            onClick={() => {
              navigator.clipboard.writeText(searchParams.caption as string);
              alert("Caption sukses disalin!");
            }}
            variant={"primary"}
            className="bg-gray-600 hover:bg-gray-400"
          >
            Copy Caption
          </Button>
        )}
      </div>
    </div>
  );
}
