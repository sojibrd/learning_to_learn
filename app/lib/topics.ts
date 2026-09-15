import fs from "node:fs";
import path from "node:path";
import { slugify } from "./slug";

/**
 * server-only — `fs` দিয়ে build-এর সময় `topics/` পড়ে। client component এখান থেকে
 * শুধু `import type` নিতে পারে।
 *
 * `topics/<nn>-<নাম>.md` — ৭টা ডক, flat। route ফাইলনাম থেকে, নম্বর বাদে:
 * `05-techniques.md` → `/techniques/`। বিষয়ের anchor = `slugify(নাম)`।
 * route আর anchor বদলাবেন না — বাকি সাইটগুলোর 🧠 chip ঠিক এখানেই নামে।
 */
const TOPICS_DIR = path.join(process.cwd(), "topics");
const DOC_PATTERN = /^(\d\d)-(.+)\.md$/;

export type TopicDoc = {
  /** URL segment, e.g. "principle" */
  slug: string;
  /** trailing slash সহ, e.g. "/principle/" */
  route: string;
  /** ফাইলনামের ক্রম, e.g. "01" */
  order: string;
  title: string;
  raw: string;
};

/** একটা বিষয়: `- [ ] **নাম** — ব্যাখ্যা`, বা Creativity-র `- [ ] [লিংক](url) — ব্যাখ্যা` */
export type Topic = {
  /** anchor — `slugify(label)` */
  id: string;
  /** মোটা অক্ষরের নাম বা লিংকের লেখা — plan-এর দিনের শিরোনামও এটাই */
  label: string;
  /** checkbox চিহ্ন বাদে পুরো বুলেট */
  markdown: string;
};

/**
 * ডক ফাইলের ক্রমে দুই রকম খণ্ড — ছাঁচ এক নয় (Creativity-তে heading আর তালিকা
 * পালা করে, Examples-এ তালিকাই নেই), তাই ডক-নির্দিষ্ট শর্ত ছাড়াই দুটো রেন্ডার হয়।
 */
export type Section = { kind: "markdown"; markdown: string } | { kind: "topics"; topics: Topic[] };

export type ParsedDoc = { title: string; sections: Section[]; topics: Topic[] };

let docsCache: TopicDoc[] | null = null;

export function getTopicDocs(): TopicDoc[] {
  if (docsCache) return docsCache;

  docsCache = fs
    .readdirSync(TOPICS_DIR)
    .filter((file) => DOC_PATTERN.test(file))
    .sort()
    .map((file) => {
      const [, order, base] = DOC_PATTERN.exec(file)!;
      const raw = fs.readFileSync(path.join(TOPICS_DIR, file), "utf8");
      const slug = slugify(base);
      return { slug, route: `/${slug}/`, order, title: parseDoc(raw).title, raw };
    });
  return docsCache;
}

export function getTopicDoc(slug: string): TopicDoc | undefined {
  return getTopicDocs().find((doc) => doc.slug === slug);
}

const TOPIC_LINE = /^-\s+\[[ xX]\]\s+(.*)$/;

function topicLabel(text: string): string {
  const bold = /\*\*(.+?)\*\*/.exec(text);
  if (bold) return bold[1].trim();
  const link = /\[(.+?)\]\(/.exec(text);
  if (link) return link[1].trim();
  return text.replace(/[*_`]/g, "").slice(0, 60).trim();
}

export function parseDoc(raw: string): ParsedDoc {
  let title = "";
  const sections: Section[] = [];
  const topics: Topic[] = [];
  let markdown: string[] = [];
  let list: Topic[] = [];

  const flushMarkdown = () => {
    const text = markdown.join("\n").trim();
    markdown = [];
    if (text) sections.push({ kind: "markdown", markdown: text });
  };
  const flushList = () => {
    if (list.length > 0) sections.push({ kind: "topics", topics: list });
    list = [];
  };

  for (const line of raw.split(/\r?\n/)) {
    const h1 = /^#\s+(.+)$/.exec(line);
    if (!title && h1) {
      title = h1[1].trim();
      continue;
    }

    const match = TOPIC_LINE.exec(line);
    if (match) {
      flushMarkdown();
      const label = topicLabel(match[1]);
      const topic = { id: slugify(label), label, markdown: match[1] };
      list.push(topic);
      topics.push(topic);
      continue;
    }

    /* খালি লাইন তালিকা ভাঙে না — পরের অ-বুলেট লাইনটাই ভাঙে */
    if (list.length > 0 && line.trim() === "") continue;

    flushList();
    markdown.push(line);
  }

  flushList();
  flushMarkdown();
  return { title, sections, topics };
}
