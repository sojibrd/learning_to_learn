import Home, { type HomeDoc } from "./components/Home";
import { getDocs, getTopicIds } from "./lib/content";

/**
 * ভাগের এক-লাইনের পরিচয়। এটা কনটেন্ট নয়, নেভিগেশনের সাহায্য — তাই ডকে নয়,
 * এখানে থাকে। নতুন ভাগে এন্ট্রি না দিলে সাইট ভাঙে না, শুধু লাইনটা থাকে না।
 *
 * key হলো route, ফাইলের নম্বর নয় — ফাইল আবার নম্বর পেলেও পরিচয় ঠিক থাকে।
 */
const BLURBS: Record<string, string> = {
  "/principle/": "কৌশলের আগে যে ধারণাগুলো ঠিক করতে হয়। কৌশল বদলায়, এগুলো বদলায় না।",
  "/lies/": "শেখা নিয়ে সবচেয়ে বেশি শোনা চারটা কথা, যেগুলো আসলে ক্ষতি করে।",
  "/pillars/": "পুরো পদ্ধতিটা যে চারটা ভিত্তির উপর দাঁড়ানো।",
  "/science/": "মস্তিষ্ক আসলে কীভাবে শেখে — কৌশলগুলো এই ভিত্তির উপরেই দাঁড়ানো।",
  "/techniques/": "আগের ভাগের বিজ্ঞানটা কাজে লাগানোর ব্যবহারিক উপায়।",
  "/creativity/": "Google-এর নিয়োগ ও টিম-ব্যবস্থাপনার রিসোর্স — একমাত্র ভাগ যেখানে আসল লিংক আছে।",
  "/examples/": "ছয়টা বাস্তব পরিস্থিতি — কোন দৃশ্যে কোন বিষয়টা খাটে।",
};

/** হোমপেজে যেটা "শুরু এখানে" হিসেবে উপরে বসে */
const START_ROUTE = "/examples/";

export default function HomePage() {
  const topicIds = getTopicIds();

  const docs: HomeDoc[] = getDocs().map((doc) => ({
    route: doc.route,
    title: doc.title,
    order: doc.order,
    blurb: BLURBS[doc.route] ?? "",
    topicIds: topicIds[doc.route] ?? [],
  }));

  return <Home docs={docs} startRoute={START_ROUTE} />;
}
