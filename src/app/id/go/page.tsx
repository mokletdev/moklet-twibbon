import { Props } from "@/hooks/useValidateFrameUrl";
import { Metadata } from "next";
import { Footer } from "../../_components/footer";
import { H2 } from "../../_components/global/text";
import TwibbonForm from "./_components/form";

interface MetadataProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function generateMetadata({ searchParams }: MetadataProps): Metadata {
  const title = searchParams.title?.toString();

  return {
    title: title ?? "Twibbon Kustom",
  };
}

export default function GoPage({ searchParams }: Readonly<Props>) {
  return (
    <>
      <section className="py-6 flex justify-center items-center flex-col space-y-4 md:space-y-6">
        <H2 className="text-primary-500">
          {searchParams?.title ?? "Twibbon Kustom"}
        </H2>
        <TwibbonForm searchParams={searchParams} />
      </section>
      <Footer />
    </>
  );
}

export const dynamic = "force-dynamic";
