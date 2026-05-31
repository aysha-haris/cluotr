"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type BoardItem = {
  id: string;
  type: "product" | "collection";
  title: string;
  image: string;
  price?: number;
  rating?: number;
};

type BoardContextType = {
  items: BoardItem[];
  saveItem: (item: BoardItem) => void;
  removeItem: (id: string) => void;
  isSaved: (id: string) => boolean;
  count: number;
};

const BoardContext = createContext<BoardContextType>({
  items: [],
  saveItem: () => {},
  removeItem: () => {},
  isSaved: () => false,
  count: 0,
});

const STORAGE_KEY = "cloutr-board";

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setItems(stored ? (JSON.parse(stored) as BoardItem[]) : []);
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const saveItem = (item: BoardItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isSaved = (id: string) => items.some((i) => i.id === id);

  return (
    <BoardContext.Provider
      value={{ items, saveItem, removeItem, isSaved, count: items.length }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  return useContext(BoardContext);
}
