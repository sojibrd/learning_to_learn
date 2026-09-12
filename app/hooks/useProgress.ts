"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Progress-এর একমাত্র মালিক। কোনো কম্পোনেন্ট সরাসরি `localStorage` ছোঁবে না —
 * সব পড়া-লেখা এখান দিয়ে, যাতে key-স্কিমা এক জায়গায় থাকে এবং static export-এ
 * hydration mismatch না ঘটে।
 *
 * দুই স্তর, কারণ ডকগুলোও দুই রকম: বেশিরভাগ ডক checkbox-বিষয়ের তালিকা, আর
 * `07-examples`-এর মতো কিছু ডক টানা পড়ার জিনিস।
 *
 * Key স্কিমা (`v1` — কনটেন্ট বদলালে migrate করার জন্য):
 *   l2l:v1:topic → { [`${docRoute}#${topicId}`]: true }
 *   l2l:v1:read  → { [docRoute]: true }
 */
const TOPIC_KEY = "l2l:v1:topic";
const READ_KEY = "l2l:v1:read";

type Flags = Record<string, true>;

/**
 * Static export-এ প্রথম render সার্ভারে হয়, যেখানে `localStorage` নেই।
 * তাই mount-এর আগে কোনো progress UI দেখানো যাবে না — নইলে server ও client-এর
 * markup আলাদা হয়ে hydration ভাঙে।
 */
const neverChanges = () => () => {};

export function useMounted(): boolean {
  /* server snapshot `false`, client snapshot `true` — কোনো effect ছাড়াই,
     তাই প্রথম render-এ cascading re-render হয় না। */
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

export function useProgress() {
  const [topics, setTopics] = useLocalStorage<Flags>(TOPIC_KEY, {});
  const [read, setRead] = useLocalStorage<Flags>(READ_KEY, {});

  const isTopicDone = useCallback(
    (route: string, topicId: string) => topics[`${route}#${topicId}`] === true,
    [topics],
  );

  const toggleTopic = useCallback(
    (route: string, topicId: string) =>
      setTopics((prev) => {
        const key = `${route}#${topicId}`;
        const next = { ...prev };
        if (next[key]) delete next[key];
        else next[key] = true;
        return next;
      }),
    [setTopics],
  );

  const topicsDoneIn = useCallback(
    (route: string, topicIds: string[]) =>
      topicIds.reduce((sum, id) => sum + (topics[`${route}#${id}`] ? 1 : 0), 0),
    [topics],
  );

  const isRead = useCallback((route: string) => read[route] === true, [read]);

  const toggleRead = useCallback(
    (route: string) =>
      setRead((prev) => {
        const next = { ...prev };
        if (next[route]) delete next[route];
        else next[route] = true;
        return next;
      }),
    [setRead],
  );

  const clearAll = useCallback(() => {
    setTopics({});
    setRead({});
  }, [setTopics, setRead]);

  return { isTopicDone, toggleTopic, topicsDoneIn, isRead, toggleRead, clearAll };
}
