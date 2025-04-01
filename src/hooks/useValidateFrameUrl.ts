import { isValidImageUrl } from "@/utils/validator";

export interface Props {
  /**
   * Search parameters passed to the component, containing twibbon configuration
   */
  searchParams: {
    /** Optional title for the twibbon */
    title?: string;
    /** URL for the frame image */
    frameUrl?: string;
    /** Optional caption text for sharing */
    caption?: string;
    /** Optional slug for the URL */
    slug?: string;
  };
}

/**
 * Helper hook to validate and retrieve frame URL
 */
export const useValidateFrameUrl = (searchParams: Props["searchParams"]) => {
  // Try to retrieve from localStorage if not provided in searchParams
  const customFrameUrl =
    typeof window !== "undefined"
      ? (localStorage.getItem("customFrameUrl") as string | undefined)
      : undefined;

  searchParams.frameUrl =
    searchParams.frameUrl === undefined
      ? customFrameUrl
      : searchParams.frameUrl;

  const { frameUrl } = searchParams;

  if (frameUrl && !frameUrl.startsWith("data:") && !isValidImageUrl(frameUrl)) {
    return null;
  }

  return searchParams;
};
