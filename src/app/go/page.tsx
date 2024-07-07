import { Metadata } from "next";
import { H2 } from "../global/Text";
import Form from "./_components/Form";
import { isValidImageUrl } from "@/utils/validator";

interface MetadataProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const title = searchParams.title?.toString();

  return {
    title: title ?? "Moklet Twibbon",
  };
}

interface Props {
  searchParams: {
    title?: string;
    frameUrl?: string;
    caption?: string;
    slug?: string;
  };
}

export default function GoPage({ searchParams }: Readonly<Props>) {
  return (
    <section className="py-6 flex justify-center items-center flex-col space-y-4 md:space-y-6">
      <H2>{searchParams?.title ?? "Twibbon"}</H2>
      {searchParams?.frameUrl && isValidImageUrl(searchParams.frameUrl) ? (
        <Form searchParams={searchParams} />
      ) : (
        <H2>A valid frame URL is required!</H2>
      )}
    </section>
  );
}

export const dynamic = "force-dynamic";
