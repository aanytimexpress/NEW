"use client";

import { Facebook, Link2, MessageCircle, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareActionsProps {
  url: string;
  title: string;
}

export function ShareActions({ url, title }: ShareActionsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyUrl() {
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="outline" size="sm">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </a>
      </Button>
      <Button asChild variant="outline" size="sm">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noreferrer"
        >
          <Twitter className="h-4 w-4" />
          X
        </a>
      </Button>
      <Button asChild variant="outline" size="sm">
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={() => void copyUrl()}>
        <Link2 className="h-4 w-4" />
        Copy
      </Button>
    </div>
  );
}
