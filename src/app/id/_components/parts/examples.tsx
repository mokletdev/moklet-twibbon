import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

const EXAMPLES = [
  {
    title: "Movaganza",
    category: "Memo",
    image: "/examples/Example Twibbon 1.jpg",
  },
  {
    title: "MPLS 2024",
    category: "OSIS",
    image: "/examples/Example Twibbon 2.jpg",
  },
  {
    title: "MOYI",
    category: "METIC",
    image: "/examples/Example Twibbon 3.jpg",
  },
];

export const Examples = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const examples = useMemo(() => {
    const isAll = selectedCategory === null;

    const filteredExamples = isAll
      ? EXAMPLES
      : EXAMPLES.filter((example) => example.category === selectedCategory);

    return filteredExamples;
  }, [selectedCategory]);

  const categories = useMemo(
    () => Array.from(new Set(EXAMPLES.map((example) => example.category))),
    []
  );

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

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

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
            Contoh Twibbon
          </motion.h2>

          <motion.p
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Lihat beberapa hasil twibbon yang dibuat menggunakan platform kita
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-primary-500 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
          >
            Semua
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {examples.map((example, index) => (
            <motion.div
              key={index}
              className="relative rounded-xl overflow-hidden shadow-md bg-white border border-neutral-200 aspect-square group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
            >
              <motion.div
                className="w-full h-full"
                animate={{
                  scale: hoveredIndex === index ? 1.05 : 1,
                }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={example.image || "/placeholder.svg"}
                  alt={example.title}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6"
                variants={overlayVariants}
                initial="hidden"
                animate={hoveredIndex === index ? "visible" : "hidden"}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    hoveredIndex === index
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="text-xs font-medium text-primary-300 mb-1">
                    {example.category}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {example.title}
                  </h3>
                </motion.div>
              </motion.div>

              <div className="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-neutral-800">
                {example.category}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
