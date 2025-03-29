import * as fabric from "fabric";
import {
  Dispatch,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useMediaQuery } from "react-responsive";

export type UseTwibbonHookRes = {
  fabricCanvas?: fabric.Canvas;
  canvasRef: Ref<HTMLCanvasElement>;

  addFrame: (frameUrl: string) => Promise<void>;
  addBackground: (twibbonUrl: string, isBlur?: boolean) => Promise<boolean>;
  recommendedSize: {
    height: number;
    width: number;
  };
  toDataUrl: () => string | undefined;
  setScaled: Dispatch<SetStateAction<number>>;
  scaled: number;
  applyImageFilters: (brightness: number, contrast: number) => void;
  resetCanvas: () => void;
  getCurrentImageState: () => {
    scale: number;
    brightness: number;
    contrast: number;
  } | null;
};

export const useTwibbonCanvas = (): UseTwibbonHookRes => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameUrl, setFrameUrl] = useState<string>();
  const [lastTwb, setLastTwb] = useState<string>();
  const [scaled, setScaled] = useState<number>(0.5);
  const frameAspectRatioRef = useRef<number>(1);
  const dimensionsUpdatedRef = useRef<boolean>(false);
  const [currentBrightness, setCurrentBrightness] = useState<number>(0);
  const [currentContrast, setCurrentContrast] = useState<number>(0);

  const [recommendedSize, setRecommendedSize] = useState<{
    height: number;
    width: number;
  }>({
    height: 500,
    width: 500,
  });

  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas>();
  const isMd = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const oldFabricObject = fabric.FabricObject.prototype.toObject;
  fabric.FabricObject.prototype.toObject = function (additionalProps) {
    return oldFabricObject.call(this, ["name"].concat(additionalProps!));
  };

  const calculateCanvasDimensions = useCallback(
    (imgWidth: number, imgHeight: number, maxSize: number) => {
      const aspectRatio = imgWidth / imgHeight;
      frameAspectRatioRef.current = aspectRatio;

      let width, height;
      if (aspectRatio > 1) {
        width = maxSize;
        height = maxSize / aspectRatio;
      } else {
        height = maxSize;
        width = maxSize * aspectRatio;
      }

      return { width, height };
    },
    [],
  );

  const loadImage = useCallback((url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  }, []);

  const removeFabricObject = useCallback(
    (objectName: string): void => {
      const objects = fabricCanvas?.getObjects() ?? [];

      objects.forEach((obj: any) => {
        if (obj.name === objectName) {
          console.log(`${objectName} removed`);
          fabricCanvas?.remove(obj);
        }
      });
    },
    [fabricCanvas],
  );

  const resetCanvas = useCallback(() => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      dimensionsUpdatedRef.current = false;
      setCurrentBrightness(0);
      setCurrentContrast(0);

      if (frameUrl) {
        addBackgroundTwibbon(frameUrl);
      }
    }
  }, [fabricCanvas, frameUrl]);

  const applyImageFilters = useCallback(
    (brightness: number, contrast: number) => {
      if (!fabricCanvas) return;

      setCurrentBrightness(brightness);
      setCurrentContrast(contrast);

      const objects = fabricCanvas.getObjects();
      for (const obj of objects) {
        if ((obj as any).name === "twibbon_frame") {
          const imgObj = obj as fabric.Image;
          imgObj.filters = [
            new fabric.filters.Brightness({ brightness }),
            new fabric.filters.Contrast({ contrast }),
          ];
          imgObj.applyFilters();
          fabricCanvas.renderAll();
        }
      }
    },
    [fabricCanvas],
  );

  const getCurrentImageState = useCallback(() => {
    if (!fabricCanvas) return null;

    return {
      scale: scaled,
      brightness: currentBrightness,
      contrast: currentContrast,
    };
  }, [fabricCanvas, scaled, currentBrightness, currentContrast]);

  const addBackgroundTwibbon = useCallback(
    async (twibbonUrl: string, isBlur = false) => {
      const prevId = "twibbon_background";

      try {
        const img = await loadImage(twibbonUrl);

        const maxSize = isMd ? 500 : 300;

        if (!dimensionsUpdatedRef.current) {
          const dimensions = calculateCanvasDimensions(
            img.width,
            img.height,
            maxSize,
          );
          fabricCanvas?.setDimensions(dimensions);
          setRecommendedSize(dimensions);
          dimensionsUpdatedRef.current = true;
        }

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
          },
        );

        const canvasHeight = fabricCanvas?.getHeight() ?? 0;
        const canvasWidth = fabricCanvas?.getWidth() ?? 0;

        twibbonImage.scaleToHeight(canvasHeight);
        twibbonImage.scaleToWidth(canvasWidth);

        (twibbonImage as any).name = prevId;
        setFrameUrl(twibbonUrl);

        twibbonImage.centeredScaling = true;
        twibbonImage.centeredRotation = true;
        twibbonImage.setControlsVisibility({
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

        if (isBlur) {
          twibbonImage.filters = [
            ...(twibbonImage.filters || []),
            new fabric.filters.Blur({ blur: 0.5 }),
          ];
          twibbonImage.applyFilters();
        }

        fabricCanvas?.insertAt(2, twibbonImage);
        return true;
      } catch (error) {
        console.error("Failed to load twibbon image:", error);
        throw error;
      }
    },
    [fabricCanvas, isMd, loadImage, calculateCanvasDimensions],
  );

  const addFrameTwibbon = useCallback(
    async (frameUrl: string) => {
      const prevId = "twibbon_frame";

      try {
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
          },
        );

        const canvasHeight = fabricCanvas?.getHeight() ?? 0;
        const canvasWidth = fabricCanvas?.getWidth() ?? 0;

        frameImage.scaleToHeight(canvasHeight);
        frameImage.scaleToWidth(canvasWidth);

        (frameImage as any).name = prevId;
        setLastTwb(frameUrl);

        frameImage.setControlsVisibility({
          tr: true,
          tl: true,
          br: true,
          bl: true,
          mtr: false,
          mr: false,
          mt: false,
          mb: false,
          ml: false,
          deleteControl: false,
        });

        frameImage.filters = [
          new fabric.filters.Brightness({ brightness: 0 }),
          new fabric.filters.Contrast({ contrast: 0 }),
        ];

        frameImage.applyFilters();

        removeFabricObject(prevId);
        fabricCanvas?.centerObject(frameImage);
        fabricCanvas?.insertAt(0, frameImage);

        setCurrentBrightness(0);
        setCurrentContrast(0);

        return Promise.resolve();
      } catch (error) {
        console.error("Failed to load frame image:", error);
        return Promise.reject(error);
      }
    },
    [fabricCanvas, removeFabricObject],
  );

  const setupFabric = useCallback((): fabric.Canvas => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
      enablePointerEvents: false,
      allowTouchScrolling: true,
      backgroundColor: "#EEEEF3",
      selection: false,
      preserveObjectStacking: true,
      hoverCursor: "pointer",
    });

    const maxSize = isMd ? 500 : 300;
    fabricCanvas.setDimensions({ width: maxSize, height: maxSize });

    return fabricCanvas;
  }, [isMd]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = setupFabric();
    setFabricCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    dimensionsUpdatedRef.current = false;

    const maxSize = isMd ? 500 : 300;

    let dimensions;
    if (frameAspectRatioRef.current !== 1) {
      dimensions =
        frameAspectRatioRef.current > 1
          ? { width: maxSize, height: maxSize / frameAspectRatioRef.current }
          : { width: maxSize * frameAspectRatioRef.current, height: maxSize };

      fabricCanvas.setDimensions(dimensions);
      setRecommendedSize(dimensions);
      dimensionsUpdatedRef.current = true;
    } else {
      dimensions = { width: maxSize, height: maxSize };
      fabricCanvas.setDimensions(dimensions);
      setRecommendedSize(dimensions);
    }

    if (frameUrl) {
      setTimeout(async () => {
        await addBackgroundTwibbon(frameUrl);

        if (lastTwb) {
          addFrameTwibbon(lastTwb);
        }
      }, 50);
    }
  }, [
    isMd,
    fabricCanvas,
    addBackgroundTwibbon,
    addFrameTwibbon,
    frameUrl,
    lastTwb,
  ]);

  useEffect(() => {
    for (const obj of fabricCanvas?.getObjects() ?? []) {
      if ((obj as any).name === "twibbon_frame") {
        const canvasHeight = fabricCanvas?.getHeight() ?? 0;
        const canvasWidth = fabricCanvas?.getWidth() ?? 0;

        obj.scaleToHeight(canvasHeight * scaled);
        obj.scaleToWidth(canvasWidth * scaled);
        obj.setCoords();

        fabricCanvas?.renderAll();
      }
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
        quality: 2,
        format: "jpeg",
        top: 0,
        left: 0,
        multiplier: 4,
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
