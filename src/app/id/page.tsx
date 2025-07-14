"use client";

import { Footer } from "./_components/footer";
import { Examples } from "./_components/parts/examples";
import { Features } from "./_components/parts/features";
import { Hero } from "./_components/parts/hero";
import { HowItWorks } from "./_components/parts/how-it-works";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-100">
      <Hero />
      <HowItWorks />
      <Features />
      <Examples />
      <Footer />
    </div>
  );
}
