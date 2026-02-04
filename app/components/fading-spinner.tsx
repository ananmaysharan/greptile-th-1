"use client";

import { motion } from "motion/react";

interface FadingSpinnerProps {
  size?: number;
  className?: string;
}

const lines = [
  { x1: 128, y1: 32, x2: 128, y2: 64 },      // top
  { x1: 195.88, y1: 60.12, x2: 173.25, y2: 82.75 },  // top-right
  { x1: 224, y1: 128, x2: 192, y2: 128 },    // right
  { x1: 195.88, y1: 195.88, x2: 173.25, y2: 173.25 }, // bottom-right
  { x1: 128, y1: 224, x2: 128, y2: 192 },    // bottom
  { x1: 60.12, y1: 195.88, x2: 82.75, y2: 173.25 },  // bottom-left
  { x1: 32, y1: 128, x2: 64, y2: 128 },      // left
  { x1: 60.12, y1: 60.12, x2: 82.75, y2: 82.75 },    // top-left
];

export function FadingSpinner({ size = 32, className }: FadingSpinnerProps) {
  const numSegments = lines.length;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
    >
      <rect width="256" height="256" fill="none" />
      {lines.map((line, i) => {
        const delay = (i / numSegments) * 0.8;

        return (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            fill="none"
            stroke="var(--highlight)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </svg>
  );
}
