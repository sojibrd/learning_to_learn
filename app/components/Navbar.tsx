"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import ProgressReadout from "./ProgressReadout";

interface NavbarProps {
  done: number;
  total: number;
  percent: number;
  onOpenSidebar: () => void;
}

/**
 * সরু স্ক্রিনের টপ বার। `lg:` থেকে উপরে rail নিজেই পরিচয় আর progress readout
 * বহন করে, তাই এটা সম্পূর্ণ অদৃশ্য হয়ে যায় — স্ক্রিনে কখনো দুটো ব্র্যান্ড থাকে না।
 */
export default function Navbar({ done, total, percent, onOpenSidebar }: NavbarProps) {
  return (
    <header className="surface-app seam-b flex w-full shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:hidden">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="control control--quiet shrink-0 p-2"
          aria-label="নেভিগেশন খুলুন"
        >
          <Menu size={16} />
        </button>

        <span className="shrink-0 text-2xl" aria-hidden>
          🧠
        </span>
        <div className="min-w-0">
          <Link href="/" className="t-title block truncate text-base sm:text-xl">
            শেখা কীভাবে শিখতে হয়
          </Link>
          <p className="t-caption hidden sm:block">সাত ভাগের রেফারেন্স</p>
        </div>
      </div>

      <div className="surface-raised hidden shrink-0 items-center gap-2 px-3 py-1.5 sm:flex sm:gap-3 sm:px-4">
        <span className="t-label hidden md:inline">অগ্রগতি</span>
        <span className="t-mono t-accent text-xs sm:text-sm" suppressHydrationWarning>
          {done}/{total}
          <span className="hidden md:inline"> ({percent}%)</span>
        </span>
        <ProgressReadout percent={percent} className="h-2 w-16 sm:w-20" />
      </div>
    </header>
  );
}
