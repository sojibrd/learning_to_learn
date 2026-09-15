/**
 * সাইটের পরিচয় — plan-এর কনটেন্ট নয়, তাই `docs/`-এ নয়, এখানে।
 *
 * chassis `behavioural_interview_*_company` থেকে; এই সাইট একটাই পথ, তিন repo-র পরিবার নয়।
 */
export const SITE: {
  title: string;
  short: string;
  emoji: string;
  description: string;
  storagePrefix: string;
  suggestedStart: string | null;
} = {
  title: "শেখা কীভাবে শিখতে হয়",
  short: "learning to learn",
  emoji: "🧠",
  description:
    "শেখার নীতি, বিজ্ঞান ও কৌশল — ৬৯ দিনে প্রতিটা বিষয় একবার নিজের কাজে খাটানো, দিনে ১০′, ঝালাইসহ।",
  /** localStorage key-এর prefix */
  storagePrefix: "l2l",
  /** শুরুর তারিখের প্রস্তাব নেই — কখন বসবেন ⏳ */
  suggestedStart: null,
};
