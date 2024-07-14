import { Metadata } from "next";
import { H2 } from "../_components/global/text";
import RenderForm, { Props } from "./_components/render-form";

interface MetadataProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function generateMetadata({ searchParams }: MetadataProps): Metadata {
  const title = searchParams.title?.toString();

  return {
    title: title ?? "Custom Twibbon",
  };
}

export default function GoPage({ searchParams }: Readonly<Props>) {
  return (
    <section className="py-6 flex justify-center items-center flex-col space-y-4 md:space-y-6">
      <H2>{searchParams?.title ?? "Twibbon"}</H2>
      <RenderForm searchParams={searchParams} />
    </section>
  );
}

export const dynamic = "force-dynamic";
