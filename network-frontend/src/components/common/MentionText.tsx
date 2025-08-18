"use client";

import Link from "next/link";

interface MentionTextProps {
  content: string;
}

export function MentionText({ content }: MentionTextProps) {
  // Regex: match @username (chỉ chữ, số, _)
  const parts = content.split(/(@[a-zA-Z0-9_-]+)/g);

  return (
    <span className="whitespace-pre-line">
      {parts.map((part, i) =>
        part.startsWith("@") ? (
          <Link
            key={i}
            href={`/in/${part.slice(1)}`} // bỏ dấu @
            className="text-blue-600 font-medium hover:underline"
          >
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
