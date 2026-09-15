import type { Metadata } from "next";
import Link from "next/link";
import { toBnDigits } from "../lib/dates";
import { getTopicDocs, parseDoc } from "../lib/topics";

export const metadata: Metadata = { title: "বিষয়" };

/** ৭টা ডকের সূচি — রেফারেন্স; রোজ শুরু "আজ" থেকে */
export default function TopicsPage() {
  const docs = getTopicDocs();

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="t-title text-2xl sm:text-3xl">বিষয়</h1>
        <p className="t-body measure text-sm">
          ৭টা ডক — প্রতিটা বিষয়ের পাশে plan-এর কোন দিনে ওটা আসে। পড়া ইনপুট; গোনা হয় দিনের কাজ।
        </p>
      </header>

      <section className="surface-panel flex flex-col gap-3 p-4 sm:p-6">
        <ul className="flex flex-col gap-1">
          {docs.map((doc) => {
            const count = parseDoc(doc.raw).topics.length;
            return (
              <li key={doc.slug}>
                <Link href={doc.route} className="row flex items-center gap-3 px-3 py-2 text-sm">
                  <span className="t-mono shrink-0 text-xs">{toBnDigits(doc.order)}</span>
                  <span className="min-w-0 flex-1 truncate">{doc.title}</span>
                  {count > 0 && <span className="chip shrink-0">{toBnDigits(count)}টা</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
