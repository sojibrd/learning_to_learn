import { slugify } from "./slug";

/**
 * 🧠 (…) বন্ধনীর নাম → এই সাইটের বিষয়। `topics/01…05`-এর ৫৭টা বিষয় থেকে তৈরি:
 * নাম = বুলেটের **নাম** হুবহু, এক লাইন = ব্যাখ্যার প্রথম বাক্য। কোনো বিষয়ের নাম বা
 * ব্যাখ্যার প্রথম বাক্য বদলালে এই ফাইলও বদলান। লিংক এই সাইটের বিষয়ের anchor-এ।
 */
export type Principle = {
  /** `topics/0n-<doc>.md` → route `/<doc>/` */
  doc: "principle" | "lies" | "pillars" | "science" | "techniques";
  /** বুলেটের **নাম** হুবহু — anchor এটা থেকেই */
  topic: string;
  /** ব্যাখ্যার প্রথম বাক্য */
  line: string;
};

const PRINCIPLES: Record<string, Principle> = {
  "learning vs winning": { doc: "principle", topic: "Learning vs Winning", line: "লক্ষ্য কি শেখা, নাকি জেতা? জেতার লক্ষ্য থাকলে মানুষ সহজ কাজ বেছে নেয়, যাতে হারতে না হয়।" },
  "what is success?": { doc: "principle", topic: "What is success?", line: "সংজ্ঞাটা নিজের হতে হবে।" },
  "the obstacle": { doc: "principle", topic: "The obstacle", line: "বাধাই পথ।" },
  "the dip": { doc: "principle", topic: "The dip", line: "শুরুর উত্তেজনা শেষ হওয়ার পর, দক্ষতা আসার আগে যে কঠিন মাঝের সময়টা।" },
  "compound learning": { doc: "principle", topic: "Compound learning", line: "প্রতিদিন একটু করে শেখা চক্রবৃদ্ধির মতো জমে।" },
  "failures don't count": { doc: "principle", topic: "Failures don't count", line: "ব্যর্থতা তখনই ক্ষতি, যখন তা থেকে কিছু শেখা হয় না।" },
  "choice vs chore": { doc: "principle", topic: "Choice vs Chore", line: "একই কাজ \"করতে হবে\" ভাবলে শক্তি কমে, \"করছি কারণ আমি চাই\" ভাবলে বাড়ে।" },
  "it's all in the frame": { doc: "principle", topic: "It's all in the frame", line: "একই তথ্য ভিন্ন ফ্রেমে ভিন্ন অর্থ দেয়।" },
  "pareto principle": { doc: "principle", topic: "Pareto principle", line: "৮০% ফল আসে ২০% কাজ থেকে।" },
  "skill stacking": { doc: "principle", topic: "Skill stacking", line: "একটা জিনিসে বিশ্বের সেরা হওয়ার চেয়ে কয়েকটা জিনিসে মোটামুটি ভালো হয়ে সেগুলো একসাথে করা সহজ ও বিরল।" },
  "happiness factors": { doc: "principle", topic: "Happiness factors", line: "টাকা একটা অংশ মাত্র।" },
  "your productivity time": { doc: "principle", topic: "Your productivity time", line: "দিনের কোন সময়ে আপনার মাথা সবচেয়ে ভালো চলে, সেটা খুঁজে বের করে কঠিন কাজগুলো ঐ সময়ে রাখুন।" },
  "self learning paradigm": { doc: "principle", topic: "Self learning paradigm", line: "ডিগ্রি বা কোর্স নয়, নিজে নিজে শেখার ক্ষমতাই আসল দক্ষতা।" },
  "follow your passion": { doc: "lies", topic: "Follow your passion", line: "\"আগে passion খুঁজে বের করো, তারপর সেটাই করো\" — উল্টো কথা।" },
  "you can avoid risk": { doc: "lies", topic: "You can avoid risk", line: "ঝুঁকি এড়ানো যায় না, শুধু জায়গা বদলানো যায়।" },
  "trust this one person": { doc: "lies", topic: "Trust this one person", line: "একজন গুরু, একজন YouTuber বা একটা বইয়ের উপর পুরো নির্ভরতা বিপজ্জনক।" },
  "10,000 hours rule": { doc: "lies", topic: "10,000 hours rule", line: "\"১০,০০০ ঘণ্টা দিলেই বিশেষজ্ঞ\" — কথাটা ভুলভাবে ছড়িয়েছে।" },
  "everything is a game": { doc: "pillars", topic: "Everything is a game", line: "প্রতিটা ক্ষেত্রেরই নিয়ম আছে, আর নিয়মগুলো জানা থাকলে খেলা অনেক সহজ হয়ে যায়।" },
  "feynman technique": { doc: "pillars", topic: "Feynman technique", line: "কোনো বিষয় সত্যিই বুঝেছেন কি না পরীক্ষা করার সবচেয়ে ভালো উপায়।" },
  "trunk based knowledge": { doc: "pillars", topic: "Trunk based knowledge", line: "গাছের কাণ্ড আগে, পাতা পরে।" },
  "efficiency trumps grit": { doc: "pillars", topic: "Efficiency trumps grit", line: "শুধু বেশি পরিশ্রম নয়, সঠিক পদ্ধতিতে পরিশ্রম।" },
  "focus vs diffuse mode": { doc: "science", topic: "Focus vs Diffuse mode", line: "মস্তিষ্কের দুটো মোড।" },
  "the science of sleep": { doc: "science", topic: "The science of sleep", line: "ঘুমের সময় মস্তিষ্ক দিনের শেখা জিনিস গুছিয়ে স্থায়ী স্মৃতিতে নেয়।" },
  "brain training": { doc: "science", topic: "Brain training", line: "brain-training অ্যাপ খেলে আপনি ঐ গেমটাতেই ভালো হন, বাস্তব কাজে নয়।" },
  "the science of feedback": { doc: "science", topic: "The science of feedback", line: "feedback যত দ্রুত আর যত নির্দিষ্ট, শেখা তত দ্রুত।" },
  "procrastination": { doc: "science", topic: "Procrastination", line: "এটা অলসতা নয়, অস্বস্তি এড়ানোর চেষ্টা।" },
  "long and short memory": { doc: "science", topic: "Long and short memory", line: "working memory-তে একসাথে খুব অল্প জিনিসই ধরে (মোটামুটি চারটা)।" },
  "active vs passive learning": { doc: "science", topic: "Active vs Passive learning", line: "ভিডিও দেখা আর বই পড়া passive; মনে হয় শিখছেন, আসলে চেনা লাগছে মাত্র।" },
  "the science of motivation": { doc: "science", topic: "The science of motivation", line: "অনুপ্রেরণা কাজের আগে আসে না, কাজ শুরু করার পরে আসে।" },
  "goals": { doc: "science", topic: "Goals", line: "লক্ষ্য নির্দিষ্ট আর মাপা যায় এমন হতে হবে।" },
  "it pays to be not busy": { doc: "science", topic: "It pays to be not busy", line: "সারাক্ষণ ব্যস্ত থাকা মানে উৎপাদনশীল হওয়া নয়।" },
  "chunking": { doc: "science", topic: "Chunking", line: "ছড়ানো তথ্যকে অর্থপূর্ণ গুচ্ছে বেঁধে ফেলা।" },
  "deliberate practice": { doc: "science", topic: "Deliberate practice", line: "যা পারেন তার পুনরাবৃত্তি নয়, যা পারেন না ঠিক তার উপর কাজ।" },
  "spaced repetition": { doc: "science", topic: "Spaced repetition", line: "একবারে দশবার না পড়ে, দিন ব্যবধানে পড়া।" },
  "energy saving with habits": { doc: "science", topic: "Energy saving with habits", line: "অভ্যাসে পরিণত হওয়া কাজে সিদ্ধান্ত নিতে হয় না, তাই শক্তিও খরচ হয় না।" },
  "be adventurous": { doc: "science", topic: "Be adventurous", line: "নতুন জায়গা, নতুন বিষয়, নতুন মানুষ — নতুনত্ব মস্তিষ্ককে সজাগ রাখে আর নতুন সংযোগ তৈরি করে।" },
  "have an endpoint": { doc: "science", topic: "Have an endpoint", line: "পড়তে বসার আগে শেষ সময়টা ঠিক করে নিন।" },
  "be bored": { doc: "science", topic: "Be bored", line: "একঘেয়েমি সৃজনশীলতার জন্ম দেয়।" },
  "pomodoro technique": { doc: "techniques", topic: "Pomodoro technique", line: "২৫ মিনিট বিরতিহীন কাজ, তারপর ৫ মিনিট বিরতি।" },
  "chunk the subject": { doc: "techniques", topic: "Chunk the subject", line: "বড় বিষয়কে ছোট ছোট অংশে ভাগ করে একটা একটা করে ধরা।" },
  "spaced repetition revisited": { doc: "techniques", topic: "Spaced repetition revisited", line: "ব্যবধান বাড়িয়ে বাড়িয়ে পুনরাবৃত্তি: ১ দিন, ৩ দিন, ৭ দিন, ২১ দিন।" },
  "deliberate practice revisited": { doc: "techniques", topic: "Deliberate practice revisited", line: "প্রতিবার অনুশীলনের আগে ঠিক করুন আজ কোন দুর্বলতাটা নিয়ে কাজ করব।" },
  "create a roadmap": { doc: "techniques", topic: "Create a roadmap", line: "শেখা শুরুর আগে পুরো পথের একটা মানচিত্র আঁকুন।" },
  "interleaving": { doc: "techniques", topic: "Interleaving", line: "একটানা একই ধরনের সমস্যা না করে কয়েক ধরনের মিশিয়ে করা।" },
  "einstellung": { doc: "techniques", topic: "Einstellung", line: "পুরনো চেনা পদ্ধতিটাই নতুন সমস্যার ভালো সমাধান খুঁজে পেতে বাধা দেয়।" },
  "importance of community": { doc: "techniques", topic: "Importance of community", line: "একা শেখা ধীর।" },
  "habits revisited": { doc: "techniques", topic: "Habits revisited", line: "অভ্যাসের তিনটা অংশ: সংকেত → কাজ → পুরস্কার।" },
  "system vs goal": { doc: "techniques", topic: "System vs goal", line: "লক্ষ্য বলে কোথায় যেতে চান, সিস্টেম বলে প্রতিদিন কী করবেন।" },
  "the power of senses": { doc: "techniques", topic: "The power of senses", line: "একাধিক ইন্দ্রিয় ব্যবহার করলে স্মৃতি শক্ত হয়।" },
  "method of loci": { doc: "techniques", topic: "Method of loci", line: "স্মৃতির প্রাসাদ।" },
  "pareto principle revisited": { doc: "techniques", topic: "Pareto principle revisited", line: "যেকোনো বিষয়ের ২০% শিখলেই ৮০% কাজ চলে।" },
  "parkinson's law": { doc: "techniques", topic: "Parkinson's law", line: "কাজ যত সময় দেওয়া হয় ততটাই নেয়।" },
  "exercise deep work": { doc: "techniques", topic: "Exercise deep work", line: "দীর্ঘ সময় বিরতিহীন, বিভ্রান্তিহীন কাজ।" },
  "stakes & rewards": { doc: "techniques", topic: "Stakes & Rewards", line: "কিছু একটা বাজি রাখুন।" },
  "concepts vs facts": { doc: "techniques", topic: "Concepts vs Facts", line: "তথ্য মুখস্থ করা সহজ কিন্তু দ্রুত হারিয়ে যায়; ধারণা বোঝা কঠিন কিন্তু টেকে।" },
  "test yourself": { doc: "techniques", topic: "Test yourself", line: "বই বন্ধ করে মনে করার চেষ্টা করা পড়ার চেয়ে অনেক বেশি কার্যকর।" },
  "exercise: the first 20 hours": { doc: "techniques", topic: "Exercise: the first 20 hours", line: "কোনো নতুন জিনিসে মোটামুটি চালানোর মতো হতে ২০ ঘণ্টাই যথেষ্ট, ১০,০০০ নয়।" },
};

export function findPrinciple(name: string): Principle | undefined {
  return PRINCIPLES[name.trim().toLowerCase()];
}

export function principleHref(principle: Principle): string {
  return `/${principle.doc}/#${slugify(principle.topic)}`;
}
