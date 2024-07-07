import * as fabric from "fabric";
import {
  Dispatch,
  Ref,
  SetStateAction,
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

  const addBackgroundTwibbon = (twibbonUrl: string, isBlur = false) => {
    const prevId = "twibbon_background";

    fabric.FabricImage.fromURL(
      twibbonUrl,
      {
        crossOrigin: "anonymous",
      },
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
      twibbonImage.scaleToHeight(fabricCanvas?.getHeight() ?? 0);
      twibbonImage.scaleToWidth(fabricCanvas?.getWidth() ?? 0);

      (twibbonImage as any).name = prevId;
      setFrameUrl(twibbonUrl);

      twibbonImage.centeredScaling = true;
      twibbonImage.centeredRotation = true;
      twibbonImage.setControlsVisibility({
        tr: !1,
        tl: !1,
        br: !1,
        bl: !1,
        mtr: !1,
        mr: !1,
        mt: !1,
        mb: !1,
        ml: !1,
        deleteControl: !1,
      });
      if (isBlur) {
        twibbonImage.filters = twibbonImage.filters.concat([
          new fabric.filters.Blur({
            blur: 0.5,
          }),
        ]);

        twibbonImage.applyFilters();
      }

      fabricCanvas?.insertAt(0, twibbonImage);
    });
  };

  const removeFabricObject = (objectName: string): void => {
    for (const obj of fabricCanvas?.getObjects() ?? []) {
      if ((obj as any).name === objectName) {
        console.log(objectName, "removed");
        fabricCanvas?.remove(obj);
      }
    }
  };

  const addFrameTwibbon = (frameUrl: string) => {
    fabric.FabricImage.fromURL(
      frameUrl,
      {
        crossOrigin: "anonymous",
      },
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
      const prevId = "twibbon_frame";

      frameImage.scaleToHeight(fabricCanvas?.getHeight() ?? 0);
      frameImage.scaleToWidth(fabricCanvas?.getWidth() ?? 0);

      (frameImage as any).name = prevId;
      setLastTwb(frameUrl);

      frameImage.centeredRotation = true;
      frameImage.centeredScaling = true;
      frameImage.setControlsVisibility({
        tr: !1,
        tl: !1,
        br: !1,
        bl: !1,
        mtr: !1,
        mr: !1,
        mt: !1,
        mb: !1,
        ml: !1,
        deleteControl: !1,
      });

      frameImage.filters = frameImage.filters.concat([
        new fabric.filters.Brightness(),
        new fabric.filters.Contrast(),
      ]);

      frameImage.applyFilters();

      removeFabricObject(prevId);
      fabricCanvas?.centerObject(frameImage);
      fabricCanvas?.insertAt(1, frameImage);
    });
  };

  const setupFabric = (): fabric.Canvas => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
      enablePointerEvents: true,
      allowTouchScrolling: true,
      backgroundColor: "#EEEEF3",
      selection: false,
      preserveObjectStacking: true,
      hoverCursor: "pointer",
    });

    if (isMd) {
      fabricCanvas.setDimensions({
        width: 500,
        height: 500,
      });
    } else {
      fabricCanvas.setDimensions({
        width: 300,
        height: 300,
      });
    }

    return fabricCanvas;
  };

  useEffect(() => {
    const fabricCanvas = setupFabric();
    setFabricCanvas((prev) => fabricCanvas);

    if (frameUrl) {
      addBackgroundTwibbon(frameUrl);
    }

    console.log("Fabric Canvas 01");

    return () => {
      fabricCanvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fabricCanvas?.clear();

    if (isMd) {
      setRecommendedSize({
        height: 500,
        width: 500,
      });

      fabricCanvas?.setDimensions({
        width: 500,
        height: 500,
      });
    } else {
      setRecommendedSize({
        height: 300,
        width: 300,
      });

      fabricCanvas?.setDimensions({
        width: 300,
        height: 300,
      });
    }

    if (frameUrl) {
      addBackgroundTwibbon(frameUrl);

      if (lastTwb) {
        addFrameTwibbon(lastTwb);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMd]);

  useEffect(() => {
    for (const obj of fabricCanvas?.getObjects() ?? []) {
      if ((obj as any).name === "twibbon_frame") {
        obj.scale(Math.max(0.0025, scaled));
        obj.setCoords();

        fabricCanvas?.renderAll();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scaled]);

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
