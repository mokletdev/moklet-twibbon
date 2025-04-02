"use client";

import type React from "react";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaArrowRight, FaCheck, FaFileImage } from "react-icons/fa";
import { LinkButton } from "./_components/global/button";

function AnimatedTwibbonPreview() {
  const profileVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
      },
    },
  };

  const frameVariants = {
    initial: { scale: 1.2, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.8,
      },
    },
  };

  const sparkleVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        repeatType: "reverse",
        times: [0, 0.5, 1],
      },
    },
  } satisfies Variants;

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
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary-300"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.7, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main animation container */}
      <motion.div
        className="relative"
        animate="animate"
        variants={floatingVariants}
      >
        {/* Profile picture */}
        <motion.div
          className="w-48 h-48 rounded-full overflow-hidden relative"
          initial="initial"
          animate="animate"
          variants={profileVariants}
        >
          <Image
            src="/placeholder.jpg?height=200&width=200"
            alt="Profile picture"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Frame overlay */}
        <motion.div
          className="absolute inset-0 w-48 h-48"
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

        {/* Sparkle effects */}
        {[...Array(5)].map((_, i) => {
          const angle = i * 72 * (Math.PI / 180);
          const x = 100 + Math.cos(angle) * 100;
          const y = 100 + Math.sin(angle) * 100;

          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${x / 2}px`,
                top: `${y / 2}px`,
                transform: "translate(-50%, -50%)",
              }}
              initial="initial"
              animate="animate"
              variants={sparkleVariants}
              transition={{
                delay: i * 0.3,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z"
                  fill="#FFD700"
                />
              </svg>
            </motion.div>
          );
        })}

        {/* Processing effect */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.1, 0.8],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            times: [0, 0.5, 1],
          }}
        >
          <div className="w-56 h-56 rounded-full border-4 border-primary-300 border-t-primary-500 border-dashed" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Home() {
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-100">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row items-center gap-12"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.div
              className="w-full md:w-1/2 space-y-6"
              variants={fadeIn}
              custom={0}
            >
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                variants={fadeIn}
                custom={1}
              >
                <span className="text-primary-500">Moklet Twibbon,</span> Create
                Free Campaigns Without Watermarks
              </motion.h1>

              <motion.p
                className="text-lg text-neutral-600 max-w-xl"
                variants={fadeIn}
                custom={2}
              >
                Tired of twibbons with watermarks? We,{" "}
                <Link
                  target="_blank"
                  href={"https://dev.moklet.org/"}
                  className="text-primary-500 font-medium hover:underline"
                >
                  Moklet Developers
                </Link>
                , provide a special solution for creating professional-looking
                campaign frames completely free.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                variants={fadeIn}
                custom={3}
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
                  className="flex items-center justify-center gap-2 truncate py-2 px-4 rounded-md text-lg font-medium bg-primary-100 text-primary-600 hover:bg-primary-200 cursor-pointer duration-200 max-w-full sm:max-w-xs"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaFileImage /> {fileName ?? "Choose frame"}
                </motion.label>

                {fileName && (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LinkButton
                      variant="primary"
                      className="w-full sm:w-auto text-center py-6 px-6"
                      href="/go?slug=custom-twibbon"
                    >
                      Create twibbon! <FaArrowRight className="ml-2" />
                    </LinkButton>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Animated Hero Visual - Replacing the static image */}
            <motion.div
              className="w-full md:w-1/2"
              variants={fadeIn}
              custom={4}
            >
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-50 to-primary-100">
                <AnimatedTwibbonPreview />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <p className="text-white text-xl font-medium">
                    Create professional twibbons in seconds
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <motion.section
        className="w-full py-20 px-4 md:px-8 bg-neutral-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Create your custom twibbon in three simple steps
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Upload Your Frame",
                description:
                  "Choose a PNG frame that will be overlaid on profile pictures",
                icon: <FaFileImage className="text-primary-500 text-2xl" />,
                delay: 0.2,
              },
              {
                title: "Customize",
                description:
                  "Adjust the position and size to fit perfectly with any profile picture",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500 text-2xl"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                ),
                delay: 0.4,
              },
              {
                title: "Download & Share",
                description:
                  "Get your watermark-free twibbon and share it on social media",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500 text-2xl"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                ),
                delay: 0.6,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="w-full py-20 px-4 md:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Why Choose Moklet Twibbon
            </motion.h2>
            <motion.p
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our platform offers several advantages over other twibbon creators
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "100% Free, No Watermarks",
                description:
                  "Unlike other services, we don't add watermarks to your twibbons. Your campaigns remain professional and clean.",
                delay: 0.2,
              },
              {
                title: "Easy to Use",
                description:
                  "Our intuitive interface makes it simple to create twibbons in just a few clicks, no design skills required.",
                delay: 0.3,
              },
              {
                title: "Custom Frames",
                description:
                  "Upload your own frame designs to create unique campaign visuals that stand out.",
                delay: 0.4,
              },
              {
                title: "High Quality Output",
                description:
                  "Get high-resolution images perfect for sharing on any social media platform.",
                delay: 0.5,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="mt-1 bg-primary-50 rounded-full p-1 h-fit">
                  <FaCheck className="text-primary-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Examples Section */}
      <motion.section
        className="w-full py-20 px-4 md:px-8 bg-neutral-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Example Twibbons
            </motion.h2>
            <motion.p
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Check out some of the amazing twibbons created with our tool
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={index}
                className="relative rounded-xl overflow-hidden shadow-lg aspect-square"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <Image
                  src={`/placeholder.svg?height=400&width=400`}
                  alt={`Example twibbon ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full px-4 md:px-8 bg-primary-500 text-white">
        <div className="border-neutral-600 max-w-7xl mx-auto mt-12 py-8 text-center">
          <p>
            © {new Date().getFullYear()} Moklet Developers. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
