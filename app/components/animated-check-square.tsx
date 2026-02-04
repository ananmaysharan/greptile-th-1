"use client";

import { motion } from "motion/react";

interface AnimatedCheckSquareProps {
  className?: string;
  size?: number;
}

export function AnimatedCheckSquare({
  className,
  size = 256,
}: AnimatedCheckSquareProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
    >
      <rect width="256" height="256" fill="none" />
      {/* Square */}
      <rect
        x="40"
        y="40"
        width="176"
        height="176"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      {/* Checkmark */}
      <motion.polyline
        points="88 136 112 160 168 104"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.3, delay: 0.2, ease: "easeOut" },
          opacity: { duration: 0, delay: 0.2 },
        }}
      />
    </motion.svg>
  );
}
