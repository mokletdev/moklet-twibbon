/**
 * @file utils.ts
 * @description Utility functions for the Twibbon Canvas component
 */

import * as fabric from "fabric";
import { DEFAULT_FILTER_VALUE } from "./constants";

/**
 * Loads an image from a URL with CORS support
 * @param url The URL of the image to load
 * @returns Promise resolving to an HTMLImageElement
 */
export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

/**
 * Extends the Fabric.js prototype to support named objects
 */
export const extendFabricPrototype = (): void => {
  const oldFabricObject = fabric.FabricObject.prototype.toObject;
  fabric.FabricObject.prototype.toObject = function (additionalProps) {
    return oldFabricObject.call(this, ["name"].concat(additionalProps!));
  };
};

/**
 * Configures visibility controls for a frame image
 * @param frameImage The Fabric.js image object to configure
 */
export const configureFrameImage = (frameImage: fabric.Image): void => {
  // Set which control points are visible
  frameImage.setControlsVisibility({
    tr: true, // top-right
    tl: true, // top-left
    br: true, // bottom-right
    bl: true, // bottom-left
    mtr: false, // rotation
    mr: false, // middle-right
    mt: false, // middle-top
    mb: false, // middle-bottom
    ml: false, // middle-left
    deleteControl: false, // delete button
  });

  // Apply default filters for brightness and contrast
  frameImage.filters = [
    new fabric.filters.Brightness({ brightness: DEFAULT_FILTER_VALUE }),
    new fabric.filters.Contrast({ contrast: DEFAULT_FILTER_VALUE }),
  ];

  frameImage.applyFilters();
};

/**
 * Configures visibility controls for a background image
 * @param backgroundImage The Fabric.js image object to configure
 */
export const configureBackgroundImage = (
  backgroundImage: fabric.Image
): void => {
  backgroundImage.centeredScaling = true;
  backgroundImage.centeredRotation = true;

  // Hide all control points for background
  backgroundImage.setControlsVisibility({
    tr: false,
    tl: false,
    br: false,
    bl: false,
    mtr: false,
    mr: false,
    mt: false,
    mb: false,
    ml: false,
    deleteControl: false,
  });
};

/**
 * Removes a fabric object from the canvas by name
 * @param canvas The Fabric.js canvas instance
 * @param objectName The name of the object to remove
 */
export const removeFabricObject = (
  canvas: fabric.Canvas,
  objectName: string
): void => {
  if (!canvas) return;

  const objects = canvas.getObjects();
  objects.forEach((obj: any) => {
    if (obj.name === objectName) {
      canvas.remove(obj);
    }
  });
};
