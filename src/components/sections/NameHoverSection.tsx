"use client";

import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function NameHoverSection() {
  return (
    <section aria-label="Lokanath" className="w-full px-1 pb-2 pt-8 sm:px-3">
      <div className="aspect-[860/190] w-full">
        <TextHoverEffect text="LOKANATH" />
      </div>
    </section>
  );
}
