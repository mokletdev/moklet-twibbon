import { ReactNode } from "react";

import cn from "../../../lib/clsx";

interface TextProps {
  children?: ReactNode;
  className?: string;
  textClassName?: string;
  underlineClassName?: string;
}

export function H1({ children, className }: Readonly<TextProps>) {
  return (
    <h1
      className={cn(
        "text-[36px] font-bold leading-[130%] sm:text-[44px]",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function P({ children, className }: Readonly<TextProps>) {
  return (
    <p className={cn("text-neutral-500 leading-[160%]", className)}>
      {children}
    </p>
  );
}

export function H2({ children, className }: Readonly<TextProps>) {
  return (
    <h2
      className={cn(
        "text-[24px] md:text-4xl leading-[130%] font-bold text-black",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: Readonly<TextProps>) {
  return (
    <h3
      className={cn(
        "text-[28px] leading-[140%] font-bold text-black",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className }: Readonly<TextProps>) {
  return (
    <h4
      className={cn("text-2xl leading-[150%] font-bold text-black", className)}
    >
      {children}
    </h4>
  );
}

export function UnderlinedTitle({
  children,
  textClassName,
  underlineClassName,
  className,
}: Readonly<TextProps>) {
  return (
    <div
      className={cn(
        "flex flex-col items-start md:flex-row md:items-center justify-between gap-[18px] md:gap-0 mb-[18px]",
        className
      )}
    >
      <div className="relative">
        <H2 className={cn("z-10 font-bold text-black", textClassName)}>
          {children}
        </H2>
        <div
          className={cn(
            "absolute left-[3px] -z-10 h-[16px] bg-primary-100",
            underlineClassName
          )}
        ></div>
      </div>
    </div>
  );
}
