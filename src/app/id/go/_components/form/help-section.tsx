"use client";

import type React from "react";

import { motion } from "motion/react";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { MdFileUpload, MdSettings, MdShare } from "react-icons/md";

type HelpStep = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const HelpSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const steps: HelpStep[] = [
    {
      icon: <MdFileUpload size={24} />,
      title: "Unggah",
      description: "Unggah gambar untuk memulai",
    },
    {
      icon: <MdSettings size={24} />,
      title: "Sesuaikan",
      description: "Sesuaikan posisi dan penampilan-nya sesuai selera-mu",
    },
    {
      icon: <FaDownload size={24} />,
      title: "Unduh",
      description: "Simpan hasil gambar-mu ke perangkat mu.",
    },
    {
      icon: <MdShare size={24} />,
      title: "Bagikan",
      description: "Bagikan twibbon-mu ke media sosial",
    },
  ];

  return (
    <section
      className="mt-6 text-center p-6 rounded-xl shadow-sm"
      aria-labelledby="help-section-title"
    >
      <h2
        id="help-section-title"
        className="text-xl font-bold text-primary-700 mb-4"
      >
        Cara Menggunakan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-primary-100 hover:shadow-md transition-shadow"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              className={`
                bg-primary-100 text-primary-600 rounded-full p-3 mb-3
                ${hoveredIndex === index ? "bg-primary-200" : ""}
                transition-colors duration-300
              `}
              aria-hidden="true"
            >
              {step.icon}
            </div>
            <h3 className="font-medium text-primary-800 mb-1">{step.title}</h3>
            <p className="text-sm text-slate-600 text-center">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="mt-5 text-sm text-slate-500 max-w-lg mx-auto">
        Butuh bantuan?{" "}
        <a href="#" className="text-primary-600 hover:underline font-medium">
          Hubungi Kami
        </a>
        .
      </p>
    </section>
  );
};

export default HelpSection;
