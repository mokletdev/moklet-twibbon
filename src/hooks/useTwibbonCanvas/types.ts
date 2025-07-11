import * as fabric from "fabric";
import { Dispatch, RefObject, SetStateAction } from "react";

/**
 * Represents the state of an image with scale and filter values
 */
export interface ImageState {
  /** Scale factor of the image (0-1) */
  scale: number;
  /** Brightness value (-1 to 1) */
  brightness: number;
  /** Contrast value (-1 to 1) */
  contrast: number;
}

/**
 * Defines dimensions for a canvas element
 */
export interface CanvasDimensions {
  /** Height in pixels */
  height: number;
  /** Width in pixels */
  width: number;
}

/**
 * Return type for the useTwibbonCanvas hook
 */
export interface UseTwibbonHookRes {
  /** Reference to the Fabric.js canvas instance */
  fabricCanvas?: fabric.Canvas;
  /** Reference to the HTML canvas element */
  canvasRef: RefObject<HTMLCanvasElement>;

  /**
   * Adds a user image to the canvas
   * @param userImageUrl URL of the user image
   * @returns A promise that resolves when the image is added
   */

  addUserImage: (userImageUrl: string) => Promise<void>;

  /**
   * Adds a frame to the canvas
   * @param frameUrl URL of the frame image
   * @returns A promise that resolves when the frame is added
   */
  addFrame: (frameUrl: string) => Promise<void>;

  /**
   * Adds a background image to the canvas
   * @param twibbonUrl URL of the background image
   * @param isBlur Whether to apply blur effect to the background
   * @returns A promise that resolves to true if successful
   */
  addBackground: (twibbonUrl: string, isBlur?: boolean) => Promise<boolean>;

  /** Recommended dimensions for the canvas based on image aspect ratio */
  recommendedSize: CanvasDimensions;

  /**
   * Converts the canvas to a data URL
   * @returns Data URL representation of the canvas
   */
  toDataUrl: () => string | undefined;

  /** Sets the scale factor for the frame image */
  setScaled: Dispatch<SetStateAction<number>>;

  /** Current scale factor of the frame image */
  scaled: number;

  /**
   * Applies brightness and contrast filters to the frame image
   * @param brightness Brightness value (-1 to 1)
   * @param contrast Contrast value (-1 to 1)
   */
  applyImageFilters: (brightness: number, contrast: number) => void;

  /** Resets the canvas to its initial state */
  resetCanvas: () => void;

  /**
   * Gets the current state of the frame image
   * @returns Object containing scale, brightness, and contrast values
   */
  getCurrentImageState: () => ImageState | null;
}
