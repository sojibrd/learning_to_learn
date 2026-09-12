import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DocToc from "../components/DocToc";
import DocTracker from "../components/DocTracker";
import Markdown from "../components/Markdown";
import TopicList from "../components/TopicList";
import { getDocBySlug, getDocs, getSiblings, parseDoc, readDoc } from "../lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  return { title: doc?.title ?? "পাওয়া যায়নি" };
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const { title, blocks, topics, headings } = parseDoc(readDoc(doc));
  const { prev, next } = getSiblings(doc);

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-5 py-8 md:px-10 md:py-12">
      <article className="min-w-0 max-w-3xl flex-1">
        <h1 className="t-title text-xl md:text-2xl">{title}</h1>

        {topics.length > 0 ? (
          <p className="t-caption mt-2">{topics.length}টি বিষয় — পড়া হলে টিক দিন</p>
        ) : null}

        {/* খণ্ডগুলো ফাইলের ক্রমেই বসে, তাই `06-creativity`-র মতো heading আর
            তালিকা পালা করে সাজানো ডকেও ক্রম ঠিক থাকে। */}
        {blocks.map((block, index) =>
          block.kind === "topics" ? (
            <TopicList key={index} route={doc.route} topics={block.topics} />
          ) : (
            <Markdown key={index} className="mt-6">
              {block.markdown}
            </Markdown>
          ),
        )}

        <DocTracker route={doc.route} />

        <nav className="mt-6 flex items-stretch justify-between gap-3">
          {prev ? (
            <Link href={prev.route} className="control flex-1 px-3 py-2 text-xs">
              <ArrowLeft size={13} />
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link href={next.route} className="control flex-1 justify-end px-3 py-2 text-xs">
              <span className="truncate">{next.title}</span>
              <ArrowRight size={13} />
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </article>

      <DocToc headings={headings} />
    </div>
  );
}
