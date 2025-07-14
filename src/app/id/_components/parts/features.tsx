import {
  BadgeCheck,
  ImagePlus,
  MousePointerClick,
  Shield,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";

export const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    },
  };

  const iconContainerVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2,
      },
    },
  };

  const pulseVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0, 0.5, 0],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        ease: "easeInOut",
        delay: 1,
      },
    },
  };

  const features = [
    {
      title: "100% Gratis, Tanpa Watermark",
      description:
        "Tidak seperti layanan lainnya, kita tidak menambahkan watermark ke twibbon kalian. Twibbon kalian tetap terlihat profesional dan bersih.",
      icon: <BadgeCheck className="w-6 h-6" />,
      color: "bg-gradient-to-br from-primary-500 to-primary-700",
    },
    {
      title: "Full Client-side",
      description:
        "Logika aplikasi ini terjadi di sisi browser tanpa bergantung pada server backend, data sama sekali tidak meninggalkan perangkat kalian.",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-gradient-to-br from-primary-500 to-primary-700",
    },
    {
      title: "Mudah Digunakan",
      description:
        "Desain antarmuka kami membuat pembuatan twibbon menjadi mudah hanya dalam beberapa klik, tampa membutuhkan skil desain.",
      icon: <MousePointerClick className="w-6 h-6" />,
      color: "bg-gradient-to-br from-primary-500 to-primary-700",
    },
    {
      title: "Frame Kustom",
      description:
        "Unggah desain frame-mu sendiri untuk membuat twibbon yang mencolok.",
      icon: <ImagePlus className="w-6 h-6" />,
      color: "bg-gradient-to-br from-primary-500 to-primary-700",
    },
    {
      title: "Hasil Kualitas Tinggi",
      description:
        "Dapatkan gambar kualitas tinggi, cocok untuk dibagikan ke platform media sosial apasaja.",
      icon: <Smartphone className="w-6 h-6" />,
      color: "bg-gradient-to-br from-primary-500 to-primary-700",
    },
  ];

  return (
    <section className="w-full py-24 px-4 md:px-8 bg-gradient-to-b from-neutral-50 to-white">
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
            Kenapa Pilih Moklet Twibbon
          </motion.h2>

          <motion.p
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Platform kami menawarkan beberapa kelebihan dari platform pembuat
            lainnya
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 border border-neutral-100 shadow-sm"
              variants={featureVariants}
            >
              <div className="flex items-start gap-5">
                <div className="relative">
                  <motion.div
                    className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center text-white`}
                    variants={iconContainerVariants}
                  >
                    {feature.icon}
                  </motion.div>

                  {/* Pulse effect */}
                  <motion.div
                    className={`absolute inset-0 ${feature.color} rounded-xl`}
                    variants={pulseVariants}
                  />

                  {/* Animated particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-white"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0],
                        x: [0, (Math.random() - 0.5) * 20],
                        y: [0, (Math.random() - 0.5) * 20],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 1 + index * 0.2 + i * 0.3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                    />
                  ))}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
