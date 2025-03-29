"use client";
import { useEffect, useState } from "react";
import { useRouter, notFound, useParams } from "next/navigation";
import { H1 } from "../_components/global/text";

export default function SlugPage() {
  const [isNotFound, setIsNotFound] = useState(false);
  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    const getStorage = localStorage.getItem(slug as string);
    if (!getStorage) setIsNotFound(true);
    else {
      const data = JSON.parse(getStorage);
      router.push(`/go?${new URLSearchParams(data).toString()}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return isNotFound ? notFound() : <H1 className="text-center">Loading...</H1>;
}
