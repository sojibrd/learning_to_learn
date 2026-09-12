"use client";

import { useMemo, useState, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, PanelLeftClose, Search, X } from "lucide-react";
import type { Doc, TopicIndexEntry } from "../lib/content";
import ProgressReadout from "./ProgressReadout";

export interface SidebarDocState {
  /** "পড়া হয়েছে" টগল দেওয়া আছে কি না */
  read: boolean;
  topicsDone: number;
  topicTotal: number;
}

interface SidebarProps {
  docs: Doc[];
  topicIndex: TopicIndexEntry[];
  /** route → অবস্থা; Shell একবার হিসাব করে দুই mount-এ পাঠায় */
  docState: Record<string, SidebarDocState>;
  progressPercent: number;
  /** শুধু drawer-এ — তালিকার বেরোনোর পথ */
  onClose?: () => void;
  /** শুধু rail-এ — তালিকা ভাঁজ করার পথ */
  onCollapse?: () => void;
  /** rail-এর input, যাতে `/` ও Ctrl+K যেকোনো জায়গা থেকে পৌঁছাতে পারে */
  searchRef?: RefObject<HTMLInputElement | null>;
  /** hydration-এর আগে কোনো progress সংখ্যা দেখানো যাবে না */
  mounted: boolean;
}

function normalize(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

/**
 * ভাগ → বিষয় নেভিগেশন, সাথে search।
 *
 * একটাই কম্পোনেন্ট দুই জায়গায় বসে: `lg:` rail আর তার নিচের drawer। পার্থক্য
 * শুধু বেরোনোর পথে; দুটো আলাদা কম্পোনেন্ট মানে দুটো তালিকা সময়ের সাথে আলাদা
 * হয়ে যাওয়া।
 *
 * search-এর দ্বিতীয় গ্রুপটা heading নয়, **বিষয়** — কারণ এই সাইটে খোঁজার
 * জিনিসটা সেকশনের নাম নয়, "Interleaving" বা "Parkinson's law"।
 */
export default function Sidebar({
  docs,
  topicIndex,
  docState,
  progressPercent,
  onClose,
  onCollapse,
  searchRef,
  mounted,
}: SidebarProps) {
  const pathname = normalize(usePathname());
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const searching = query.length > 0;

  const { docMatches, topicMatches } = useMemo(() => {
    if (!searching) return { docMatches: [], topicMatches: [] };
    return {
      docMatches: docs.filter((doc) => doc.title.toLowerCase().includes(query)),
      topicMatches: topicIndex.filter((entry) => entry.label.toLowerCase().includes(query)),
    };
  }, [docs, topicIndex, query, searching]);

  const noMatches = searching && docMatches.length === 0 && topicMatches.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="seam-b flex shrink-0 items-center justify-between gap-2 px-4 py-3">
        <Link href="/" onClick={onClose} className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-xl" aria-hidden>
            🧠
          </span>
          <span className="t-title truncate text-sm">শেখা কীভাবে শিখতে হয়</span>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          {onClose && (
            <button
              onClick={onClose}
              className="control control--quiet p-1.5"
              aria-label="সাইডবার বন্ধ করুন"
            >
              <X size={14} />
            </button>
          )}

          {onCollapse && (
            <button
              onClick={onCollapse}
              className="control control--quiet p-1.5"
              aria-label="সূচিপত্র লুকান"
              aria-expanded
              aria-controls="site-sidebar"
            >
              <PanelLeftClose size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-4 px-4 pt-4">
        <ProgressReadout percent={mounted ? progressPercent : 0} />

        <div className="relative">
          <span className="t-muted pointer-events-none absolute left-2.5 top-2.5 flex" aria-hidden>
            <Search size={14} />
          </span>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              if (search) setSearch("");
              else event.currentTarget.blur();
            }}
            placeholder="ভাগ বা বিষয় খুঁজুন..."
            aria-label="ভাগ বা বিষয় খুঁজুন (শর্টকাট: / বা Ctrl+K)"
            className="surface-well t-body w-full py-2 pl-8 pr-8 text-sm"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="control control--quiet absolute right-1.5 top-1.5 px-1.5 py-1"
              aria-label="খোঁজা বাতিল"
            >
              <X size={12} />
            </button>
          ) : (
            <span
              className="t-caption t-mono pointer-events-none absolute right-2.5 top-2 hidden select-none text-[11px] lg:inline"
              title="শর্টকাট: / অথবা Ctrl+K"
            >
              /
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {searching ? (
          <div className="flex flex-col gap-5">
            {noMatches && (
              <div className="surface-well t-caption p-4 text-center">
                &ldquo;{search}&rdquo; দিয়ে কিছু পাওয়া যায়নি।
              </div>
            )}

            {docMatches.length > 0 && (
              <div className="topic-group flex flex-col gap-1.5 pb-4">
                <span className="t-label">ভাগ ({docMatches.length})</span>
                {docMatches.map((doc) => (
                  <Link
                    key={doc.route}
                    href={doc.route}
                    onClick={onClose}
                    aria-current={normalize(doc.route) === pathname ? "true" : undefined}
                    className="row block truncate px-3 py-2 text-xs"
                  >
                    {doc.title}
                  </Link>
                ))}
              </div>
            )}

            {topicMatches.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="t-label">বিষয় ({topicMatches.length})</span>
                {topicMatches.map((entry) => (
                  <Link
                    key={`${entry.docRoute}${entry.topicId}`}
                    href={`${entry.docRoute}#${entry.topicId}`}
                    onClick={onClose}
                    className="row block px-3 py-2"
                  >
                    <span className="block truncate text-xs">{entry.label}</span>
                    <span className="t-caption block truncate">{entry.docTitle}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {docs.map((doc) => {
              const state = docState[doc.route];
              const active = normalize(doc.route) === pathname;
              const read = mounted && state?.read;

              return (
                <Link
                  key={doc.route}
                  href={doc.route}
                  onClick={onClose}
                  aria-current={active ? "true" : undefined}
                  className="row flex items-center justify-between gap-2 px-3 py-2 text-xs"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="w-3 shrink-0" aria-hidden suppressHydrationWarning>
                      {read ? <Check size={11} /> : null}
                    </span>
                    <span className="truncate">{doc.title}</span>
                  </span>
                  {state && state.topicTotal > 0 && (
                    <span className="chip shrink-0" suppressHydrationWarning>
                      {mounted ? state.topicsDone : 0}/{state.topicTotal}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
