"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useMounted, useProgress } from "../hooks/useProgress";
import ProgressReadout from "./ProgressReadout";

export type HomeDoc = {
  route: string;
  title: string;
  order: string;
  blurb: string;
  topicIds: string[];
};

/**
 * হোমপেজ — সাতটা ভাগের মানচিত্র, সাথে কোথায় দাঁড়িয়ে আছেন তার হিসাব।
 *
 * প্রথম যে কার্ডটা চোখে পড়ে সেটা "শুরু এখানে", আর সেটা ১ নম্বর ভাগ নয় —
 * `07-examples`। কারণ বাকি ছয়টা ফাইল বলে বিষয়গুলো কী, আর প্রয়োগ না দেখলে
 * ওগুলো শুধু একটা তালিকা।
 */
export default function Home({ docs, startRoute }: { docs: HomeDoc[]; startRoute?: string }) {
  const mounted = useMounted();
  const { isRead, topicsDoneIn } = useProgress();

  const totals = docs.reduce(
    (acc, doc) => {
      acc.total += doc.topicIds.length;
      acc.done += mounted ? topicsDoneIn(doc.route, doc.topicIds) : 0;
      return acc;
    },
    { done: 0, total: 0 },
  );
  const percent = totals.total > 0 ? Math.round((totals.done / totals.total) * 100) : 0;
  const start = docs.find((doc) => doc.route === startRoute);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 md:px-10 md:py-14">
      <header className="flex flex-col gap-3">
        <span className="t-label">Learning to learn</span>
        <h1 className="t-title text-2xl md:text-3xl">শেখা কীভাবে শিখতে হয়</h1>
        <p className="t-body max-w-2xl text-sm">
          শেখার নীতি, বিজ্ঞান ও কৌশলের বাংলা রেফারেন্স — {totals.total}টি বিষয় সাত ভাগে।
          প্রতিটা বিষয়ের পাশে টিক দেওয়ার ঘর আছে; টিকগুলো শুধু আপনার এই ব্রাউজারে জমা থাকে।
        </p>
      </header>

      <section className="surface-raised mt-7 flex flex-wrap items-center gap-4 px-4 py-3">
        <span className="t-label">অগ্রগতি</span>
        <span className="t-mono t-accent text-sm" suppressHydrationWarning>
          {totals.done}/{totals.total} ({percent}%)
        </span>
        <ProgressReadout percent={percent} className="h-2 min-w-32 flex-1" />
      </section>

      {start ? (
        <section className="callout callout--accent mt-7 flex flex-col gap-2">
          <span className="t-label">শুরু এখানে</span>
          <p className="t-body text-sm">
            বাকি ছয়টা ভাগ বলে বিষয়গুলো <em>কী</em>। {start.title.split("—")[0].trim()} দেখায়
            আপনার নিজের কাজে ওগুলো <em>কেমন দেখতে</em> — ছয়টা বাস্তব দৃশ্যে।
          </p>
          <Link href={start.route} className="control control--primary mt-1 self-start px-3 py-2 text-xs">
            দৃশ্যগুলো দেখুন
            <ArrowRight size={13} />
          </Link>
        </section>
      ) : null}

      <section className="mt-8 flex flex-col gap-2">
        <h2 className="t-label">সাতটি ভাগ</h2>

        {docs.map((doc) => {
          const done = mounted ? topicsDoneIn(doc.route, doc.topicIds) : 0;
          const read = mounted && isRead(doc.route);

          return (
            <Link
              key={doc.route}
              href={doc.route}
              className="surface-well flex items-start gap-3 p-4"
            >
              <span className="t-mono t-muted mt-0.5 shrink-0 text-xs">{doc.order}</span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="t-strong text-sm">{doc.title}</span>
                  {read ? (
                    <span className="t-ok flex shrink-0" aria-label="পড়া হয়েছে" suppressHydrationWarning>
                      <Check size={13} />
                    </span>
                  ) : null}
                </span>
                {doc.blurb ? <span className="t-caption mt-1 block">{doc.blurb}</span> : null}
              </span>

              {doc.topicIds.length > 0 ? (
                <span className="chip shrink-0" suppressHydrationWarning>
                  {done}/{doc.topicIds.length}
                </span>
              ) : null}
            </Link>
          );
        })}
      </section>
    </div>
  );
}
