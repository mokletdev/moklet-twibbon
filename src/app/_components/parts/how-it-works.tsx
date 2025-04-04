import { ArrowRight, Download, Edit, FileImage } from "lucide-react";
import { motion } from "motion/react";

export const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.3,
      },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        delay: 0.5,
      },
    },
  };

  const steps = [
    {
      title: "Upload Your Frame",
      description:
        "Choose a PNG frame that will be overlaid on profile pictures",
      icon: <FileImage className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Customize",
      description:
        "Adjust the position and size to fit perfectly with any profile picture",
      icon: <Edit className="w-6 h-6" />,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Download & Share",
      description:
        "Get your watermark-free twibbon and share it on social media",
      icon: <Download className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section className="w-full py-24 px-4 md:px-8 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
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
        </motion.div>

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-300 via-primary-500 to-primary-700"
              variants={lineVariants}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={stepVariants}
              >
                <motion.div
                  className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 h-full"
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)",
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <div className="relative mb-6">
                    <motion.div
                      className="absolute z-[999] -top-4 -left-4 w-8 h-8 rounded-full bg-primary-500 shadow-md flex items-center justify-center text-sm font-bold text-white border border-white"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.6 + index * 0.2,
                        duration: 0.4,
                        type: "spring",
                      }}
                      viewport={{ once: true }}
                    >
                      {index + 1}
                    </motion.div>

                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-5`}
                      variants={iconVariants}
                    >
                      {step.icon}

                      <motion.div
                        className="absolute inset-0"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full bg-white/80"
                            style={{
                              top: `${20 + Math.random() * 60}%`,
                              left: `${20 + Math.random() * 60}%`,
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 0.8, 0],
                              scale: [0, 1, 0],
                              x: [0, (Math.random() - 0.5) * 30],
                              y: [0, (Math.random() - 0.5) * 30],
                            }}
                            transition={{
                              duration: 2,
                              delay: 1 + index * 0.3 + i * 0.3,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatDelay: 3,
                            }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-neutral-600 mb-4">{step.description}</p>
                </motion.div>

                {index < steps.length - 1 && (
                  <motion.div
                    className="flex justify-center md:hidden my-2"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <ArrowRight className="text-primary-700 w-5 h-5 rotate-90" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
