"use client";

import { motion } from "framer-motion";

// Fades content in on route change. Opacity-only so it never creates a
// transform context that would break fixed/sticky dashboard chrome.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
