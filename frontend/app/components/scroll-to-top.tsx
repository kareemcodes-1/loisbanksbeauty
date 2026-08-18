"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    // Tell the browser NOT to restore the previous scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force the page to start at the top
    window.scrollTo(0, 0);
  }, []);

  return null;
}