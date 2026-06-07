"use client";

import { motion } from "framer-motion";
import {
  Check,
  DollarSign,
  ExternalLink,
  ImageIcon,
  LayoutGrid,
  Loader2,
  Upload,
  Lock,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Star,
  Tag,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadCategoryImage, uploadProductImage } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/data";
import type { CategoryOverride } from "@/types/catalog";
import type { DbProduct } from "@/lib/db/queries/product-overrides";

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
  rating: string;
}

const emptyDraft = (): ProductDraft => ({
  title: "",
  category: "",
  imageUrl: "",
  price: "",
  affiliateUrl: "",
  rating: "",
});

function productToDraft(p: DbProduct): ProductDraft {
  return {
    title: p.title,
    category: p.category,
    imageUrl: p.imageUrl ?? "",
    price: String(p.price),
    affiliateUrl: p.affiliateUrl ?? "",
    rating: p.rating != null ? String(p.rating) : "",
  };
}

function ProductsTab() {
  const { toast } = useToast();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<number, ProductDraft>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [addingNew, setAddingNew] = useState(false);
  const [newDraft, setNewDraft] = useState<ProductDraft>(emptyDraft());
  const [savingNew, setSavingNew] = useState(false);
  const newTitleRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]);
      setProducts(p as DbProduct[]);
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
      products.forEach((p) => {
        if (p.id in next) return;
        next[p.id] = productToDraft(p);
      });
      return next;
    });
  }, [products]);

  const allCategories = [
    ...CATEGORIES,
    ...dbCategories
      .filter((d) => !CATEGORIES.find((c) => c.id === d.id))
      .map((d) => ({ id: d.id, name: d.name, image: d.imageUrl ?? "", description: d.description ?? "" })),
  ];

  const getDraft = (id: number): ProductDraft => drafts[id] ?? emptyDraft();

  const setField = (id: number, field: keyof ProductDraft, value: string) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...getDraft(id), ...prev[id], [field]: value } }));
  };

  const validateDraft = (draft: ProductDraft): string | null => {
    if (!draft.title.trim()) return "Product name is required.";
    if (!draft.category.trim()) return "Category is required.";
    const price = parseFloat(draft.price);
    if (!draft.price || isNaN(price) || price <= 0) return "Enter a valid price.";
    if (draft.affiliateUrl && !isValidAmazonUrl(draft.affiliateUrl))
      return "Affiliate URL must be an Amazon link.";
    if (draft.imageUrl && !isValidUrl(draft.imageUrl))
      return "Photo URL is not a valid URL.";
    if (draft.rating && (isNaN(parseFloat(draft.rating)) || parseFloat(draft.rating) < 0 || parseFloat(draft.rating) > 5))
      return "Rating must be between 0 and 5.";
    return null;
  };

  const handleSave = async (productId: number) => {
    const draft = getDraft(productId);
    const err = validateDraft(draft);
    if (err) { toast({ description: err, variant: "destructive" }); return; }

    setSaving((prev) => ({ ...prev, [productId]: true }));
    try {
      await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title.trim(),
          category: draft.category.trim(),
          imageUrl: draft.imageUrl.trim() || null,
          price: parseFloat(draft.price),
          affiliateUrl: draft.affiliateUrl.trim() || null,
          rating: draft.rating.trim() ? parseFloat(draft.rating) : null,
        }),
      });
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

  const handleDelete = async (productId: number) => {
    try {
      await fetch(`/api/products/${productId}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setDrafts((prev) => { const n = { ...prev }; delete n[productId]; return n; });
      toast({ description: "Product deleted." });
    } catch {
      toast({ description: "Failed to delete.", variant: "destructive" });
    }
  };

  const handleAddNew = async () => {
    const err = validateDraft(newDraft);
    if (err) { toast({ description: err, variant: "destructive" }); return; }

    setSavingNew(true);
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDraft.title.trim(),
          category: newDraft.category.trim(),
          imageUrl: newDraft.imageUrl.trim() || null,
          price: parseFloat(newDraft.price),
          affiliateUrl: newDraft.affiliateUrl.trim() || null,
          rating: newDraft.rating.trim() ? parseFloat(newDraft.rating) : null,
        }),
      });
      await fetchData();
      setAddingNew(false);
      setNewDraft(emptyDraft());
      toast({ description: "Product added!" });
    } catch {
      toast({ description: "Failed to add product.", variant: "destructive" });
    } finally {
      setSavingNew(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""}`}
        </p>
        <Button
          size="sm"
          onClick={() => {
            setAddingNew(true);
            setTimeout(() => newTitleRef.current?.focus(), 50);
          }}
          className="h-8 gap-1.5 rounded-full bg-primary px-3 text-xs text-white hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Button>
      </div>

      {addingNew && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-5"
        >
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Plus className="h-4 w-4 text-primary" /> New Product
          </h3>
          <ProductFormFields
            draft={newDraft}
            allCategories={allCategories}
            onField={(field, value) => setNewDraft((p) => ({ ...p, [field]: value }))}
          />
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              onClick={() => void handleAddNew()}
              disabled={savingNew}
              className="h-8 gap-1.5 rounded-full bg-primary px-4 text-xs text-white hover:bg-primary/90"
            >
              {savingNew ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Save Product
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setAddingNew(false); setNewDraft(emptyDraft()); }}
              className="h-8 rounded-full px-3 text-xs text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : products.length === 0 && !addingNew ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="mb-2 text-sm font-medium text-foreground">No products yet</p>
          <p className="mb-4 text-xs text-muted-foreground">
            Click &ldquo;Add Product&rdquo; to create your first product.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product, i) => {
            const draft = getDraft(product.id);
            const savedDraft = productToDraft(product);
            const isDirty = JSON.stringify(draft) !== JSON.stringify(savedDraft);
            const isSaving = saving[product.id];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center gap-3 border-b border-border/50 bg-muted/20 p-4">
                  <div className="relative shrink-0">
                    {draft.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={draft.imageUrl}
                        alt={draft.title}
                        className="h-10 w-10 rounded-xl bg-muted object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <ImageIcon className="h-5 w-5 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {draft.title || "Untitled"}
                    </p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {draft.category || "—"} · ₹{parseFloat(draft.price || "0").toFixed(2)}
                    </p>
                  </div>
                  {isDirty && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                      unsaved
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <ProductFormFields
                    draft={draft}
                    allCategories={allCategories}
                    onField={(field, value) => setField(product.id, field, value)}
                    onEnter={() => void handleSave(product.id)}
                  />
                </div>

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
                        onClick={() => setDrafts((prev) => ({ ...prev, [product.id]: productToDraft(product) }))}
                        className="h-8 rounded-full px-3 text-xs text-muted-foreground"
                      >
                        <X className="mr-1 h-3 w-3" /> Discard
                      </Button>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void handleDelete(product.id)}
                    className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                    title="Delete product"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Shared form fields for new + edit ───────────────────────────────────────
function ProductFormFields({
  draft,
  allCategories,
  onField,
  onEnter,
}: {
  draft: ProductDraft;
  allCategories: { id: string; name: string }[];
  onField: (field: keyof ProductDraft, value: string) => void;
  onEnter?: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      onField("imageUrl", url);
    } catch {
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return <ProductFormFieldsInner draft={draft} allCategories={allCategories} onField={onField} onEnter={onEnter} uploading={uploading} fileRef={fileRef} handleUpload={handleUpload} />;
}

function ProductFormFieldsInner({
  draft,
  allCategories,
  onField,
  onEnter,
  uploading,
  fileRef,
  handleUpload,
}: {
  draft: ProductDraft;
  allCategories: { id: string; name: string }[];
  onField: (field: keyof ProductDraft, value: string) => void;
  onEnter?: () => void;
  uploading: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Pencil className="h-3 w-3" /> Product Name *
        </label>
        <Input
          value={draft.title}
          onChange={(e) => onField("title", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          placeholder="e.g. Glow Recipe Cloud Cream"
          className="h-9 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Tag className="h-3 w-3" /> Category *
        </label>
        <select
          value={draft.category}
          onChange={(e) => onField("category", e.target.value)}
          className="h-9 rounded-xl border border-primary/20 bg-background px-3 text-xs capitalize focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">— select category —</option>
          {allCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <DollarSign className="h-3 w-3" /> Price (₹) *
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={draft.price}
            onChange={(e) => onField("price", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
            placeholder="0.00"
            className="h-9 rounded-xl border-primary/20 pl-7 text-xs focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Star className="h-3 w-3" /> Amazon Rating
        </label>
        <Input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={draft.rating}
          onChange={(e) => onField("rating", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          placeholder="e.g. 4.8"
          className="h-9 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30"
        />
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-2">
        <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <ImageIcon className="h-3 w-3" /> Photo
        </label>
        <div className="flex gap-2">
          <Input
            value={draft.imageUrl}
            onChange={(e) => onField("imageUrl", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
            placeholder="https://... (paste image URL or upload)"
            className={`h-9 flex-1 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30 ${draft.imageUrl && !isValidUrl(draft.imageUrl) ? "border-red-300 bg-red-50" : ""}`}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => void handleUpload(e)}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="h-9 shrink-0 gap-1.5 rounded-xl border-primary/20 px-3 text-xs text-primary hover:bg-primary/5"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        {draft.imageUrl && isValidUrl(draft.imageUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.imageUrl} alt="preview" className="mt-1 h-16 w-16 rounded-xl object-cover border border-border" />
        )}
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
        <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <ExternalLink className="h-3 w-3" /> Amazon Affiliate URL
        </label>
        <Input
          value={draft.affiliateUrl}
          onChange={(e) => onField("affiliateUrl", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          placeholder="https://www.amazon.com/dp/... or amzn.to/..."
          className={`h-9 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30 ${draft.affiliateUrl && !isValidAmazonUrl(draft.affiliateUrl) ? "border-red-300 bg-red-50" : ""}`}
        />
      </div>
    </div>
  );
}

// ─── Reusable image upload field ─────────────────────────────────────────────
function CategoryImageField({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadCategoryImage(file);
      onChange(url);
    } catch {
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://... (category image)"}
          className={`h-9 flex-1 rounded-xl border-primary/20 text-xs focus-visible:ring-primary/30 ${value && !isValidUrl(value) ? "border-red-300 bg-red-50" : ""}`}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => void handleUpload(e)}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="h-9 shrink-0 gap-1.5 rounded-xl border-primary/20 px-3 text-xs text-primary hover:bg-primary/5"
        >
          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      {value && isValidUrl(value) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" className="mt-1 h-16 w-16 rounded-xl object-cover border border-border" />
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
              <CategoryImageField
                value={newDraft.imageUrl}
                placeholder="https://... (category header image)"
                onChange={(url) => setNewDraft((p) => ({ ...p, imageUrl: url }))}
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
                    <CategoryImageField
                      value={draft.imageUrl}
                      placeholder={item.defaultImage || "https://... (category banner image)"}
                      onChange={(url) => setField(item.id, "imageUrl", url)}
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
                Add products, set prices, affiliate links, and categories.
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
