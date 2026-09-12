# Learning to learn

*শেখা কীভাবে শিখতে হয় — ব্রাউজার বুকমার্ক থেকে রূপান্তরিত টপিক তালিকা*

লাইভ সাইট: https://sojibrd.github.io/learning_to_learn/

কনটেন্ট থাকে `docs/`-এ, সাধারণ markdown হিসেবে — GitHub-এ পড়া যায়, সাইটেও। সাইটে
প্রতিটা বিষয়ের checkbox সত্যিই কাজ করে; টিক জমা থাকে শুধু আপনার ব্রাউজারে
(`localStorage`), কোথাও পাঠানো হয় না।

উৎস: `bookmarks_9_12_26.html`-এর "Learning to learn" ফোল্ডার · মোট 57টি বিষয়, 5টি ভাগে।

বুকমার্কগুলোর বেশিরভাগেরই কোনো আসল URL ছিল না (সবগুলো `chrome://newtab/`), অর্থাৎ ওগুলো লিংক নয় — শিরোনাম দিয়ে বানানো একটা সিলেবাস। তাই প্রতিটা বিষয় এখানে checkbox হিসেবে রাখা হয়েছে, পড়া হলে টিক দেওয়ার জন্য।

প্রতিটা বিষয়ের সাথে **দুই-তিন লাইনের ব্যাখ্যা** যোগ করা হয়েছে, যাতে শুধু শিরোনাম দেখে ভুলে যাওয়া বিষয়টা আবার মনে পড়ে। মূল বুকমার্কের বানান ভুলগুলোও ঠিক করা হয়েছে (Feybman → Feynman, Effieciency → Efficiency, repitation → repetition, scrience → science)।

**প্রয়োগ দেখতে চাইলে [07-examples.md](docs/07-examples.md) থেকে শুরু করুন** — প্রথম ছয়টা ফাইল বলে বিষয়গুলো কী, সাত নম্বরটা দেখায় আপনার নিজের কাজে ওগুলো কেমন দেখতে।

| # | ভাগ | বিষয় | সংখ্যা |
|---|---|---|---|
| 1 | [Principle](docs/01-principle.md) | নীতি | 13 |
| 2 | [Lies](docs/02-lies.md) | যে কথাগুলো ভুল | 4 |
| 3 | [Pillars](docs/03-pillars.md) | স্তম্ভ | 4 |
| 4 | [Science](docs/04-science.md) | বিজ্ঞান | 17 |
| 5 | [Techniques](docs/05-techniques.md) | কৌশল | 19 |
| 6 | [Creativity](docs/06-creativity.md) | Google ক্যারিয়ার রিসোর্স * | 12 |
| 7 | [Examples](docs/07-examples.md) | প্রয়োগের দৃশ্য | 6 |

\* পাশের আলাদা বুকমার্ক ফোল্ডার, "Learning to learn"-এর ভেতরে ছিল না। নাম "Creativity" হলেও ভেতরে সবই Google-এর নিয়োগ ও টিম-ব্যবস্থাপনার রিসোর্স, আর এগুলোরই কেবল আসল URL আছে।

## সাইটটা চালানো

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # out/ — static export
```

`docs/`-এ `<nn>-<নাম>.md` নামে নতুন ফাইল রাখলে route আর nav নিজে থেকেই আসে —
কোথাও তালিকা হার্ডকোড করা নেই। ফাইলের নম্বরটা শুধু ক্রম ঠিক করে, route-এ যায় না
(`docs/05-techniques.md` → `/techniques/`)।

## ফোল্ডারে সরাসরি ছিল

- [Deck of Cards](https://deck.of.cards/)
