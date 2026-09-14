# learning_to_learn

শেখা কীভাবে শিখতে হয় — শেখার নীতি, বিজ্ঞান আর কৌশলের বাংলা রেফারেন্স। ব্রাউজার বুকমার্ক থেকে রূপান্তরিত।

**লাইভ:** https://sojibrd.github.io/learning_to_learn/ (repo প্রাইভেট — Pages চালু রাখতে GitHub-এর পেইড প্ল্যান লাগে)

## Functional Requirement

- **৭টা ডক,** প্রতিটা একটা ভাগ। মোট ৭৫টা বিষয়, প্রতিটার সাথে দুই-তিন লাইনের ব্যাখ্যা, যাতে শুধু শিরোনাম দেখে ভুলে যাওয়া বিষয়টা মনে পড়ে।
- **বিষয়ে checkbox:** প্রতিটা বিষয়ে টিক দেওয়া যায়; প্রতিটা ডকে "পড়া হয়েছে" আলাদা।
- **Rail আর search:** বাঁয়ে ভাগ → বিষয় তালিকা। search দুই গ্রুপে ফল দেয় — ডকের শিরোনাম আর **বিষয়ের নাম**।
- **ডানে TOC:** ডক পাতায় "এই পাতায়" কলাম।
- **প্রয়োগের দৃশ্য:** `07-examples` দেখায় নিজের কাজে (নতুন framework, DSA, system design, interview, সময় টিকিয়ে রাখা, অচেনা কোডবেস) বিষয়গুলো কেমন দেখতে।

## Non-Functional Requirement

- **ডক flat:** `docs/<nn>-<নাম>.md`, সাব-ফোল্ডার নেই। route ফাইলনাম থেকে, নম্বর বাদ দিয়ে (`docs/05-techniques.md` → `/techniques/`); নম্বর শুধু ক্রম ঠিক করে।
- **route ও nav স্ক্যান থেকে স্বয়ংক্রিয়।** scanner শুধু `^\d\d-.*\.md` নেয়; কোথাও তালিকা হার্ডকোড নয়।
- **Progress শুধু `localStorage`-এ,** একমাত্র `app/hooks/useProgress.ts` দিয়ে — নইলে static export-এ hydration mismatch।
- **বিষয়ের progress-id নামের slug থেকে,** ক্রম থেকে নয়। ব্যাখ্যা বদলালে বা বুলেট সরালে টিক টেকে; নাম বদলালে হারায়।
- **`app/lib/content.ts` server-only।**
- **Theme contract অলঙ্ঘনীয়, সাইট dark-only।**
- **স্ট্যাক:** Next.js 16, React 19, TypeScript, Tailwind v4, react-markdown। Static export → GitHub Pages।

## ডক ইনডেক্স

নতুন হলে **[07-examples.md](docs/07-examples.md) থেকে শুরু করুন** — প্রথম ছয়টা ফাইল বলে বিষয়গুলো কী, সাত নম্বরটা দেখায় কাজে ওগুলো কেমন দেখতে।

### কনটেন্ট

| ফাইল | বিষয় | Gist |
|---|---|---|
| [docs/01-principle.md](docs/01-principle.md) | ১৩ | কৌশলের আগের ধারণা: Learning vs Winning, What is success?, The obstacle, The dip, Compound learning, Failures don't count, Choice vs Chore, It's all in the frame, Pareto, Skill stacking, Happiness factors, Productivity time, Self learning paradigm |
| [docs/02-lies.md](docs/02-lies.md) | ৪ | যে চারটা প্রচলিত কথা ক্ষতি করে: Follow your passion, You can avoid risk, Trust this one person, 10,000 hours rule |
| [docs/03-pillars.md](docs/03-pillars.md) | ৪ | পদ্ধতির চার ভিত্তি: Everything is a game, Feynman technique, Trunk based knowledge, Efficiency trumps grit |
| [docs/04-science.md](docs/04-science.md) | ১৭ | মস্তিষ্ক কীভাবে শেখে: Focus vs Diffuse, ঘুম, brain training, feedback, procrastination, long/short memory, active vs passive, motivation, goals, not busy, chunking, deliberate practice, spaced repetition, habits, adventurous, endpoint, bored |
| [docs/05-techniques.md](docs/05-techniques.md) | ১৯ | বিজ্ঞান কাজে লাগানোর উপায়: Pomodoro, chunk the subject, spaced repetition ও deliberate practice (revisited), roadmap, interleaving, Einstellung, community, habits, system vs goal, senses, method of loci, Pareto, Parkinson's law, deep work, stakes & rewards, concepts vs facts, test yourself, first 20 hours |
| [docs/06-creativity.md](docs/06-creativity.md) | ১২ | নাম "Creativity" হলেও ভেতরে Google-এর নিয়োগ, ইঞ্জিনিয়ারিং চর্চা (eng-practices, re:Work) আর interview অনুশীলনের রিসোর্স — এগুলোরই কেবল আসল URL আছে |
| [docs/07-examples.md](docs/07-examples.md) | ৬ দৃশ্য | বাস্তব পরিস্থিতি ধরে প্রয়োগ: নতুন framework, DSA-তে pattern চেনা, system design-এর কঠিন ধারণা, interview ও take-home, সপ্তাহে ৪–৭ ঘণ্টা টিকিয়ে রাখা, অচেনা কোডবেস ও আটকে যাওয়া bug |

### `/learning-to-learn` skill-এর জায়গা (সাইটে যায় না)

| ফাইল | Gist |
|---|---|
| [notes/README.md](notes/README.md) | নোটের নিয়ম: এক বিষয় = এক ফাইল, সর্বোচ্চ ২০ লাইন, পাঁচ অংশ (শিরোনাম, এক বাক্যে, যা মনে রাখতে হবে, নিজের ভাষায়, যেখানে আটকেছিলাম); কোনো secret নয় |
| [review-queue.md](review-queue.md) | ঝালাইয়ের তালিকা, skill নিজে হালনাগাদ করে: ১ → ৩ → ৭ → ২১ দিন; আটকালে আবার ১ দিনে। এখন খালি |

## প্রজেক্ট-নির্দিষ্ট নিয়ম

### উৎস

- বুকমার্কের "Learning to learn" ফোল্ডার (`bookmarks_9_12_26.html`)। বেশিরভাগ বুকমার্কের URL ছিল `chrome://newtab/` — অর্থাৎ লিংক নয়, শিরোনাম দিয়ে বানানো সিলেবাস। তাই প্রতিটা বিষয় checkbox।
- মূল বুকমার্কের বানান ঠিক করা হয়েছে: Feybman → Feynman, Effieciency → Efficiency, repitation → repetition, scrience → science।
- `06-creativity` পাশের আলাদা বুকমার্ক ফোল্ডার ছিল, "Learning to learn"-এর ভেতরে নয়।
- ফোল্ডারে সরাসরি থাকা একমাত্র লিংক: [Deck of Cards](https://deck.of.cards/)।

### কনটেন্টের ছাঁচ

- ছাঁচ ইচ্ছাকৃতভাবে এক নয়: বেশিরভাগ ডক `- [ ] **নাম** — ব্যাখ্যা` বুলেটের তালিকা; `06-creativity` heading আর তালিকা পালা করে; `07-examples` টানা গদ্য।
- তাই `parseDoc` ডককে **খণ্ডে** ভাঙে (`markdown` / `topics`) — কোনো ডক-নির্দিষ্ট শর্ত নেই।
- checkbox বুলেটগুলো `Markdown`-এর বাইরে `TopicList`-এ রেন্ডার হয়; নইলে remark-gfm ওগুলোকে নিষ্ক্রিয় checkbox বানাত।

### Progress key

| key | মান |
|---|---|
| `l2l:v1:topic` | বিষয়প্রতি টিক (id = নামের slug) |
| `l2l:v1:read` | ডকপ্রতি "পড়া হয়েছে" |

## চালানো

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export → out/
```
