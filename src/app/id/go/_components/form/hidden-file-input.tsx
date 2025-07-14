import React from "react";

interface HiddenFileInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const HiddenFileInput: React.FC<HiddenFileInputProps> = ({ onChange }) => {
  return (
    <div className="hidden">
      <input
        type="file"
        id="foto"
        accept="image/png, image/jpeg, image/jpg"
        onChange={onChange}
      />
    </div>
  );
};

export default HiddenFileInput;
