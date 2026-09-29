"use client";

import ContactSection from "@/components/sections/ContactSection";
import NameHoverSection from "@/components/sections/NameHoverSection";

export default function ContactPageView() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-col bg-site pt-16">
      <ContactSection />
      <div className="mt-auto">
        <NameHoverSection />
      </div>
    </main>
  );
}
