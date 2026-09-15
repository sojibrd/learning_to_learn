import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "../components/Markdown";
import Pager from "../components/Pager";
import { toBnDigits } from "../lib/dates";
import { getDays } from "../lib/plan";
import { getTopicDoc, getTopicDocs, parseDoc } from "../lib/topics";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getTopicDocs().map((doc) => ({ slug: doc.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getTopicDoc(slug)?.title ?? "বিষয়" };
}

/**
 * একটা ডক, `topics/`-এর লেখা হুবহু। প্রতিটা বিষয়ের `id` = anchor — বাকি সাইটের 🧠
 * chip এখানে নামে। বিষয়ের পাশে plan-এর কোন দিনে ওটা আসে (দিনের শিরোনাম = বিষয়ের নাম)।
 */
export default async function TopicDocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const docs = getTopicDocs();
  const index = docs.findIndex((doc) => doc.slug === slug);
  if (index === -1) notFound();

  const doc = docs[index];
  const { title, sections, topics } = parseDoc(doc.raw);
  const dayByTitle = new Map(getDays().map((day) => [day.title, day]));
  const prev = docs[index - 1];
  const next = docs[index + 1];

  return (
    <>
      <header className="flex flex-col gap-2">
        <div className="t-label flex flex-wrap items-center gap-2">
          <Link href="/topics/" className="t-accent">
            বিষয়
          </Link>
          <span>•</span>
          <span>{toBnDigits(doc.order)}</span>
          {topics.length > 0 && (
            <>
              <span>•</span>
              <span>{toBnDigits(topics.length)}টা বিষয়</span>
            </>
          )}
        </div>
        <h1 className="t-title text-2xl sm:text-3xl">{title}</h1>
      </header>

      <article className="surface-panel flex flex-col gap-4 p-4 sm:p-6 md:p-8">
        {sections.map((section, i) =>
          section.kind === "markdown" ? (
            <Markdown key={i}>{section.markdown}</Markdown>
          ) : (
            <ul key={i} className="flex flex-col gap-2">
              {section.topics.map((topic) => {
                const day = dayByTitle.get(topic.label);
                return (
                  <li key={topic.id} id={topic.id} className="surface-raised flex scroll-mt-4 flex-col gap-2 p-3 sm:p-4">
                    <Markdown inline className="task-text text-sm">
                      {topic.markdown}
                    </Markdown>
                    {day && (
                      <Link href={`/day/${day.code}/`} className="chip chip--accent self-start">
                        দিন {day.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ),
        )}
      </article>

      <Pager
        label="বিষয়"
        prev={prev && { href: prev.route, label: prev.title }}
        next={next && { href: next.route, label: next.title }}
      />
    </>
  );
}
