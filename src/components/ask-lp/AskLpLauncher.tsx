"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import AskLpChatWindow from "./AskLpChatWindow";

function trackOpen() {
  try {
    const key = "ask_lp_events";
    const raw = sessionStorage.getItem(key);
    const data = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    data.opened = (data.opened ?? 0) + 1;
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export default function AskLpLauncher() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    trackOpen();
  };

  return (
    <>
      {(!open || minimized) && (
        <motion.button
          type="button"
          aria-expanded={open && !minimized}
          aria-controls="ask-lp-panel"
          aria-label="Open Ask LP — Explore my experience through AI"
          onClick={handleOpen}
          className={cn(
            "fixed z-[60] flex items-center gap-2 rounded-full px-4 py-3",
            "bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))]",
            "bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium",
            "shadow-lg shadow-black/40 border border-white/20 backdrop-blur-md",
            "hover:opacity-95 transition-opacity",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          )}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            {!reduceMotion ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-60" />
            ) : null}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          ✦ Ask LP
        </motion.button>
      )}

      <AskLpChatWindow
        open={open && !minimized}
        onClose={() => {
          setOpen(false);
          setMinimized(false);
        }}
        onMinimize={() => setMinimized(true)}
      />
    </>
  );
}
