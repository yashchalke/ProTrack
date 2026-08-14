"use client";
import React, { createContext, useContext, useState } from "react";

interface InvitationCountContextValue {
  pendingCount: number;
  setPendingCount: (count: number) => void;
  decrement: () => void;
}

const InvitationCountContext = createContext<InvitationCountContextValue>({
  pendingCount: 0,
  setPendingCount: () => {},
  decrement: () => {},
});

export function InvitationCountProvider({
  children,
  initialCount = 0,
}: {
  children: React.ReactNode;
  initialCount?: number;
}) {
  const [pendingCount, setPendingCount] = useState(initialCount);

  function decrement() {
    setPendingCount((prev) => Math.max(0, prev - 1));
  }

  return (
    <InvitationCountContext.Provider value={{ pendingCount, setPendingCount, decrement }}>
      {children}
    </InvitationCountContext.Provider>
  );
}

export function useInvitationCount() {
  return useContext(InvitationCountContext);
}
