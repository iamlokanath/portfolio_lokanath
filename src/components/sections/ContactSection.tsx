"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { AppIcon } from "@/components/shared/AppIcon";
import { SocialLinks } from "@/components/shared/SocialLinks";
import contact from "@/data/content/contact.json";
import { envOr, publicEmailHref } from "@/lib/env-public";
import type { SocialLink } from "@/types/portfolio";

const fieldClass =
  "h-11 w-full rounded-lg border border-white/10 bg-[#0c1526] px-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400/40";

export default function ContactSection() {
  const email = envOr(contact.emailEnvKey, contact.emailFallback);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setToast(null);
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setToast({
          kind: "error",
          message: data.error || "Could not send the message.",
        });
        return;
      }
      setToast({ kind: "success", message: "Message sent successfully." });
      form.reset();
    } catch {
      setToast({
        kind: "error",
        message: "Could not send the message. Try again in a moment.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="px-4 sm:px-6 py-16 md:py-20">
      {toast ? (
        <div
          role="status"
          className={`fixed right-4 top-24 z-[70] max-w-sm rounded-xl border px-4 py-3 text-sm shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${
            toast.kind === "success"
              ? "border-emerald-400/30 bg-[#06281f] text-emerald-100"
              : "border-red-400/30 bg-[#2a1014] text-red-100"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
      <Container className="max-w-6xl">
        <div className="grid min-w-0 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-400">
              {contact.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {contact.heading}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-400">
              {contact.body}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={publicEmailHref(email)}
                className="inline-flex min-w-0 items-center gap-2 text-sm text-slate-300 hover:text-white break-all"
              >
                <AppIcon name="mail" size={15} className="text-sky-300" />
                {email}
              </a>
              <p className="inline-flex items-center gap-2 text-sm text-slate-300">
                <AppIcon name="map-pin" size={15} className="text-sky-300" />
                {contact.location}
              </p>
              <SocialLinks
                items={contact.socials as SocialLink[]}
                compact
              />
            </div>
          </div>

          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                name="name"
                required
                aria-label={contact.form.namePlaceholder}
                placeholder={contact.form.namePlaceholder}
                className={fieldClass}
              />
              <input
                name="email"
                type="email"
                required
                aria-label={contact.form.emailPlaceholder}
                placeholder={contact.form.emailPlaceholder}
                className={fieldClass}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                name="phone"
                type="tel"
                required
                aria-label={contact.form.phonePlaceholder}
                placeholder={contact.form.phonePlaceholder}
                className={fieldClass}
              />
              <input
                name="subject"
                required
                aria-label={contact.form.subjectPlaceholder}
                placeholder={contact.form.subjectPlaceholder}
                className={fieldClass}
              />
            </div>

            <textarea
              name="message"
              required
              rows={3}
              aria-label={contact.form.messagePlaceholder}
              placeholder={contact.form.messagePlaceholder}
              className="w-full min-h-[92px] rounded-lg border border-white/10 bg-[#0c1526] px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400/40 resize-none"
            />

            <button
              type="submit"
              disabled={sending}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] px-5 text-sm font-medium text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:opacity-95 disabled:opacity-60"
            >
              {sending ? "Sending" : contact.form.submitLabel}
              <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
