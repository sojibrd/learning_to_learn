# learning_to_learn

শেখা কীভাবে শিখতে হয় — শেখার নীতি, বিজ্ঞান আর কৌশলের বাংলা রেফারেন্স, ব্রাউজার বুকমার্ক থেকে রূপান্তরিত। এখন দিনভিত্তিক plan-সাইট: ৬৯ দিনে প্রতিটা বিষয় একবার নিজের কাজে খাটানো, দিনে ১০′, ঝালাইসহ (ব্যবহারকারীর সিদ্ধান্ত ২০২৬-০৯-১৫)। chassis `behavioural_interview_*_company` থেকে।

**লাইভ:** https://sojibrd.github.io/learning_to_learn/ (repo প্রাইভেট — Pages চালু রাখতে GitHub-এর পেইড প্ল্যান লাগে)

## Functional Requirement

- **আজ (`/`):** প্রথমবার খুললে শুরুর তারিখ জিজ্ঞেস করে। তারপর দেখায় ক্যালেন্ডারের আজকের দিন: জমে থাকা ⚑ → আজকের ঝালাই → আজকের দিন।
- **Rail:** সব পাতায় বাঁয়ে, মোবাইলে drawer — ৪টা পাতা (আজ · ঝালাই · বিষয় · নিয়ম), plan-এর gauge, ৬টা ব্লক; শুধু খোলা ব্লকের দিন।
- **দিন (`/day/<nnn>/`) · ব্লক (`/block/<slug>/`):** একটা বিষয়, একটা করার কাজ, আর দিন বা ব্লক শেষের হ্যাঁ/না।
- **বিষয়ের পাতা (`/principle/` … `/examples/`, সূচি `/topics/`):** ৭টা ডক হুবহু; প্রতিটা বিষয়ের পাশে plan-এর কোন দিনে ওটা আসে। route আর বিষয়ের anchor আগের মতোই — বাকি সাইটগুলোর 🧠 chip এখানে নামে।
- **ঝালাই (`/review/`):** প্রতিটা 🔁 কাজ টিকের দিন থেকে ১/৩/৭/২১ দিন পরে ফেরে।
- **নিয়ম (`/rules/`):** `docs/00-rules.md` হুবহু।
- **🧠 chip:** নীতির এক লাইন (ব্যাখ্যার প্রথম বাক্য), আর বিষয়ের পাতায় লিংক।

## Non-Functional Requirement

- **দুই ফোল্ডার, দুই কাজ:** `topics/` = রেফারেন্স (৭টা ডক, flat), `docs/` = plan (নিয়ম আর ৬টা ব্লক)। কোডে দিন, কাজ বা বিষয়ের তালিকা হার্ডকোড নেই।
- **route আর anchor স্থির:** `topics/05-techniques.md` → `/techniques/`, বিষয়ের anchor = `slugify(নাম)`। দিনের শিরোনাম = বিষয়ের নাম হুবহু — বিষয়ের পাতা এভাবেই দিন খোঁজে।
- **দিনের নম্বর পরপর না হলে build ভাঙে।** ফাইলে তারিখ নেই; "আজ" মানে ক্যালেন্ডারের তারিখ, plan পেছায় না।
- **Progress শুধু `localStorage`-এ,** একমাত্র `app/hooks/useProgress.ts` দিয়ে — নইলে static export-এ hydration mismatch।
- **`app/lib/plan.ts` আর `app/lib/topics.ts` server-only।**
- **Theme contract অলঙ্ঘনীয়, সাইট dark-only।**
- **স্ট্যাক:** Next.js 16, React 19, TypeScript, Tailwind v4, react-markdown। Static export → GitHub Pages।

## ডক ইনডেক্স

### plan — `docs/`

| ফাইল | দিন | Gist |
|---|---|---|
| [docs/00-rules.md](docs/00-rules.md) | — | লক্ষ্য, সত্যের উৎস, চিহ্ন, "আজ", কখন বসবেন ⏳, ১০′-এর বসা, ঝালাই, বিষয়ের পাতা, skill-এর সাথে সম্পর্ক, যা করবেন না |
| [docs/01-principle.md](docs/01-principle.md) | ০০১–০১৩ | তেরোটা নীতি, দিনে একটা; শেষ দিনে দৃশ্য ৫ (সপ্তাহে ৪–৭ ঘণ্টা) |
| [docs/02-lies.md](docs/02-lies.md) | ০১৪–০১৭ | চারটা ভুল কথা, নিজের উদাহরণে যাচাই; দৃশ্য ১ (নতুন framework) |
| [docs/03-pillars.md](docs/03-pillars.md) | ০১৮–০২১ | চারটা স্তম্ভ; দৃশ্য ৩ (system design-এর কঠিন ধারণা) |
| [docs/04-science.md](docs/04-science.md) | ০২২–০৩৮ | সতেরোটা, প্রতিটা নিজের উপর পরীক্ষা; দৃশ্য ৬ (অচেনা কোডবেস) |
| [docs/05-techniques.md](docs/05-techniques.md) | ০৩৯–০৫৭ | উনিশটা কৌশল; দৃশ্য ২ (DSA-তে pattern চেনা) |
| [docs/06-creativity.md](docs/06-creativity.md) | ০৫৮–০৬৯ | বারোটা লিংক — কাজ বা "বাদ, কারণ ___", 🔁 ছাড়া; দৃশ্য ৪ (interview ও take-home) |

### রেফারেন্স — `topics/`

নতুন হলে **[07-examples.md](topics/07-examples.md) থেকে শুরু করুন** — প্রথম ছয়টা ফাইল বলে বিষয়গুলো কী, সাত নম্বরটা দেখায় কাজে ওগুলো কেমন দেখতে।

| ফাইল | বিষয় | Gist |
|---|---|---|
| [topics/01-principle.md](topics/01-principle.md) | ১৩ | কৌশলের আগের ধারণা: Learning vs Winning, What is success?, The obstacle, The dip, Compound learning, Failures don't count, Choice vs Chore, It's all in the frame, Pareto, Skill stacking, Happiness factors, Productivity time, Self learning paradigm |
| [topics/02-lies.md](topics/02-lies.md) | ৪ | যে চারটা প্রচলিত কথা ক্ষতি করে: Follow your passion, You can avoid risk, Trust this one person, 10,000 hours rule |
| [topics/03-pillars.md](topics/03-pillars.md) | ৪ | পদ্ধতির চার ভিত্তি: Everything is a game, Feynman technique, Trunk based knowledge, Efficiency trumps grit |
| [topics/04-science.md](topics/04-science.md) | ১৭ | মস্তিষ্ক কীভাবে শেখে: Focus vs Diffuse, ঘুম, brain training, feedback, procrastination, long/short memory, active vs passive, motivation, goals, not busy, chunking, deliberate practice, spaced repetition, habits, adventurous, endpoint, bored |
| [topics/05-techniques.md](topics/05-techniques.md) | ১৯ | বিজ্ঞান কাজে লাগানোর উপায়: Pomodoro, chunk the subject, spaced repetition ও deliberate practice (revisited), roadmap, interleaving, Einstellung, community, habits, system vs goal, senses, method of loci, Pareto, Parkinson's law, deep work, stakes & rewards, concepts vs facts, test yourself, first 20 hours |
| [topics/06-creativity.md](topics/06-creativity.md) | ১২ | নাম "Creativity" হলেও ভেতরে Google-এর নিয়োগ, ইঞ্জিনিয়ারিং চর্চা (eng-practices, re:Work) আর interview অনুশীলনের রিসোর্স — এগুলোরই কেবল আসল URL আছে |
| [topics/07-examples.md](topics/07-examples.md) | ৬ দৃশ্য | বাস্তব পরিস্থিতি ধরে প্রয়োগ: নতুন framework, DSA-তে pattern চেনা, system design-এর কঠিন ধারণা, interview ও take-home, সপ্তাহে ৪–৭ ঘণ্টা টিকিয়ে রাখা, অচেনা কোডবেস ও আটকে যাওয়া bug |

### `/learning-to-learn` skill-এর জায়গা (সাইটে যায় না)

| ফাইল | Gist |
|---|---|
| [notes/README.md](notes/README.md) | নোটের নিয়ম: এক বিষয় = এক ফাইল, সর্বোচ্চ ২০ লাইন, পাঁচ অংশ (শিরোনাম, এক বাক্যে, যা মনে রাখতে হবে, নিজের ভাষায়, যেখানে আটকেছিলাম); কোনো secret নয় |
| [review-queue.md](review-queue.md) | ঝালাইয়ের তালিকা, skill নিজে হালনাগাদ করে: ১ → ৩ → ৭ → ২১ দিন; আটকালে আবার ১ দিনে |

## প্রজেক্ট-নির্দিষ্ট নিয়ম

### উৎস

- বুকমার্কের "Learning to learn" ফোল্ডার (`bookmarks_9_12_26.html`)। বেশিরভাগ বুকমার্কের URL ছিল `chrome://newtab/` — অর্থাৎ লিংক নয়, শিরোনাম দিয়ে বানানো সিলেবাস।
- মূল বুকমার্কের বানান ঠিক করা হয়েছে: Feybman → Feynman, Effieciency → Efficiency, repitation → repetition, scrience → science।
- `06-creativity` পাশের আলাদা বুকমার্ক ফোল্ডার ছিল, "Learning to learn"-এর ভেতরে নয়।
- ফোল্ডারে সরাসরি থাকা একমাত্র লিংক: [Deck of Cards](https://deck.of.cards/)।

### কনটেন্টের ছাঁচ

- `topics/`-এর ছাঁচ ইচ্ছাকৃতভাবে এক নয়: বেশিরভাগ ডক `- [ ] **নাম** — ব্যাখ্যা` বুলেট; `06-creativity` heading আর তালিকা পালা করে; `07-examples` টানা গদ্য। `parseDoc` ডককে খণ্ডে (`markdown` / `topics`) ভাঙে — কোনো ডক-নির্দিষ্ট শর্ত নেই।
- `docs/`-এর ব্লক ফাইল: `# ব্লক ১ — নাম` · `*দিন ০০১–০১৩*` · `> **ব্লক শেষে:** …` · `### দিন ০০৭ · বিষয়ের নাম` · `- [ ] ১০′ … 🔁 🧠 (বিষয়ের নাম)` · `> **দিন শেষে:** …`।
- 🧠 নাম → `app/lib/principles.ts`, `topics/01…05`-এর ৫৭টা বিষয় থেকে তৈরি; বিষয়ের নাম বা ব্যাখ্যার প্রথম বাক্য বদলালে এটাও বদলান।

### Progress key

| key | মান |
|---|---|
| `l2l:v1:start` | শুরুর তারিখ `"YYYY-MM-DD"` |
| `l2l:v1:task` | কাজ শেষের তারিখ। id = দিন + কাজের **লেখা** থেকে hash |
| `l2l:v1:check` | দিন শেষ (`d007`) ও ব্লক শেষ (`b1`)-এর হ্যাঁ/না |
| `l2l:v1:review` | 🔁 ঝালাইয়ের অবস্থা `{ base, step }` |

আগের `l2l:v1:topic` আর `l2l:v1:read` আর পড়া হয় না — পুরনো সাইটের টিক নতুন সাইটে আসে না।

## চালানো

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export → out/
```
