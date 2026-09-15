# learning_to_learn — Agent Instructions

শেখার নীতির দিনভিত্তিক সাইট — ৬৯ দিন, প্রতিটা বিষয় একটা দিন। chassis `behavioural_interview_*_company` থেকে; তিন repo-র পরিবার নয়, একটাই সাইট।

- **`topics/` = ৭টা ডক**, flat (`topics/<nn>-<নাম>.md`)। route ফাইলনাম থেকে নম্বর বাদে (`05-techniques.md` → `/techniques/`), বিষয়ের anchor = `slugify(নাম)`। **route, ফাইলনাম আর বিষয়ের নাম বদলাবেন না** — বাকি সাইটগুলোর 🧠 chip ঠিক এখানেই নামে।
- **`docs/` = plan** — `00-rules.md` আর ৬টা ব্লক, ডকের ক্রমে। `### দিন ০০৭ · শিরোনাম`-এ শিরোনাম = বিষয়ের নাম হুবহু; বিষয়ের পাতা দিনের লিংক এভাবেই খোঁজে। দিনের নম্বর পরপর না হলে build ভাঙে; ফাইলে তারিখ নেই, "আজ" = ক্যালেন্ডারের তারিখ।
- কাজ শুধু বিষয়ের ব্যাখ্যা থেকে — নতুন দাবি বা নতুন নীতি নয়। Creativity-র দিনে 🔁 নেই।
- 🧠 নাম → `app/lib/principles.ts`, `topics/01…05`-এর ৫৭টা বিষয় থেকে তৈরি; বিষয়ের নাম বা ব্যাখ্যার প্রথম বাক্য বদলালে এটাও বদলান।
- **সময় ⏳** — দিনের ১০′ সপ্তাহে ৭ ঘণ্টার ভেতরে না বাইরে, ব্যবহারকারীর উত্তর বাকি। কোনো plan-এর ঘর থেকে সময় কাটবেন না।
- Progress চার key (`l2l:v1:start`, `task`, `check`, `review`) — একমাত্র `app/hooks/useProgress.ts` দিয়ে।
- `app/lib/plan.ts` আর `app/lib/topics.ts` server-only।
- `notes/` আর `review-queue.md` `/learning-to-learn` skill-এর জায়গা — সাইট ছোঁয় না।
- **Theme contract অলঙ্ঘনীয়**, সাইট **dark-only**। repo প্রাইভেট — Pages চালু রাখতে GitHub-এর পেইড প্ল্যান লাগে।

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
