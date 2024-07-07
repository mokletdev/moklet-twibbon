import { Button } from "./global/Button";
import { TextField } from "./global/Input";
import { H1, P } from "./global/Text";

export default function Home() {
  return (
    <div className="text-center w-screen h-screen flex items-center justify-center flex-col gap-4 p-6">
      <H1>Moklet Twibbon</H1>
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
