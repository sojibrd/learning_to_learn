"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "../lib/slug";

/**
 * Heading-এর anchor id। `extractHeadings()` ঠিক এই নিয়মেই id বানায় — দুটো এক
 * না থাকলে TOC-এর লিংক নীরবে কোথাও নামবে না।
 */
function headingId(children: React.ReactNode): string | undefined {
  const text = React.Children.toArray(children)
    .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : ""))
    .join("")
    .replace(/[*_`]/g, "")
    .trim();
  return text ? slugify(text) : undefined;
}

/**
 * ডকের ভেতরের রিলেটিভ লিংক (`02-lies.md`, `docs/05-techniques.md`) সাইট-route-এ
 * রূপান্তর। না করলে ক্রস-লিংকগুলো সাইটে ৪০৪ দেবে — route-এ `.md` নেই, আর
 * ফাইলনামের ক্রম-নম্বরটাও route-এ যায় না।
 *
 * নিয়মটা `content.ts`-এর slug বানানোর নিয়মের হুবহু প্রতিফলন: বেসনাম থেকে
 * `<nn>-` ছেঁটে slugify। দুটো আলাদা হয়ে গেলে লিংক ভাঙবে।
 */
export function toSiteHref(href: string): string {
  if (/^([a-z]+:|#|\/)/i.test(href)) return href;

  const [pathPart, hash] = href.split("#");
  const base = pathPart
    .replace(/\.md$/i, "")
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .at(-1);

  if (!base) return "/";
  if (/^readme$/i.test(base)) return "/";

  const slug = slugify(base.replace(/^\d\d-/, ""));
  return `/${slug}/${hash ? `#${hash}` : ""}`;
}

type Props = {
  children: string;
  /** `<p>` ছাড়া inline রেন্ডার — বিষয়ের বুলেটের জন্য */
  inline?: boolean;
  className?: string;
};

export default function Markdown({ children, inline = false, className = "" }: Props) {
  return (
    <div className={`${inline ? "" : "doc-prose"} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* এখানে কোনো `...rest` spread নেই ইচ্ছাকৃতভাবে: react-markdown
             নিজের AST-কে `node` prop হিসেবে পাঠায়, আর সেটা spread হলে DOM-এ
             `node="[object Object]"` হয়ে ছাপা পড়ে। যা দরকার শুধু সেটুকুই নেওয়া হয়। */
          a: ({ href, children: linkChildren }) => {
            const resolved = toSiteHref(href ?? "");
            const external = /^https?:/i.test(resolved);
            return (
              <a href={resolved} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {linkChildren}
              </a>
            );
          },
          h2: ({ children: h2Children }) => (
            <h2 id={headingId(h2Children)}>
              {h2Children}
            </h2>
          ),
          h3: ({ children: h3Children }) => (
            <h3 id={headingId(h3Children)}>
              {h3Children}
            </h3>
          ),
          ...(inline ? { p: ({ children: pChildren }) => <>{pChildren}</> } : {}),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
