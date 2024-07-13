import { Button } from "./_components/global/button";
import { TextField } from "./_components/global/input";
import { H1, P } from "./_components/global/text";

export default function Home() {
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col gap-12 p-6">
      <div className="w-1/2">
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
      <form action="/go" method="get" className="flex items-center gap-2 w-1/2">
        <TextField
          type="url"
          name="frameUrl"
          required
          placeholder="Frame URL"
        />
        <Button variant={"primary"}>Buat twibbon!</Button>
      </form>
    </div>
  );
}
