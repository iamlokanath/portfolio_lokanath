"use client";

import dynamic from "next/dynamic";

const AskLpLauncher = dynamic(() => import("./AskLpLauncher"), {
  ssr: false,
  loading: () => null,
});

/** Lazy-loaded entry so the chat bundle does not block initial portfolio load. */
export default function AskLpWidget() {
  return <AskLpLauncher />;
}
