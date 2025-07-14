import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { Toaster } from "sonner";

export default function SonnerWrapper() {
  return (
    <Toaster
      duration={1500} // 1.5 seconds
      pauseWhenPageIsHidden
      theme="light"
      toastOptions={{ className: "shadow-sm shadow-white bg-white/70" }}
      icons={{
        success: <FaCheckCircle className="text-green-500" size={20} />,
        error: <FaCircleXmark className="text-red-500" size={20} />,
        info: <FaInfoCircle className="text-blue-500" size={20} />,
        warning: <FaExclamationCircle className="text-yellow-500" size={20} />,
      }}
    />
  );
}
