"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export function Logo({
  width = 36,
  height = 37,
  className,
  priority,
}: {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag to avoid SSR/client theme mismatch, same pattern as ThemeToggle.tsx
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Image
      src={isDark ? "/logo.png" : "/logo-light-bg.png"}
      alt="Luzon Prime Realtors logo"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
