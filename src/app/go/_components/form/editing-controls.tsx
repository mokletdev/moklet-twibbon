import { Button } from "@/app/_components/global/button";
import React from "react";
import { FaFileImage, FaRedo, FaSearch, FaUndo } from "react-icons/fa";
import { MdBrightness6, MdContrast } from "react-icons/md";

interface EditingControlsProps {
  scale: number;
  brightness: number;
  contrast: number;
  historyIndex: number;
  editHistoryLength: number;
  isLoading: boolean;
  onScaleChange: (scale: number) => void;
  onBrightnessChange: (brightness: number) => void;
  onContrastChange: (contrast: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onChangeImage: () => void;
}

const EditingControls: React.FC<EditingControlsProps> = ({
  scale,
  brightness,
  contrast,
  historyIndex,
  editHistoryLength,
  isLoading,
  onScaleChange,
  onBrightnessChange,
  onContrastChange,
  onUndo,
  onRedo,
  onChangeImage,
}) => {
  return (
    <>
      <div className="flex justify-center gap-3 mt-2">
        <Button
          variant="quartiary"
          onClick={onUndo}
          disabled={historyIndex <= 0 || isLoading}
          className="!rounded-md !px-3 !py-2 shadow-sm hover:shadow transition-all duration-200"
          title="Undo"
        >
          <FaUndo />
        </Button>
        <Button
          variant="quartiary"
          onClick={onRedo}
          disabled={historyIndex >= editHistoryLength - 1 || isLoading}
          className="!rounded-md !px-3 !py-2 shadow-sm hover:shadow transition-all duration-200"
          title="Redo"
        >
          <FaRedo />
        </Button>
      </div>

      <div className="w-full bg-gray-50 p-4 rounded-xl shadow-inner">
        <div className="grid grid-cols-1 gap-5">
          {/* Zoom control */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="zoom"
                className="text-sm font-medium text-slate-700 flex items-center"
              >
                <FaSearch className="h-4 w-4 mr-1" />
                Zoom
              </label>
              <span className="text-sm bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                {(Math.round((scale + Number.EPSILON) * 100) / 100).toFixed(2)}x
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="quartiary"
                onClick={() => onScaleChange(Math.max(0.2, scale - 0.05))}
                className="!rounded-lg !px-2 !py-1 !text-sm !bg-white shadow-sm"
              >
                -
              </Button>
              <input
                id="zoom"
                type="range"
                min="0.2"
                max="3"
                step="0.01"
                value={scale}
                onChange={(e) =>
                  onScaleChange(parseFloat(e.currentTarget.value))
                }
                className="w-full h-2 flex-1 bg-primary-100 rounded-lg appearance-none cursor-pointer"
              />
              <Button
                variant="quartiary"
                onClick={() => onScaleChange(Math.min(3, scale + 0.05))}
                className="!rounded-lg !px-2 !py-1 !text-sm !bg-white shadow-sm"
              >
                +
              </Button>
            </div>
          </div>

          {/* Brightness and contrast controls */}
          <div className="flex gap-2 md:flex-row flex-col">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="brightness"
                  className="text-sm font-medium text-slate-700 flex items-center"
                >
                  <MdBrightness6 className="mr-1" /> Brightness
                </label>
                <span className="text-sm bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                  {brightness.toFixed(2)}
                </span>
              </div>
              <input
                id="brightness"
                type="range"
                min="-0.5"
                max="0.5"
                step="0.01"
                value={brightness}
                onChange={(e) =>
                  onBrightnessChange(parseFloat(e.currentTarget.value))
                }
                className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="contrast"
                  className="text-sm font-medium text-slate-700 flex items-center"
                >
                  <MdContrast className="mr-1" /> Contrast
                </label>
                <span className="text-sm bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                  {contrast.toFixed(2)}
                </span>
              </div>
              <input
                id="contrast"
                type="range"
                min="-0.5"
                max="0.5"
                step="0.01"
                value={contrast}
                onChange={(e) =>
                  onContrastChange(parseFloat(e.currentTarget.value))
                }
                className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-3">
        <Button
          variant="quartiary"
          onClick={onChangeImage}
          className="flex items-center gap-2 !py-2 !px-4 !rounded-lg text-sm shadow-sm hover:shadow transition-all duration-200"
        >
          <FaFileImage size={14} /> Change Image
        </Button>
      </div>
    </>
  );
};

export default EditingControls;
