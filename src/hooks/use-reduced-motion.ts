'use client';

import { useSyncExternalStore } from 'react';

const getMediaQuery = () => {
  if (typeof window === 'undefined') return null;
  return window.matchMedia('(prefers-reduced-motion: reduce)');
};

const mq = getMediaQuery();

function subscribe(callback: () => void) {
  if (!mq) return () => {};

  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getSnapshot() {
  return mq ? mq.matches : false;
}

function getServerSnapshot() {
  return false; // Default to no preference on the server
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe, 
    getSnapshot, 
    getServerSnapshot
  );
}