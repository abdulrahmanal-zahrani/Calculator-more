"use client";

import { useState } from "react";
import Button from "./Button";

interface ShareBarProps {
  url: string;
  title: string;
  copyLabel: string;
  copiedLabel: string;
  shareLabel: string;
}

export default function ShareBar({ url, title, copyLabel, copiedLabel, shareLabel }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: "🟢",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: "𝕏",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: "✈️",
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-text-muted">{shareLabel}</span>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-elevated text-base hover:border-accent"
        >
          {link.icon}
        </a>
      ))}
      <Button variant="secondary" size="sm" onClick={handleCopy}>
        {copied ? copiedLabel : copyLabel}
      </Button>
    </div>
  );
}
