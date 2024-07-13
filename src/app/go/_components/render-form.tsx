"use client";
import { H1, H2 } from "@/app/_components/global/text";
import { isValidImageUrl } from "@/utils/validator";
import Form from "./form";

export interface Props {
  searchParams: {
    title?: string;
    frameUrl?: string;
    caption?: string;
    slug?: string;
  };
}

export default function RenderForm({ searchParams }: Readonly<Props>) {
  if (!searchParams.frameUrl) {
    const customFrameUrl = localStorage.getItem("customFrameUrl") as
      | string
      | undefined;

    if (!customFrameUrl) return <H1>There is no frame URL available!</H1>;

    return (
      <Form searchParams={{ ...searchParams, frameUrl: customFrameUrl }} />
    );
  }

  if (isValidImageUrl(searchParams.frameUrl))
    return <Form searchParams={searchParams} />;

  return <H2>Frame URL is invalid!</H2>;
}
