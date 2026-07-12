"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StreamingTextProps {
  text: string;
  onComplete?: () => void;
  speed?: number;
}

export function StreamingText({
  text,
  onComplete,
  speed = 18,
}: StreamingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-[15px] text-text-primary leading-relaxed"
    >
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-primary mr-0.5 align-middle"
        />
      )}
    </motion.p>
  );
}
