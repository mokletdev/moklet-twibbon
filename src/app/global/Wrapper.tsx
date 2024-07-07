import { ReactNode } from "react";

import cn from "@/lib/clsx";

interface SectionWrapperProps {
  children?: ReactNode;
  id: string;
  className?: string;
}

export function SectionWrapper({
  children,
  id,
  className,
}: Readonly<SectionWrapperProps>) {
  return (
    <section className={cn("relative w-full py-[82px]", className)} id={id}>
      {children}
    </section>
  );
}

export function SmallSectionWrapper({
  children,
  id,
  className,
}: Readonly<SectionWrapperProps>) {
  return (
    <section
      className={cn("w-full py-[32px] pt-[42px] xl:mt-0", className)}
      id={id}
    >
      {children}
    </section>
  );
}
