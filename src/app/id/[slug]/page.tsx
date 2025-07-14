"use client";

import { Props } from "@/hooks/useValidateFrameUrl";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingOverlay from "../go/_components/form/loading-overlay";

export default function SlugPage() {
  const [isNotFound, setIsNotFound] = useState(false);
  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    const params = localStorage.getItem(slug as string);

    if (!params) setIsNotFound(true);
    else {
      const searchParams = JSON.parse(params) as Props["searchParams"];

      router.push(`/go?${new URLSearchParams(searchParams).toString()}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return isNotFound ? notFound() : <LoadingOverlay isLoading />;
}
