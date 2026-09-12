import fs from "node:fs";
import path from "node:path";
import { slugify } from "./slug";

export { slugify };

const ROOT = process.cwd();
const DOCS_DIR = "docs";

/**
 * কনটেন্ট ফাইল চেনার একমাত্র নিয়ম: `docs/`-এর সরাসরি নিচে যে `.md` ফাইলের
 * নাম `<nn>-` দিয়ে শুরু। নম্বরটা শুধু ক্রম ঠিক করে — route-এ যায় না।
 * এর ফলে `docs/`-এ খসড়া বা কাজের ফাইল রাখলে সেটা নিজে থেকেই বাদ পড়ে।
 */
const DOC_PATTERN = /^(\d\d)-(.+)\.md$/i;

export type Doc = {
  /** URL segment, e.g. "principle" */
  slug: string;
  /** trailing slash সহ সাইট-route, e.g. "/principle/" */
  route: string;
  /** রিপো-রিলেটিভ posix path, e.g. "docs/01-principle.md" */
  file: string;
  /** ফাইলনামের ক্রম-নম্বর, e.g. "01" */
  order: string;
  /** প্রথম `# heading` অথবা ফাইলনাম থেকে */
  title: string;
  /** এই ডকে কয়টা checkbox-বিষয় আছে */
  topicCount: number;
};

/** প্রথম `# heading` থেকে টাইটেল; না পেলে ফাইলের নাম থেকে বানানো */
export function readTitle(content: string, file: string): string {
  for (const line of content.split(/\r?\n/)) {
    const match = /^#\s+(.+?)\s*$/.exec(line);
    if (match) return match[1];
  }
  return path
    .basename(file, ".md")
    .replace(/^\d+[-_.]\s*/, "")
    .replace(/[-_]/g, " ");
}

let docsCache: Doc[] | null = null;

function scan(): Doc[] {
  if (docsCache) return docsCache;

  const docsRoot = path.join(ROOT, DOCS_DIR);
  if (!fs.existsSync(docsRoot)) {
    docsCache = [];
    return docsCache;
  }

  const seenRoutes = new Set<string>();

  docsCache = fs
    .readdirSync(docsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && DOC_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((fileName) => {
      const [, order, base] = DOC_PATTERN.exec(fileName)!;
      const file = `${DOCS_DIR}/${fileName}`;
      const slug = slugify(base);
      const route = `/${slug}/`;

      if (seenRoutes.has(route)) {
        throw new Error(`Route collision: "${route}" from "${file}"`);
      }
      seenRoutes.add(route);

      const raw = fs.readFileSync(path.join(ROOT, file), "utf8");

      return {
        slug,
        route,
        file,
        order,
        title: readTitle(raw, file),
        topicCount: parseDoc(raw).topics.length,
      };
    });

  return docsCache;
}

export function getDocs(): Doc[] {
  return scan();
}

export function getDocBySlug(slug: string): Doc | undefined {
  return getDocs().find((doc) => doc.slug === slug);
}

export function readDoc(doc: Doc): string {
  return fs.readFileSync(path.join(ROOT, doc.file), "utf8");
}

export function getSiblings(doc: Doc): { prev?: Doc; next?: Doc } {
  const docs = getDocs();
  const index = docs.findIndex((item) => item.route === doc.route);
  if (index === -1) return {};
  return { prev: docs[index - 1], next: docs[index + 1] };
}

export type Heading = {
  /** anchor id — `slugify(text)`, TOC ও search দুটোই এটাতে নামে */
  id: string;
  text: string;
  /** 2 = `##`, 3 = `###` */
  level: number;
};

/** একটা checkbox-বিষয়: `- [ ] **নাম** — ব্যাখ্যা` */
export type Topic = {
  /** ডকের ভেতরে স্থির ও অনন্য id — progress এই id-তেই জমা হয় */
  id: string;
  /** মোটা অক্ষরের নাম বা লিংকের লেখা, সাইডবার ও গণনার জন্য */
  label: string;
  /** পুরো বুলেটটা markdown হিসেবে, checkbox চিহ্ন বাদে */
  markdown: string;
};

/**
 * ডকের শরীর ক্রম বজায় রেখে দুই ধরনের খণ্ডে ভাঙা হয়। কারণ ফাইলগুলো এক
 * ছাঁচের নয় — `06-creativity` heading আর বিষয়-তালিকা পালা করে সাজানো,
 * আর `07-examples`-এ কোনো checkbox-ই নেই। খণ্ডে ভাগ করলে দুটোই একই
 * কোড দিয়ে রেন্ডার হয়।
 */
export type Block =
  | { kind: "markdown"; markdown: string }
  | { kind: "topics"; topics: Topic[] };

export type ParsedDoc = {
  title: string;
  blocks: Block[];
  /** সব খণ্ড মিলিয়ে বিষয়ের সমতল তালিকা */
  topics: Topic[];
  headings: Heading[];
};

/**
 * TOC-এর ভিত্তি। Code fence-এর ভেতরের `#` মন্তব্য যেন heading হিসেবে ধরা
 * না পড়ে, তাই fence গোনা হয়।
 */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = match[2].replace(/[*_`]/g, "").trim();
    headings.push({ id: slugify(text), text, level: match[1].length });
  }
  return headings;
}

/** top-level checkbox বুলেট: `- [ ] ...` বা `- [x] ...` */
const TOPIC_LINE = /^-\s+\[([ xX])\]\s+(.*)$/;

/**
 * বিষয়ের নাম — প্রথম `**...**`, নইলে প্রথম `[...]` লিংক-লেখা, নইলে শুরুর
 * কিছুটা। এই নামটাই progress-এর id-র ভিত্তি, তাই ব্যাখ্যা সম্পাদনা করলেও
 * টিক হারায় না; নাম বদলালে হারায়, আর সেটাই কাম্য — ওটা তখন অন্য বিষয়।
 */
function topicLabel(text: string): string {
  const bold = /\*\*(.+?)\*\*/.exec(text);
  if (bold) return bold[1].trim();
  const link = /\[(.+?)\]\(/.exec(text);
  if (link) return link[1].trim();
  return text.replace(/[*_`]/g, "").slice(0, 60).trim();
}

export function parseDoc(raw: string): ParsedDoc {
  const lines = raw.split(/\r?\n/);
  let title = "";
  const bodyLines: string[] = [];
  let foundH1 = false;

  for (const line of lines) {
    const h1 = /^#\s+(.+)$/.exec(line);
    if (!foundH1 && h1) {
      title = h1[1];
      foundH1 = true;
      continue;
    }
    bodyLines.push(line);
  }

  const blocks: Block[] = [];
  const topics: Topic[] = [];
  const usedIds = new Set<string>();

  let mdBuffer: string[] = [];
  let topicBuffer: Topic[] = [];

  const flushMarkdown = () => {
    const markdown = mdBuffer.join("\n").trim();
    mdBuffer = [];
    if (markdown) blocks.push({ kind: "markdown", markdown });
  };
  const flushTopics = () => {
    if (topicBuffer.length > 0) blocks.push({ kind: "topics", topics: topicBuffer });
    topicBuffer = [];
  };

  for (const line of bodyLines) {
    const match = TOPIC_LINE.exec(line);

    if (match) {
      flushMarkdown();
      const text = match[2];
      const label = topicLabel(text);

      /* id সংঘর্ষ হলে সংখ্যা যোগ — দুটো বিষয়ের নাম এক হলেও progress আলাদা থাকে */
      let id = slugify(label) || `topic-${topics.length + 1}`;
      let suffix = 2;
      while (usedIds.has(id)) id = `${slugify(label)}-${suffix++}`;
      usedIds.add(id);

      const topic: Topic = { id, label, markdown: text };
      topicBuffer.push(topic);
      topics.push(topic);
      continue;
    }

    /* বুলেটের ইন্ডেন্ট করা ধারাবাহিক লাইন আগের বিষয়ের অংশ */
    if (topicBuffer.length > 0 && /^\s+\S/.test(line)) {
      const last = topicBuffer[topicBuffer.length - 1];
      last.markdown += `\n${line.trim()}`;
      continue;
    }

    /* খালি লাইন তালিকা ভাঙে না — পরের অ-বুলেট লাইনটাই ভাঙে */
    if (topicBuffer.length > 0 && line.trim() === "") continue;

    flushTopics();
    mdBuffer.push(line);
  }

  flushTopics();
  flushMarkdown();

  return {
    title: title || "ডকুমেন্ট",
    blocks,
    topics,
    headings: extractHeadings(bodyLines.join("\n")),
  };
}

/** Sidebar search-এর "বিষয়" গ্রুপ — সব ডকের সব বিষয়, সমতল */
export type TopicIndexEntry = {
  docRoute: string;
  docTitle: string;
  topicId: string;
  label: string;
};

export function getTopicIndex(): TopicIndexEntry[] {
  return getDocs().flatMap((doc) =>
    parseDoc(readDoc(doc)).topics.map((topic) => ({
      docRoute: doc.route,
      docTitle: doc.title,
      topicId: topic.id,
      label: topic.label,
    })),
  );
}

/** প্রতিটি ডকের বিষয়-id — Shell-এ গণনার জন্য, বারবার ফাইল না পড়ে */
export function getTopicIds(): Record<string, string[]> {
  const ids: Record<string, string[]> = {};
  for (const doc of getDocs()) {
    ids[doc.route] = parseDoc(readDoc(doc)).topics.map((topic) => topic.id);
  }
  return ids;
}
