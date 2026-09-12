"use client";

import { Check, Square } from "lucide-react";
import type { Topic } from "../lib/content";
import Markdown from "./Markdown";
import { useMounted, useProgress } from "../hooks/useProgress";

type Props = {
  route: string;
  topics: Topic[];
};

/**
 * ডকের checkbox-বিষয়গুলো — সাইটের আসল কাজ এখানেই।
 *
 * markdown-এ এগুলো `- [ ]` হিসেবে আছে, আর remark-gfm ওগুলোকে নিষ্ক্রিয়
 * checkbox বানিয়ে দিত। তাই বিষয়ের খণ্ডগুলো `Markdown`-এর বাইরে এনে এখানে
 * রেন্ডার করা হয় — যাতে টিকটা সত্যিই কাজ করে আর ব্রাউজারে জমা থাকে।
 *
 * অবস্থা যায় `aria-pressed`-এ, ক্লাসে নয়: কোনটা টিক দেওয়া সেটা কম্পোনেন্টের
 * ব্যাপার, টিক দেখতে কেমন সেটা থিমের।
 */
export default function TopicList({ route, topics }: Props) {
  const mounted = useMounted();
  const { isTopicDone, toggleTopic } = useProgress();

  if (topics.length === 0) return null;

  return (
    <ul className="mt-5 flex flex-col gap-2">
      {topics.map((topic) => {
        const checked = mounted && isTopicDone(route, topic.id);
        return (
          <li key={topic.id} id={topic.id} className="scroll-mt-4">
            <button
              type="button"
              aria-pressed={checked}
              onClick={() => toggleTopic(route, topic.id)}
              className="surface-well flex w-full items-start gap-3 p-3 text-left"
              suppressHydrationWarning
            >
              <span className="mt-0.5 shrink-0" aria-hidden suppressHydrationWarning>
                {checked ? <Check size={15} /> : <Square size={15} />}
              </span>
              <Markdown inline className="t-body min-w-0 text-sm">
                {topic.markdown}
              </Markdown>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
