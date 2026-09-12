"use client";

import { Check, Circle } from "lucide-react";
import { useMounted, useProgress } from "../hooks/useProgress";

/**
 * ডকের নিচের "পড়া শেষ" টগল। বিষয়-ভিত্তিক টিকের পাশে এটা আলাদা স্তর —
 * `07-examples`-এর মতো যেসব ডকে কোনো checkbox নেই, ওগুলোর হিসাব এখান থেকেই আসে।
 */
export default function DocTracker({ route }: { route: string }) {
  const mounted = useMounted();
  const { isRead, toggleRead } = useProgress();
  const read = mounted && isRead(route);

  return (
    <div className="seam-t mt-10 flex flex-wrap items-center justify-between gap-4 pt-5">
      <p className="t-caption">
        অগ্রগতি শুধু আপনার এই ব্রাউজারে জমা থাকে — কোথাও পাঠানো হয় না।
      </p>
      <button
        type="button"
        aria-pressed={read}
        onClick={() => toggleRead(route)}
        className={`control shrink-0 px-3.5 py-2 text-xs ${read ? "control--primary" : ""}`}
        suppressHydrationWarning
      >
        {read ? <Check size={13} /> : <Circle size={13} />}
        {read ? "পড়া হয়েছে" : "পড়া হয়নি"}
      </button>
    </div>
  );
}
