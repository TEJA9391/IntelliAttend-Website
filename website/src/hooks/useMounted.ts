"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns false during server rendering and the initial hydration pass,
 * then true once the component is mounted on the client.
 *
 * Uses useSyncExternalStore so no state update happens inside an effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
