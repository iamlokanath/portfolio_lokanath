'use client';
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "../lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-4" : "py-6",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex items-center justify-between rounded-full px-6 py-3",
          "bg-white/10 backdrop-blur-md border border-white/20",
          "shadow-lg shadow-black/5",
          "transition-all duration-300",
          scrolled ? "scale-95" : "scale-100"
        )}>
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              LP
            </span>
          </Link>

          {/* Navigation Links */}
          <Menu setActive={setActive}>
            <Link href="/">
              <MenuItem setActive={setActive} active={active} item="Home" />
            </Link>
            <Link href="/projects">
              <MenuItem setActive={setActive} active={active} item="Projects" />
            </Link>
            {/* <Link href="/contact">
              <MenuItem setActive={setActive} active={active} item="Contact" />
            </Link> */}
          </Menu>
        </div>
      </div>
    </motion.div>
  );
}

export default Navbar;
