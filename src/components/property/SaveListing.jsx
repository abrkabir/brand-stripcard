"use client";

import { useState } from "react";
import { HeartIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The save control on a property card.
 *
 * Its own client island so `PropertyCard` can stay on the server — the button
 * is the only thing in the panel that has state.
 *
 * `aria-pressed` rather than swapping the label: it is one control in two
 * states, and that is the attribute screen readers announce for a toggle.
 *
 * TODO: Backend — persist against the visitor's account. Until then the state
 * is local and resets on navigation, which is honest: nothing is being stored.
 */
export function SaveListing({ title }) {
  const [saved, setSaved] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      arrow={false}
      aria-pressed={saved}
      aria-label={saved ? `Saved ${title}` : `Save ${title}`}
      onClick={() => setSaved((on) => !on)}
      className="btn--icon"
    >
      <HeartIcon
        className={cn("size-4 transition-transform", saved && "scale-110")}
        fill={saved ? "currentColor" : "none"}
      />
    </Button>
  );
}
