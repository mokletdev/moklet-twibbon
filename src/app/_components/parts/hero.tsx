import type React from "react";

import { ArrowRight, Upload } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { LinkButton } from "../global/button";

const AnimatedTwibbonPreview = () => {
  const profileVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, delay: 0.3 },
    },
  };

  const frameVariants = {
    initial: { scale: 1.2, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, delay: 0.8 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary-300/30"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative"
        animate="animate"
        variants={floatingVariants}
      >
        <motion.div
          className="w-56 h-56 rounded-full overflow-hidden relative"
          initial="initial"
          animate="animate"
          variants={profileVariants}
        >
          <Image
            src="/placeholder.jpg"
            alt="Profile picture"
            fill
            className="object-cover aspect-square"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 w-56 h-56"
          initial="initial"
          animate="animate"
          variants={frameVariants}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient
                id="frameGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.7)" />
                <stop offset="100%" stopColor="rgba(147, 51, 234, 0.7)" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="url(#frameGradient)"
              strokeWidth="10"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0.9, 1.05, 0.9],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <div className="w-64 h-64 rounded-full border-2 border-primary-300/50 border-t-primary-500/80" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Hero = () => {
  const [fileName, setFileName] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        localStorage.setItem("customFrameUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-white to-primary-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content side */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-primary-500">Moklet Twibbon</span>
              <span className="block mt-1">
                Create Free Campaigns Without Watermarks
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-neutral-600 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create professional-looking campaign frames without watermarks.
              Powered by{" "}
              <Link
                target="_blank"
                href="https://dev.moklet.org/"
                className="text-primary-500 font-medium hover:underline"
              >
                Moklet Developers
              </Link>
              .
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <input
                type="file"
                id="frame"
                name="frame"
                accept="image/png"
                onChange={handleFileChange}
                ref={fileInputRef}
                hidden
              />

              <motion.label
                htmlFor="frame"
                className="flex items-center justify-center gap-2 truncate py-3 px-5 rounded-lg text-base font-medium bg-white border border-primary-200 text-primary-700 hover:bg-primary-50 cursor-pointer transition-colors shadow-sm max-w-full sm:max-w-xs"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload size={18} /> {fileName ?? "Choose frame"}
              </motion.label>

              {fileName && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LinkButton
                    variant="primary"
                    className="w-full sm:w-auto text-center py-3 px-5 rounded-lg shadow-md"
                    href="/go?slug=custom-twibbon"
                  >
                    Create twibbon <ArrowRight className="ml-2" size={18} />
                  </LinkButton>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Preview side */}
          <motion.div
            className="h-[400px] relative w-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatedTwibbonPreview />
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-primary-500/20 to-transparent flex items-end p-6">
              <p className="text-primary-500 text-lg font-bold">
                Professional Twibbon in Seconds
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
