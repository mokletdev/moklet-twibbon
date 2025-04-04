import * as fabric from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

import { CanvasDimensions, ImageState, UseTwibbonHookRes } from "./types";

import {
  BACKGROUND_BLUR_AMOUNT,
  CANVAS_BACKGROUND_COLOR,
  CANVAS_INIT_DELAY,
  DEFAULT_CANVAS_SIZE,
  DEFAULT_FILTER_VALUE,
  DEFAULT_SCALE,
  DESKTOP_BREAKPOINT,
  EXPORT_IMAGE_QUALITY,
  EXPORT_MULTIPLIER,
  MOBILE_CANVAS_SIZE,
  OBJECT_NAMES,
} from "./constants";

import {
  configureBackgroundImage,
  configureFrameImage,
  extendFabricPrototype,
  loadImage,
  removeFabricObject,
} from "./utils";

/**
 * A custom React hook that provides a canvas-based twibbon editor
 *
 * @returns An object containing canvas methods and state
 */
export const useTwibbonCanvas = (): UseTwibbonHookRes => {
  // Extend Fabric.js prototype once per hook instantiation
  extendFabricPrototype();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameAspectRatioRef = useRef<number>(1);
  const dimensionsUpdatedRef = useRef<boolean>(false);

  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas>();
  const [frameUrl, setFrameUrl] = useState<string>();
  const [lastTwb, setLastTwb] = useState<string>();
  const [scaled, setScaled] = useState<number>(DEFAULT_SCALE);
  const [currentBrightness, setCurrentBrightness] =
    useState<number>(DEFAULT_FILTER_VALUE);
  const [currentContrast, setCurrentContrast] =
    useState<number>(DEFAULT_FILTER_VALUE);
  const [recommendedSize, setRecommendedSize] = useState<CanvasDimensions>({
    height: DEFAULT_CANVAS_SIZE,
    width: DEFAULT_CANVAS_SIZE,
  });

  // Media queries
  const isDesktop = useMediaQuery({
    query: `(min-width: ${DESKTOP_BREAKPOINT}px)`,
  });

  /**
   * Returns the maximum canvas size based on the current device
   */
  const getMaxCanvasSize = useCallback(() => {
    return isDesktop ? DEFAULT_CANVAS_SIZE : MOBILE_CANVAS_SIZE;
  }, [isDesktop]);

  /**
   * Calculates the canvas dimensions based on the image dimensions
   */
  const calculateCanvasDimensions = useCallback(
    (imgWidth: number, imgHeight: number): CanvasDimensions => {
      const aspectRatio = imgWidth / imgHeight;
      frameAspectRatioRef.current = aspectRatio;
      const maxSize = getMaxCanvasSize();

      // Calculate dimensions while preserving aspect ratio
      if (aspectRatio > 1) {
        return {
          width: maxSize,
          height: maxSize / aspectRatio,
        };
      } else {
        return {
          height: maxSize,
          width: maxSize * aspectRatio,
        };
      }
    },
    [getMaxCanvasSize]
  );

  /**
   * Sets up the Fabric.js canvas
   */
  const setupFabric = useCallback((): fabric.Canvas => {
    if (!canvasRef.current) {
      throw new Error("Canvas reference not found");
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      enablePointerEvents: false,
      allowTouchScrolling: true,
      backgroundColor: CANVAS_BACKGROUND_COLOR,
      selection: false,
      preserveObjectStacking: true,
      hoverCursor: "pointer",
    });

    const maxSize = getMaxCanvasSize();
    canvas.setDimensions({ width: maxSize, height: maxSize });

    return canvas;
  }, [getMaxCanvasSize]);

  /**
   * Resets the canvas to its initial state
   */
  const resetCanvas = useCallback(() => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    dimensionsUpdatedRef.current = false;
    setCurrentBrightness(DEFAULT_FILTER_VALUE);
    setCurrentContrast(DEFAULT_FILTER_VALUE);

    // Reinitialize with background if available
    if (frameUrl) {
      addBackgroundTwibbon(frameUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabricCanvas, frameUrl]);

  /**
   * Applies image filters (brightness and contrast) to the frame
   */
  const applyImageFilters = useCallback(
    (brightness: number, contrast: number) => {
      if (!fabricCanvas) return;

      setCurrentBrightness(brightness);
      setCurrentContrast(contrast);

      const objects = fabricCanvas.getObjects();
      for (const obj of objects) {
        if ((obj as any).name === OBJECT_NAMES.FRAME) {
          const imgObj = obj as fabric.Image;
          imgObj.filters = [
            new fabric.filters.Brightness({ brightness }),
            new fabric.filters.Contrast({ contrast }),
          ];
          imgObj.applyFilters();
          fabricCanvas.renderAll();
          break;
        }
      }
    },
    [fabricCanvas]
  );

  /**
   * Gets the current state of the frame image
   */
  const getCurrentImageState = useCallback((): ImageState | null => {
    if (!fabricCanvas) return null;

    return {
      scale: scaled,
      brightness: currentBrightness,
      contrast: currentContrast,
    };
  }, [fabricCanvas, scaled, currentBrightness, currentContrast]);

  /**
   * Adds a background image to the canvas
   */
  const addBackgroundTwibbon = useCallback(
    async (twibbonUrl: string, isBlur = false): Promise<boolean> => {
      if (!fabricCanvas) return false;

      try {
        const img = await loadImage(twibbonUrl);

        // Update canvas dimensions if needed
        if (!dimensionsUpdatedRef.current) {
          const dimensions = calculateCanvasDimensions(img.width, img.height);
          fabricCanvas.setDimensions(dimensions);
          setRecommendedSize(dimensions);
          dimensionsUpdatedRef.current = true;
        }

        // Create and configure background image
        const twibbonImage = await fabric.FabricImage.fromURL(
          twibbonUrl,
          { crossOrigin: "anonymous" },
          {
            crossOrigin: "anonymous",
            hasControls: false,
            hasBorders: false,
            objectCaching: false,
            selectable: false,
            evented: false,
            lockMovementX: false,
            lockMovementY: false,
          }
        );

        const canvasHeight = fabricCanvas.getHeight() ?? 0;
        const canvasWidth = fabricCanvas.getWidth() ?? 0;

        twibbonImage.scaleToHeight(canvasHeight);
        twibbonImage.scaleToWidth(canvasWidth);
        (twibbonImage as any).name = OBJECT_NAMES.BACKGROUND;
        setFrameUrl(twibbonUrl);

        configureBackgroundImage(twibbonImage);

        // Apply blur if needed
        if (isBlur) {
          twibbonImage.filters = [
            ...(twibbonImage.filters || []),
            new fabric.filters.Blur({ blur: BACKGROUND_BLUR_AMOUNT }),
          ];
          twibbonImage.applyFilters();
        }

        // Add to canvas (layer index 2)
        fabricCanvas.insertAt(2, twibbonImage);
        return true;
      } catch (error) {
        console.error("Failed to load twibbon image:", error);
        throw error;
      }
    },
    [fabricCanvas, calculateCanvasDimensions]
  );

  /**
   * Adds a frame image to the canvas
   */
  const addFrameTwibbon = useCallback(
    async (frameUrl: string): Promise<void> => {
      if (!fabricCanvas) return;

      try {
        // Create frame image
        const frameImage = await fabric.FabricImage.fromURL(
          frameUrl,
          { crossOrigin: "anonymous" },
          {
            hasControls: true,
            hasBorders: false,
            centeredRotation: true,
            centeredScaling: true,
            objectCaching: false,
            originX: "center",
            originY: "center",
            absolutePositioned: true,
          }
        );

        const canvasHeight = fabricCanvas.getHeight() ?? 0;
        const canvasWidth = fabricCanvas.getWidth() ?? 0;

        frameImage.scaleToHeight(canvasHeight);
        frameImage.scaleToWidth(canvasWidth);
        (frameImage as any).name = OBJECT_NAMES.FRAME;
        setLastTwb(frameUrl);

        configureFrameImage(frameImage);

        // Remove existing frame if present
        removeFabricObject(fabricCanvas, OBJECT_NAMES.FRAME);

        // Add to canvas (layer index 0 - topmost)
        fabricCanvas.centerObject(frameImage);
        fabricCanvas.insertAt(0, frameImage);

        setCurrentBrightness(DEFAULT_FILTER_VALUE);
        setCurrentContrast(DEFAULT_FILTER_VALUE);
      } catch (error) {
        console.error("Failed to load frame image:", error);
        throw error;
      }
    },
    [fabricCanvas]
  );

  /**
   * Initialize canvas on component mount
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = setupFabric();
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [setupFabric]);

  /**
   * Handle canvas resizing and re-initialization when dependencies change
   */
  useEffect(() => {
    if (!fabricCanvas) return;

    const initializeCanvas = async () => {
      fabricCanvas.clear();
      dimensionsUpdatedRef.current = false;
      const maxSize = getMaxCanvasSize();

      // Set dimensions based on aspect ratio
      let dimensions: CanvasDimensions;
      if (frameAspectRatioRef.current !== 1) {
        dimensions =
          frameAspectRatioRef.current > 1
            ? { width: maxSize, height: maxSize / frameAspectRatioRef.current }
            : { width: maxSize * frameAspectRatioRef.current, height: maxSize };
      } else {
        dimensions = { width: maxSize, height: maxSize };
      }

      fabricCanvas.setDimensions(dimensions);
      setRecommendedSize(dimensions);
      dimensionsUpdatedRef.current = true;

      // Add background and frame if available
      if (frameUrl) {
        await addBackgroundTwibbon(frameUrl);
        if (lastTwb) {
          await addFrameTwibbon(lastTwb);
        }
      }
    };

    // Small delay to ensure the canvas is ready
    setTimeout(initializeCanvas, CANVAS_INIT_DELAY);
  }, [
    isDesktop,
    fabricCanvas,
    addBackgroundTwibbon,
    addFrameTwibbon,
    frameUrl,
    lastTwb,
    getMaxCanvasSize,
  ]);

  /**
   * Update frame scaling when scale factor changes
   */
  useEffect(() => {
    if (!fabricCanvas) return;

    const frameObjects = fabricCanvas
      .getObjects()
      .filter((obj: any) => obj.name === OBJECT_NAMES.FRAME);

    if (frameObjects.length > 0) {
      const frameObj = frameObjects[0];
      const canvasHeight = fabricCanvas.getHeight() ?? 0;
      const canvasWidth = fabricCanvas.getWidth() ?? 0;

      frameObj.scaleToHeight(canvasHeight * scaled);
      frameObj.scaleToWidth(canvasWidth * scaled);
      frameObj.setCoords();

      fabricCanvas.renderAll();
    }
  }, [scaled, fabricCanvas]);

  return {
    canvasRef,
    fabricCanvas,
    addFrame: addFrameTwibbon,
    addBackground: addBackgroundTwibbon,
    recommendedSize,
    toDataUrl() {
      return fabricCanvas?.toDataURL({
        quality: EXPORT_IMAGE_QUALITY,
        format: "jpeg",
        top: 0,
        left: 0,
        multiplier: EXPORT_MULTIPLIER,
        height: recommendedSize.height,
        width: recommendedSize.width,
      });
    },
    setScaled,
    scaled,
    applyImageFilters,
    resetCanvas,
    getCurrentImageState,
  };
};
