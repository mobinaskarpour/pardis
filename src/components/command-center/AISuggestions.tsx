"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { spring } from "@/lib/motion";
import { aiSuggestions } from "@/lib/mock-data";
import { Card, Button } from "@/components/core";

export function AISuggestions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 2, ...spring.soft }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} strokeWidth={1.75} className="text-accent-indigo" />
        <p className="text-[13px] font-medium text-text-tertiary">
          پیشنهادهای AI
        </p>
      </div>

      <div className="space-y-2">
        {aiSuggestions.map((suggestion, i) => (
          <Card
            key={suggestion.id}
            variant={suggestion.priority === "high" ? "insight" : "ai"}
            hero={suggestion.text}
            padding="sm"
            className="cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1 + i * 0.08, ...spring.gentle }}
            >
              <Button variant="ghost" size="sm" className="mt-2 w-full">
                بررسی
              </Button>
            </motion.div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
