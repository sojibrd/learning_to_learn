"use client";

import { useEffect, useState } from "react";
import { ListFilter } from "lucide-react";
import type { Heading } from "../lib/content";

/**
 * পাতার ভেতরের সূচিপত্র, যে সেকশনটা পড়া হচ্ছে সেটা চিহ্নিত করে।
 *
 * তালিকাটা markdown-এর `##`/`###` heading থেকেই আসে — আলাদা কোনো কাঠামো নয়,
 * তাই নতুন ডক লিখলে TOC নিজে থেকেই ঠিক থাকে।
 *
 * অবস্থা যায় `aria-current`-এ, ক্লাসে নয়: কোনটা current সেটা কম্পোনেন্টের
 * ব্যাপার, current দেখতে কেমন সেটা থিমের।
 */
export default function DocToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 },
    );

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  // একটা entry সূচিপত্র নয়, ওটাই পাতা।
  if (headings.length < 2) return null;

  return (
    <aside aria-label="এই পাতার সূচিপত্র" className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-4 flex flex-col gap-3">
        <div className="seam-b flex items-center gap-1.5 pb-2">
          <span className="t-muted flex" aria-hidden>
            <ListFilter size={13} />
          </span>
          <span className="t-label">এই পাতায়</span>
        </div>

        <nav className="flex flex-col gap-0.5 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(event) => {
                event.preventDefault();
                const target = document.getElementById(heading.id);
                if (!target) return;
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveId(heading.id);
              }}
              aria-current={activeId === heading.id}
              title={heading.text}
              className={`row block py-1 text-xs leading-snug truncate ${
                heading.level === 3 ? "pl-4" : "pl-1.5"
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
