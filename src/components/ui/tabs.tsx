"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({
  value: "",
  onValueChange: () => {},
});

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

function Tabs({ defaultValue = "", value, onValueChange, className, children }: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const onChange = (v: string) => {
    if (!controlled) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <TabsContext.Provider value={{ value: current, onValueChange: onChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-muted/60 p-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        "rounded-full px-5 py-1.5 text-sm font-medium transition-all",
        active
          ? "bg-white text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return (
    <div role="tabpanel" className={cn("mt-2", className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
