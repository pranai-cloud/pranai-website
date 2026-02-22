"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "pranai_cookie_consent";

type ConsentState = "pending" | "accepted" | "declined";

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>("accepted");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setConsent("pending");
    } else {
      setConsent(stored as ConsentState);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setConsent("declined");
  }

  if (!mounted || consent !== "pending") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] border-t border-black/[0.08] bg-white/95 px-4 py-4 shadow-lg shadow-black/[0.06] backdrop-blur-lg sm:px-6">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-secondary">
          We use cookies and analytics (Google Analytics) to improve your
          experience. By accepting, you consent to our use of these
          technologies. See our{" "}
          <Link
            href="/privacy-policy"
            className="font-medium text-pran-orange hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={decline}
            className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-xs font-medium text-secondary transition-colors hover:bg-stone-50 hover:text-primary"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-pran-orange px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-pran-orange-light"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
