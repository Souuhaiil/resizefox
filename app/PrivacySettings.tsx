"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    resizefoxConsent?: { isReady: () => boolean; revoke: () => boolean };
  }
}

export default function PrivacySettings() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const update = () => setReady(window.resizefoxConsent?.isReady() ?? false);
    window.addEventListener("resizefox-consent-ready", update);
    update();
    return () => window.removeEventListener("resizefox-consent-ready", update);
  }, []);
  if (!ready) return null;
  return <button type="button" className="mt-4 text-sm text-slate-300 underline hover:text-white"
    onClick={() => window.resizefoxConsent?.revoke()}>Privacy and cookie settings</button>;
}
