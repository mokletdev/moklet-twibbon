import { Button } from "./_components/global/button";
import Image from "./_components/global/image";
import { TextField } from "./_components/global/input";
import { P } from "./_components/global/text";

export default function Home() {
  return (
    <div className="text-center w-screen h-screen flex items-center justify-center flex-col gap-4 p-6">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={"/horizontal.svg"}
          alt="Logo Moklet.org"
          width={190}
          height={46}
        />
      </div>
      <P>
        Have you ever tired of your twibbon having a watermark on it? We, Moklet
        Developers, a patriotic Mokleters, provides you with a custom solution.
      </P>
      <form
        action="/go"
        method="get"
        className="px-6 py-4 min-w-[200px] md:min-w-[344px] max-w-xl rounded-md bg-white flex flex-col space-y-6"
      >
        <TextField type="url" name="frameUrl" required label="Frame URL" />
        <Button variant={"primary"}>Go</Button>
      </form>
    </div>
  );
}
