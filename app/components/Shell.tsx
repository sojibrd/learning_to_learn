"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PanelLeftOpen } from "lucide-react";
import type { Doc, TopicIndexEntry } from "../lib/content";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useMounted, useProgress } from "../hooks/useProgress";
import Navbar from "./Navbar";
import Sidebar, { type SidebarDocState } from "./Sidebar";

/**
 * সব route যে chassis ভাগ করে নেয়: rail, drawer আর যে search ওদের ছোঁয়।
 *
 * এটা page-এ নয়, layout-এ থাকে — যাতে স্ক্রিনে একটাই navigation কলাম থাকে,
 * দুটো কপি সময়ের সাথে আলাদা হয়ে না যায়।
 */
export default function Shell({
  docs,
  topicIndex,
  topicIds,
  children,
}: {
  docs: Doc[];
  topicIndex: TopicIndexEntry[];
  /** route → এই ডকের বিষয়-id; গণনার জন্য, বারবার ফাইল না পড়ে */
  topicIds: Record<string, string[]>;
  children: React.ReactNode;
}) {
  const mounted = useMounted();
  const { isRead, topicsDoneIn } = useProgress();

  const [drawerOpen, setDrawerOpen] = useState(false);
  /* rail ভাঁজ করা একটা সচেতন কাজ, তাই সেটা refresh-এর পরেও টেকে। সার্ভারে
     localStorage নেই; ডিফল্ট প্রথম paint-এ rail দৃশ্যমান রাখে আর client
     hydration-এ মিলিয়ে নেয়। */
  const [collapsed, setCollapsed] = useLocalStorage("l2l_nav_collapsed", false);
  const searchRef = useRef<HTMLInputElement>(null);

  /* সার্বিক শতাংশের ভিত্তি বিষয়ের সংখ্যা, ডকের নয় — ৫৭টা বিষয় সাতটা ডকে
     খুব অসমভাবে ছড়ানো, তাই ডক গুনলে একটা ছোট ডক শেষ করাও বড় লাফ দেখাত। */
  const { docState, progressPercent } = useMemo(() => {
    const state: Record<string, SidebarDocState> = {};
    let done = 0;
    let total = 0;

    for (const doc of docs) {
      const ids = topicIds[doc.route] ?? [];
      const topicsDone = mounted ? topicsDoneIn(doc.route, ids) : 0;
      state[doc.route] = {
        read: mounted && isRead(doc.route),
        topicsDone,
        topicTotal: ids.length,
      };
      done += topicsDone;
      total += ids.length;
    }

    return {
      docState: state,
      progressPercent: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }, [docs, topicIds, mounted, isRead, topicsDoneIn]);

  const topicTotals = useMemo(() => {
    let done = 0;
    let total = 0;
    for (const doc of docs) {
      done += docState[doc.route]?.topicsDone ?? 0;
      total += docState[doc.route]?.topicTotal ?? 0;
    }
    return { done, total };
  }, [docs, docState]);

  // drawer পাতাকে ঢেকে রাখে; পেছনের পাতা তখন স্ক্রল করা চলবে না।
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // drawer খোলা থাকলে Escape-এ বন্ধ
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  /* `/` আর Ctrl+K যেকোনো জায়গা থেকে rail-এর search-এ পৌঁছায়। ভাঁজ করা rail
     আগে খোলা হয়, নইলে focus এমন input-এ পড়ত যেটা কেউ দেখছে না; সরু স্ক্রিনে
     input থাকে drawer-এ, তাই সেটাই খোলে। */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      const slash = event.key === "/" && !typing;
      const ctrlK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      if (!slash && !ctrlK) return;

      event.preventDefault();

      if (window.matchMedia("(min-width: 1024px)").matches) {
        setCollapsed(false);
        // ভাঁজ করা rail এই tick-এ এখনো DOM-এ নেই।
        setTimeout(() => {
          searchRef.current?.focus();
          searchRef.current?.select();
        }, 0);
        return;
      }

      setDrawerOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCollapsed]);

  const sidebarProps = { docs, topicIndex, docState, progressPercent, mounted };

  return (
    /* chassis viewport-এর মালিক, আর দুই pane তার ভেতরে স্ক্রল করে। page-স্ক্রল
       করা rail-এর পাশে page-স্ক্রল করা panel থাকলে rail ঠিক যখন দরকার তখনই
       স্ক্রল হয়ে উপরে চলে যেত। */
    <div className="surface-app flex h-dvh flex-col overflow-hidden">
      <Navbar
        done={topicTotals.done}
        total={topicTotals.total}
        percent={progressPercent}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        {/* ডেস্কটপে কোনো টপ বার নেই, তাই rail একবার ভাঁজ হয়ে গেলে এই সরু
            স্ট্রিপটাই ফিরে আসার একমাত্র পথ। */}
        {collapsed && (
          <div className="surface-panel hidden shrink-0 flex-col items-center px-2 py-3 lg:flex">
            <button
              onClick={() => setCollapsed(false)}
              className="control control--quiet p-1.5"
              aria-label="সূচিপত্র খুলুন"
              aria-expanded={false}
              aria-controls="site-sidebar"
            >
              <PanelLeftOpen size={16} />
            </button>
          </div>
        )}

        <aside
          id="site-sidebar"
          className={`surface-panel hidden w-80 min-h-0 shrink-0 ${collapsed ? "" : "lg:block"}`}
        >
          <Sidebar {...sidebarProps} onCollapse={() => setCollapsed(true)} searchRef={searchRef} />
        </aside>

        {/* page নিজের প্রস্থ ও padding-এর মালিক; এই pane শুধু স্ক্রল করে। */}
        <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true">
          <div className="overlay absolute inset-0" onClick={() => setDrawerOpen(false)} />
          <aside className="surface-panel animate-slide-in-left absolute left-0 top-0 h-full w-[300px] sm:w-[360px]">
            <Sidebar {...sidebarProps} onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}
