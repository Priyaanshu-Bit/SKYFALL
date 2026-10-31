"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isAudioMuted, toggleAudioMute, playClickTone } from "@/lib/sound";

interface AudioToggleProps {
  className?: string;
}

export function AudioToggle({ className = "" }: AudioToggleProps) {
  const [muted, setMuted] = React.useState(false);

  React.useEffect(() => {
    setMuted(isAudioMuted());

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail) {
        setMuted(customEvent.detail.muted);
      }
    };

    window.addEventListener("skyfall:audio-toggle", handleToggle);
    return () => {
      window.removeEventListener("skyfall:audio-toggle", handleToggle);
    };
  }, []);

  const handleToggle = () => {
    const next = toggleAudioMute();
    setMuted(next);
    if (!next) {
      // If unmuting, give a tiny pleasant feedback click
      playClickTone();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 transition-colors hover:border-slate-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400 ${className}`}
      title={muted ? "Unmute esports sound effects" : "Mute sound effects"}
      aria-label={muted ? "Unmute esports sound effects" : "Mute sound effects"}
    >
      {muted ? (
        <VolumeX className="h-4 w-4 text-slate-500" />
      ) : (
        <Volume2 className="h-4 w-4 text-skyfall-400" />
      )}
    </button>
  );
}
