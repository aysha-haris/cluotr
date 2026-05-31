"use client";

import { motion } from "framer-motion";
import {
  Check,
  DollarSign,
  ExternalLink,
  ImageIcon,
  LayoutGrid,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Tag,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import type { AffiliateLink, CategoryOverride, ProductOverride } from "@/types/catalog";

const ADMIN_PASSWORD = "cloutr2024";
const AUTH_KEY = "cloutr-admin-authed";

function isAdminAuthed(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

function setAdminAuthed(v: boolean) {
  try {
    if (v) localStorage.setItem(AUTH_KEY, "1");
    else localStorage.removeItem(AUTH_KEY);
  } catch {}
}

function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidAmazonUrl(url: string): boolean {
  if (!url) return true;
  try {
    const u = new URL(url);
    return u.hostname.includes("amazon.") || u.hostname.includes("amzn.");
  } catch {
    return false;
  }
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const attempt = () => {
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-[24px] border border-border bg-card p-8 text-center shadow-xl"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mb-1 font-serif text-2xl font-bold text-foreground">Admin Access</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Enter your password to manage your site.
        </p>
        <div className="flex flex-col gap-3">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && attempt()}
            className={`h-11 rounded-full border-primary/20 text-center transition-all focus-visible:ring-primary/30 ${error ? "animate-pulse border-red-400 bg-red-50" : ""}`}
          />
          {error && <p className="text-xs text-red-500">Incorrect password. Try again.</p>}
          <Button
            onClick={attempt}
            className="h-11 rounded-full bg-primary text-white hover:bg-primary/90"
          >
            Sign In
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
interface ProductDraft {
  title: string;
  category: string;
  imageUrl: string;
  price: string;
  affiliateUrl: string;
}

function ProductsTab() {
  const { toast } = useToast();
  const [overrides, setOverrides] = useState<ProductOverride[]>([]);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<number, ProductDraft>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [o, l, c] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/affiliate-links").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]);
      setOverrides(o as ProductOverride[]);
      setLinks(l as AffiliateLink[]);
      setDbCategories(c as CategoryOverride[]);
    } catch {
      toast({ description: "Failed to load data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      PRODUCTS.forEach((p) => {
        if (p.id in next) return;
        const override = overrides.find((o) => o.productId === p.id);
        const link = links.find((l) => l.productId === p.id);
        next[p.id] = {
          title: override?.title ?? "",
          category: override?.category ?? "",
          imageUrl: override?.imageUrl ?? "",
          price: link?.price != null ? String(link.price) : "",
          affiliateUrl: link?.url ?? "",
        };
      });
      return next;
    });
  }, [overrides, links]);

  const allCategories = [
    ...CATEGORIES,
    ...dbCategories
      .filter((d) => !CATEGORIES.find((c) => c.id === d.id))
      .map((d) => ({ id: d.id, name: d.name, image: d.imageUrl ?? "", description: d.description ?? "" })),
  ];

  const getDraft = (id: number): ProductDraft =>
    drafts[id] ?? { title: "", category: "", imageUrl: "", price: "", affiliateUrl: "" };

  const getSavedDraft = (id: number): ProductDraft => {
    const override = overrides.find((o) => o.productId === id);
    const link = links.find((l) => l.productId === id);
    return {
      title: override?.title ?? "",
      category: override?.category ?? "",
      imageUrl: override?.imageUrl ?? "",
      price: link?.price != null ? String(link.price) : "",
      affiliateUrl: link?.url ?? "",
    };
  };

  const setField = (id: number, field: keyof ProductDraft, value: string) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...getDraft(id), ...prev[id], [field]: value } }));
  };

  const handleSave = async (productId: number) => {
    const draft = getDraft(productId);
    const title = draft.title.trim() || null;
    const category = draft.category.trim() || null;
    const imageUrl = draft.imageUrl.trim() || null;
    const price = draft.price.trim() ? parseFloat(draft.price) : null;
    const affiliateUrl = draft.affiliateUrl.trim();

    if (affiliateUrl && !isValidAmazonUrl(affiliateUrl)) {
      toast({ description: "Affiliate URL must be an Amazon link.", variant: "destructive" });
      return;
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
      toast({ description: "Photo URL is not a valid URL.", variant: "destructive" });
      return;
    }
    if (draft.price && (isNaN(price!) || price! <= 0)) {
      toast({ description: "Enter a valid price.", variant: "destructive" });
      return;
    }

    setSaving((prev) => ({ ...prev, [productId]: true }));
    try {
      const hasProductData = !!(title || category || imageUrl);
      const hasLinkData = !!(affiliateUrl || price != null);
      const existingOverride = overrides.find((o) => o.productId === productId);
      const existingLink = links.find((l) => l.productId === productId);

      const calls: Promise<unknown>[] = [];

      if (hasProductData) {
        calls.push(
          fetch(`/api/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, category, imageUrl }),
          }),
        );
      } else if (existingOverride) {
        calls.push(fetch(`/api/products/${productId}`, { method: "DELETE" }));
      }

      if (hasLinkData) {
        calls.push(
          fetch(`/api/affiliate-links/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: affiliateUrl, price }),
          }),
        );
      } else if (existingLink) {
        calls.push(fetch(`/api/affiliate-links/${productId}`, { method: "DELETE" }));
      }

      await Promise.all(calls);
      await fetchData();
      setSaved((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [productId]: false })), 2000);
      toast({ description: "Product saved!" });
    } catch {
      toast({ description: "Failed to save.", variant: "destructive" });
    } finally {
      setSaving((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleReset = (productId: number) => {
    setDrafts((prev) => ({ ...prev, [productId]: getSavedDraft(productId) }));
  };

  const handleDeleteAll = async (productId: number) => {
    const override = overrides.find((o) => o.productId === productId);
    const link = links.find((l) => l.productId === productId);
    const calls: Promise<unknown>[] = [];
    if (override) calls.push(fetch(`/api/products/${productId}`, { method: "DELETE" }));
    if (link) calls.push(fetch(`/api/affiliate-links/${productId}`, { method: "DELETE" }));
    await Promise.all(calls);
    await fetchData();
    setDrafts((prev) => ({
      ...prev,
      [productId]: { title: "", category: "", imageUrl: "", price: "", affiliateUrl: "" },
    }));
    toast({ description: "All overrides removed." });
  };

  const configuredCount = new Set([
    ...overrides.map((o) => o.productId),
    ...links.map((l) => l.productId),
  ]).size;

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {loading ? "Loading..." : `${configuredCount} of ${PRODUCTS.length} products have overrides.`}
      </p>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
        <span className="mt-0.5 shrink-0">💡</span>
        <span>
          Override any product&apos;s <strong>name, category, photo URL, price, or Amazon link</strong>.
          Leave blank to keep the default. Changes save to the database instantly.
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {PRODUCTS.map((product, i) => {
            const override = overrides.find((o) => o.productId === product.id);
            const link = links.find((l) => l.productId === product.id);
            const draft = getDraft(product.id);
            const savedDraft = getSavedDraft(product.id);
            const isDirty = JSON.stringify(draft) !== JSON.stringify(savedDraft);
            const hasOverride = !!(override || link);
            const displayImage = draft.imageUrl || override?.imageUrl || product.image;
            const displayTitle = draft.title || override?.title || product.title;
            const displayCat = draft.category || override?.category || product.category;
            const displayPrice =
              draft.price || (link?.price != null ? String(link.price) : String(product.price));
            const isSaving = saving[product.id];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border/50 bg-muted/20 p-4">
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImage}
                      alt={displayTitle}
                      className="h-10 w-10 rounded-xl bg-muted object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = product.image;
                      }}
                    />
                    <span
                      className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${hasOverride ? "bg-emerald-400" : "bg-muted-foreground/30"}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{displayTitle}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {displayCat} · ${parseFloat(displayPrice || "0").toFixed(2)}
                    </p>
                  </div>
                  {isDirty && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                      unsaved
                    </span>
                  )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Pencil className="h-3 w-3" /> Product Name
                    </label>
                    <Input
                      value={draft.title}
                      onChange={(e) => setField(product.id, "title", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void handleSave(product.id)}
                      placeholder={product.title}
                      className="h-9 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Tag className="h-3 w-3" /> Category
                    </label>
                    <select
                      value={draft.category}
                      onChange={(e) => setField(product.id, "category", e.target.value)}
                      className="h-9 rounded-xl border border-primary/20 bg-background px-3 text-xs capitalize focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">— keep default ({product.category}) —</option>
                      {allCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <DollarSign className="h-3 w-3" /> Price Override
                    </label>
                    <div className="relative">
                      <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={draft.price}
                        onChange={(e) => setField(product.id, "price", e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && void handleSave(product.id)}
                        placeholder={product.price.toFixed(2)}
                        className="h-9 rounded-xl border-primary/20 pl-8 text-xs focus-visible:ring-primary/30"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-2">
                    <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <ImageIcon className="h-3 w-3" /> Photo URL
                    </label>
                    <Input
                      value={draft.imageUrl}
                      onChange={(e) => setField(product.id, "imageUrl", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void handleSave(product.id)}
                      placeholder="https://... (paste any image URL)"
                      className={`h-9 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30 ${draft.imageUrl && !isValidUrl(draft.imageUrl) ? "border-red-300 bg-red-50" : ""}`}
                    />
                  </div>

                  <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
                    <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <ExternalLink className="h-3 w-3" /> Amazon Affiliate URL
                    </label>
                    <div className="relative">
                      <Input
                        value={draft.affiliateUrl}
                        onChange={(e) => setField(product.id, "affiliateUrl", e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && void handleSave(product.id)}
                        placeholder="https://www.amazon.com/dp/... or amzn.to/..."
                        className={`h-9 rounded-xl border-primary/20 pr-8 text-xs focus-visible:ring-primary/30 ${draft.affiliateUrl && !isValidAmazonUrl(draft.affiliateUrl) ? "border-red-300 bg-red-50" : ""}`}
                      />
                      {link?.url && draft.affiliateUrl === link.url && (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 px-4 pb-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => void handleSave(product.id)}
                      disabled={!isDirty || isSaving}
                      className={`h-8 gap-1.5 rounded-full px-4 text-xs transition-all ${saved[product.id] ? "bg-emerald-500 text-white hover:bg-emerald-500" : "bg-primary text-white hover:bg-primary/90"}`}
                    >
                      {isSaving ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : saved[product.id] ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      {saved[product.id] ? "Saved" : "Save"}
                    </Button>
                    {isDirty && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReset(product.id)}
                        className="h-8 rounded-full px-3 text-xs text-muted-foreground"
                      >
                        <X className="mr-1 h-3 w-3" /> Discard
                      </Button>
                    )}
                  </div>
                  {hasOverride && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void handleDeleteAll(product.id)}
                      className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                      title="Remove all overrides"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Categories Tab ───────────────────────────────────────────────────────────
interface CategoryDraft {
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: string;
}

function CategoriesTab() {
  const { toast } = useToast();
  const [dbCategories, setDbCategories] = useState<CategoryOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, CategoryDraft>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [addingNew, setAddingNew] = useState(false);
  const [newId, setNewId] = useState("");
  const [newDraft, setNewDraft] = useState<CategoryDraft>({
    name: "",
    description: "",
    imageUrl: "",
    sortOrder: "",
  });
  const newNameRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/categories").then((r) => r.json());
      setDbCategories(data as CategoryOverride[]);
    } catch {
      toast({ description: "Failed to load categories.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const defaultIds: string[] = CATEGORIES.map((c) => c.id);
  const mergedList = [
    ...CATEGORIES.map((c) => {
      const db = dbCategories.find((d) => d.id === c.id);
      return {
        id: c.id,
        defaultName: c.name,
        defaultDesc: c.description,
        defaultImage: c.image,
        db,
        isDefault: true,
      };
    }),
    ...dbCategories
      .filter((d) => !defaultIds.includes(d.id))
      .map((d) => ({
        id: d.id,
        defaultName: "",
        defaultDesc: "",
        defaultImage: "",
        db: d,
        isDefault: false,
      })),
  ];

  useEffect(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      mergedList.forEach(({ id, defaultName, defaultDesc, defaultImage, db }) => {
        if (id in next) return;
        next[id] = {
          name: db?.name ?? defaultName,
          description: db?.description ?? defaultDesc,
          imageUrl: db?.imageUrl ?? defaultImage,
          sortOrder: db?.sortOrder != null ? String(db.sortOrder) : "0",
        };
      });
      return next;
    });
  }, [dbCategories]); // eslint-disable-line react-hooks/exhaustive-deps

  const getDraft = (id: string): CategoryDraft =>
    drafts[id] ?? { name: "", description: "", imageUrl: "", sortOrder: "0" };

  const getSaved = (item: (typeof mergedList)[0]): CategoryDraft => ({
    name: item.db?.name ?? item.defaultName,
    description: item.db?.description ?? item.defaultDesc,
    imageUrl: item.db?.imageUrl ?? item.defaultImage,
    sortOrder: item.db?.sortOrder != null ? String(item.db.sortOrder) : "0",
  });

  const setField = (id: string, field: keyof CategoryDraft, value: string) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...getDraft(id), ...prev[id], [field]: value } }));
  };

  const handleSave = async (categoryId: string) => {
    const draft = getDraft(categoryId);
    if (!draft.name.trim()) {
      toast({ description: "Category name is required.", variant: "destructive" });
      return;
    }
    if (draft.imageUrl && !isValidUrl(draft.imageUrl)) {
      toast({ description: "Image URL is not valid.", variant: "destructive" });
      return;
    }
    setSaving((prev) => ({ ...prev, [categoryId]: true }));
    try {
      await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name.trim(),
          description: draft.description.trim() || null,
          imageUrl: draft.imageUrl.trim() || null,
          sortOrder: parseInt(draft.sortOrder) || 0,
        }),
      });
      await fetchData();
      setSaved((prev) => ({ ...prev, [categoryId]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [categoryId]: false })), 2000);
      toast({ description: "Category saved!" });
    } catch {
      toast({ description: "Failed to save.", variant: "destructive" });
    } finally {
      setSaving((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const handleAddNew = async () => {
    if (!newId.trim() || !newDraft.name.trim()) {
      toast({ description: "Slug and name are required.", variant: "destructive" });
      return;
    }
    const slug = newId.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) {
      toast({ description: "Invalid slug.", variant: "destructive" });
      return;
    }
    try {
      await fetch(`/api/categories/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDraft.name.trim(),
          description: newDraft.description.trim() || null,
          imageUrl: newDraft.imageUrl.trim() || null,
          sortOrder: parseInt(newDraft.sortOrder) || 0,
        }),
      });
      await fetchData();
      setAddingNew(false);
      setNewId("");
      setNewDraft({ name: "", description: "", imageUrl: "", sortOrder: "" });
      toast({ description: "Category added!" });
    } catch {
      toast({ description: "Failed to add category.", variant: "destructive" });
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
      setDrafts((prev) => {
        const n = { ...prev };
        delete n[categoryId];
        return n;
      });
      await fetchData();
      toast({ description: "Category deleted." });
    } catch {
      toast({ description: "Failed to delete.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Loading..."
            : `${mergedList.length} categories (${dbCategories.length} with DB overrides)`}
        </p>
        <Button
          size="sm"
          onClick={() => {
            setAddingNew(true);
            setTimeout(() => newNameRef.current?.focus(), 50);
          }}
          className="h-8 gap-1.5 rounded-full bg-primary px-3 text-xs text-white hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" /> Add Category
        </Button>
      </div>

      {addingNew && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-5"
        >
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Plus className="h-4 w-4 text-primary" /> New Category
          </h3>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Slug (URL ID) *</label>
              <Input
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="e.g. wellness"
                className="h-9 rounded-xl border-primary/20 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Name *</label>
              <Input
                ref={newNameRef}
                value={newDraft.name}
                onChange={(e) => setNewDraft((p) => ({ ...p, name: e.target.value }))}
                placeholder="Display name"
                className="h-9 rounded-xl border-primary/20 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Input
                value={newDraft.description}
                onChange={(e) => setNewDraft((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short tagline"
                className="h-9 rounded-xl border-primary/20 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Sort Order</label>
              <Input
                type="number"
                value={newDraft.sortOrder}
                onChange={(e) => setNewDraft((p) => ({ ...p, sortOrder: e.target.value }))}
                placeholder="0"
                className="h-9 rounded-xl border-primary/20 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Image URL</label>
              <Input
                value={newDraft.imageUrl}
                onChange={(e) => setNewDraft((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://... (category header image)"
                className="h-9 rounded-xl border-primary/20 text-xs"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => void handleAddNew()}
              className="h-8 gap-1.5 rounded-full bg-primary px-4 text-xs text-white hover:bg-primary/90"
            >
              <Save className="h-3 w-3" /> Save Category
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setAddingNew(false)}
              className="h-8 rounded-full px-3 text-xs text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
        <span className="mt-0.5 shrink-0">💡</span>
        <span>
          Edit <strong>name, description, and photo</strong> for any category. Default categories
          can be customized but not deleted. Custom categories you add can be deleted.
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mergedList.map((item, i) => {
            const draft = getDraft(item.id);
            const savedD = getSaved(item);
            const isDirty = JSON.stringify(draft) !== JSON.stringify(savedD);
            const previewImage = draft.imageUrl || item.db?.imageUrl || item.defaultImage;
            const isSaving = saving[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center gap-3 border-b border-border/50 bg-muted/20 p-4">
                  <div className="relative shrink-0">
                    {previewImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewImage}
                        alt={draft.name}
                        className="h-10 w-10 rounded-xl bg-muted object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <LayoutGrid className="h-5 w-5 text-primary/50" />
                      </div>
                    )}
                    <span
                      className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${item.db ? "bg-emerald-400" : "bg-muted-foreground/30"}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {draft.name || item.defaultName}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {item.id}{" "}
                      {!item.isDefault && (
                        <span className="ml-1 font-sans text-primary">(custom)</span>
                      )}
                    </p>
                  </div>
                  {isDirty && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                      unsaved
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">Name *</label>
                    <Input
                      value={draft.name}
                      onChange={(e) => setField(item.id, "name", e.target.value)}
                      placeholder={item.defaultName || "Category name"}
                      className="h-9 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">Description</label>
                    <Input
                      value={draft.description}
                      onChange={(e) => setField(item.id, "description", e.target.value)}
                      placeholder={item.defaultDesc || "Short tagline"}
                      className="h-9 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Image URL</label>
                    <Input
                      value={draft.imageUrl}
                      onChange={(e) => setField(item.id, "imageUrl", e.target.value)}
                      placeholder={item.defaultImage || "https://... (category banner image)"}
                      className={`h-9 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30 ${draft.imageUrl && !isValidUrl(draft.imageUrl) ? "border-red-300 bg-red-50" : ""}`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 pb-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => void handleSave(item.id)}
                      disabled={!isDirty || isSaving}
                      className={`h-8 gap-1.5 rounded-full px-4 text-xs transition-all ${saved[item.id] ? "bg-emerald-500 text-white hover:bg-emerald-500" : "bg-primary text-white hover:bg-primary/90"}`}
                    >
                      {isSaving ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : saved[item.id] ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      {saved[item.id] ? "Saved" : "Save"}
                    </Button>
                    {isDirty && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDrafts((p) => ({ ...p, [item.id]: savedD }))}
                        className="h-8 rounded-full px-3 text-xs text-muted-foreground"
                      >
                        <X className="mr-1 h-3 w-3" /> Discard
                      </Button>
                    )}
                  </div>
                  {!item.isDefault && item.db && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void handleDelete(item.id)}
                      className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                      title="Delete category"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin ───────────────────────────────────────────────────────────────
export function AdminPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAdminAuthed());
  }, []);

  const handleLogin = () => {
    setAdminAuthed(true);
    setAuthed(true);
  };

  const handleLogout = () => {
    setAdminAuthed(false);
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-br from-[hsl(270,40%,97%)] via-[hsl(340,60%,97%)] to-[hsl(20,80%,97%)] px-4 py-10">
        <div className="container mx-auto">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary/70">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin Panel
              </div>
              <h1 className="mb-1 font-serif text-3xl font-bold text-foreground md:text-4xl">
                Site Manager
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit products, prices, affiliate links, and categories.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="h-10 gap-2 rounded-full border-border text-muted-foreground"
            >
              <Unlock className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
