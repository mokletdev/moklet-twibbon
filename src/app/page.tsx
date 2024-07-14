"use client";
import { useState } from "react";
import { FaFileImage } from "react-icons/fa";
import { LinkButton } from "./_components/global/button";
import { H1, P } from "./_components/global/text";

export default function Home() {
  const [fileName, setFileName] = useState<string>();

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col gap-12 p-6">
      <div className="w-full md:w-1/2">
        <H1 className="mb-[18px]">
          <span className="text-primary-500">Moklet Twibbon,</span> Solusi
          Membuat Campaign Gratis tanpa Watermark
        </H1>
        <P>
          Pernahkah Anda merasa bosan dengan twibbon Anda yang memiliki
          watermark? Kami,{" "}
          <span className="text-primary-500">Moklet Developers</span>, Mokleters
          yang patriotik, menyediakan solusi khusus untuk Anda.
        </P>
      </div>
      <div className="flex md:items-center gap-2 w-full md:w-1/2 flex-col md:flex-row">
        <input
          type="file"
          id="frame"
          name="frame"
          accept="image/png"
          onChange={(e) => {
            const file = e.target?.files?.[0];

            if (file) {
              setFileName(file.name);

              const reader = new FileReader();
              reader.onloadend = () => {
                const result = reader.result as string;
                localStorage.setItem("customFrameUrl", result);
              };
              reader.readAsDataURL(file);
            }
          }}
          hidden
        />
        <label
          htmlFor="frame"
          className="flex items-center gap-2 truncate max-w-full md:max-w-xs py-1 px-2 lg:py-2 lg:px-4 rounded-md border-0 lg:text-lg text-md font-semibold bg-red-100 text-red-700 hover:bg-red-300 cursor-pointer duration-100"
        >
          <FaFileImage /> {fileName ?? "Pilih frame"}
        </label>
        <LinkButton
          className="text-center"
          href="/go?slug=custom-twibbon"
          variant={"primary"}
        >
          Buat twibbon!
        </LinkButton>
      </div>
    </div>
  );
}
