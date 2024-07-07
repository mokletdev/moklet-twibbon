/* For some reasons, property 'name' does not exist in any 
of the fabric related type even though it exists, so we'll have to use any */

import * as fabric from "fabric";
import {
  Dispatch,
  Ref,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "react-responsive";

export type UseTwibbonHookRes = {
  fabricCanvas?: fabric.Canvas;
  canvasRef: Ref<HTMLCanvasElement>;

  addFrame: (frameUrl: string) => void;
  addBackground: (twibbonUrl: string) => void;
  recommendedSize: {
    height: number;
    width: number;
  };
  toDataUrl: () => string | undefined;
  setScaled: Dispatch<SetStateAction<number>>;
  scaledNumber: number;
};

export const useTwibbonCanvas = (): UseTwibbonHookRes => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameUrl, setFrameUrl] = useState<string>();
  const [lastTwb, setLastTwb] = useState<string>();
  const [scaled, setScaled] = useState<number>(0.5);
  const [recommendedSize, setRecommendedSize] = useState<{
    height: number;
    width: number;
  }>({ height: 500, width: 500 });
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas>();
  const isMd = useMediaQuery({ query: "(min-width: 768px)" });

  useEffect(() => {
    const oldFabricObject = fabric.FabricObject.prototype.toObject;
    fabric.FabricObject.prototype.toObject = function (additionalProps) {
      return oldFabricObject.call(this, ["name"].concat(additionalProps!));
    };
  }, []);

  const addBackgroundTwibbon = useCallback(
    (twibbonUrl: string, isBlur = false) => {
      fabric.FabricImage.fromURL(
        twibbonUrl,
        { crossOrigin: "anonymous" },
        {
          hasControls: false,
          hasBorders: false,
          objectCaching: false,
          selectable: false,
          evented: false,
          lockMovementX: false,
          lockMovementY: false,
        }
      ).then((twibbonImage) => {
        if (!fabricCanvas) return;

        twibbonImage.scaleToHeight(fabricCanvas.getHeight() ?? 0);
        twibbonImage.scaleToWidth(fabricCanvas.getWidth() ?? 0);
        (twibbonImage as any).name = "twibbon_background";

        if (isBlur) {
          twibbonImage.filters = twibbonImage.filters.concat([
            new fabric.filters.Blur({ blur: 0.5 }),
          ]);
          twibbonImage.applyFilters();
        }

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

        fabricCanvas.insertAt(0, twibbonImage);
        setFrameUrl(twibbonUrl);
      });
    },
    [fabricCanvas]
  );

  const removeFabricObject = useCallback(
    (objectName: string) => {
      if (!fabricCanvas) return;

      const objects: fabric.FabricObject[] = fabricCanvas.getObjects();
      for (const obj of objects) {
        if ((obj as any).name === objectName) {
          fabricCanvas.remove(obj);
        }
      }
    },
    [fabricCanvas]
  );

  const addFrameTwibbon = useCallback(
    (frameUrl: string) => {
      fabric.FabricImage.fromURL(
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
      ).then((frameImage) => {
        if (!fabricCanvas) return;

        frameImage.scaleToHeight(fabricCanvas.getHeight() ?? 0);
        frameImage.scaleToWidth(fabricCanvas.getWidth() ?? 0);
        (frameImage as any).name = "twibbon_frame";

        frameImage.filters = frameImage.filters.concat([
          new fabric.filters.Brightness(),
          new fabric.filters.Contrast(),
        ]);

        frameImage.applyFilters();

        removeFabricObject("twibbon_frame");
        fabricCanvas.centerObject(frameImage);
        fabricCanvas.insertAt(1, frameImage);
        setLastTwb(frameUrl);
      });
    },
    [fabricCanvas, removeFabricObject]
  );

  const setupFabric = useCallback((): fabric.Canvas => {
    const fbCanvas = new fabric.Canvas(canvasRef.current!, {
      enablePointerEvents: true,
      allowTouchScrolling: true,
      backgroundColor: "#EEEEF3",
      selection: false,
      preserveObjectStacking: true,
      hoverCursor: "pointer",
    });

    const dimensions = isMd
      ? { width: 500, height: 500 }
      : { width: 300, height: 300 };
    fbCanvas.setDimensions(dimensions);

    return fbCanvas;
  }, [isMd]);

  useEffect(() => {
    const fbCanvas = setupFabric();
    setFabricCanvas(fbCanvas);

    if (frameUrl) {
      addBackgroundTwibbon(frameUrl);
    }

    return () => {
      fbCanvas.dispose();
    };
  }, [setupFabric, frameUrl, addBackgroundTwibbon]);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();

    const dimensions = isMd
      ? { width: 500, height: 500 }
      : { width: 300, height: 300 };
    fabricCanvas.setDimensions(dimensions);
    setRecommendedSize(dimensions);

    if (frameUrl) {
      addBackgroundTwibbon(frameUrl);
      if (lastTwb) {
        addFrameTwibbon(lastTwb);
      }
    }
  }, [
    isMd,
    fabricCanvas,
    frameUrl,
    lastTwb,
    addBackgroundTwibbon,
    addFrameTwibbon,
  ]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const objects = fabricCanvas.getObjects();
    for (const obj of objects) {
      if ((obj as any).name === "twibbon_frame") {
        obj.scale(Math.max(0.0025, scaled));
        obj.setCoords();
        fabricCanvas.renderAll();
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
        quality: 1,
        format: "jpeg",
        top: 0,
        left: 0,
        multiplier: 2,
        height: recommendedSize.height,
        width: recommendedSize.width,
      });
    },
    setScaled,
    scaledNumber: scaled,
  };
};
