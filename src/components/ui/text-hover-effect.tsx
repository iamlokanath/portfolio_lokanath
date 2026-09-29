"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function TextHoverEffect({
  text,
  duration = 0,
}: {
  text: string;
  duration?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const cx = ((cursor.x - svgRect.left) / svgRect.width) * 100;
    const cy = ((cursor.y - svgRect.top) / svgRect.height) * 100;
    setMaskPosition({ cx: `${cx}%`, cy: `${cy}%` });
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 860 190"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(event) => setCursor({ x: event.clientX, y: event.clientY })}
      className="select-none"
    >
      <defs>
        <linearGradient id="textHoverGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="860" y2="190">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="40%" stopColor="#818cf8" />
          <stop offset="70%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <motion.radialGradient
          id="textHoverReveal"
          gradientUnits="userSpaceOnUse"
          r="22%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={{ cx: maskPosition.cx, cy: maskPosition.cy }}
          transition={{ duration, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textHoverMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#textHoverReveal)" />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1.2"
        fontSize="158"
        fontWeight="700"
        className="fill-transparent font-sans"
        style={{ stroke: "rgba(148,163,184,0.35)", opacity: hovered ? 0.7 : 0.35 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1.2"
        fontSize="158"
        fontWeight="700"
        className="fill-transparent font-sans"
        style={{ stroke: "rgba(148,163,184,0.45)" }}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textHoverGradient)"
        strokeWidth="1.2"
        fontSize="158"
        fontWeight="700"
        mask="url(#textHoverMask)"
        className="fill-transparent font-sans"
      >
        {text}
      </text>
    </svg>
  );
}
