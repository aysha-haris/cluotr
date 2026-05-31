import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";
import { compileMDX } from "next-mdx-remote/rsc";

import { NotFoundError } from "@/lib/errors";
import { mdxComponents } from "@/lib/content/mdx-components";
import {
  contentFrontmatterSchema,
  type ContentEntry,
  type ContentListItem,
  type ContentType,
} from "@/types/content";

const CONTENT_ROOT = path.join(process.cwd(), "src/content");

const CONTENT_DIRS: Record<ContentType, string> = {
  blog: "blog",
  guides: "guides",
  roundups: "roundups",
  pinterest: "pinterest",
};

function getContentDir(type: ContentType): string {
  return path.join(CONTENT_ROOT, CONTENT_DIRS[type]);
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

async function readMdxFiles(type: ContentType): Promise<string[]> {
  const dir = getContentDir(type);

  try {
    const entries = await fs.readdir(dir);
    return entries.filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
  } catch {
    return [];
  }
}

function parseFrontmatter(raw: string, filename: string) {
  const { data, content } = matter(raw);
  const frontmatter = contentFrontmatterSchema.parse(data);
  const slug = frontmatter.slug ?? slugFromFilename(filename);

  return { frontmatter, content, slug };
}

export async function getContentEntry(
  type: ContentType,
  slug: string,
): Promise<ContentEntry> {
  const dir = getContentDir(type);
  const files = await readMdxFiles(type);
  const match = files.find((file) => slugFromFilename(file) === slug);

  if (!match) {
    throw new NotFoundError(`${type} content not found: ${slug}`);
  }

  const raw = await fs.readFile(path.join(dir, match), "utf8");
  const parsed = parseFrontmatter(raw, match);

  if (parsed.frontmatter.draft && process.env.NODE_ENV === "production") {
    throw new NotFoundError(`${type} content not found: ${slug}`);
  }

  return {
    slug: parsed.slug,
    type,
    frontmatter: parsed.frontmatter,
    content: parsed.content,
    readingTime: readingTime(parsed.content).text,
  };
}

export async function getAllContent(type: ContentType): Promise<ContentListItem[]> {
  const dir = getContentDir(type);
  const files = await readMdxFiles(type);

  const items: ContentListItem[] = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    const parsed = parseFrontmatter(raw, file);

    if (parsed.frontmatter.draft && process.env.NODE_ENV === "production") {
      continue;
    }

    items.push({
      slug: parsed.slug,
      type,
      title: parsed.frontmatter.title,
      description: parsed.frontmatter.description,
      excerpt: parsed.frontmatter.excerpt,
      featuredImage: parsed.frontmatter.featuredImage,
      publishedAt: parsed.frontmatter.publishedAt,
      readingTime: readingTime(parsed.content).text,
    });
  }

  return items.sort((a, b) => {
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bDate - aDate;
  });
}

export async function getContentSlugs(type: ContentType): Promise<string[]> {
  const items = await getAllContent(type);
  return items.map((item) => item.slug);
}

export async function renderMdxContent(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  return content;
}

export async function getAllContentSlugs(): Promise<
  Array<{ type: ContentType; slug: string }>
> {
  const types = Object.keys(CONTENT_DIRS) as ContentType[];

  const results = await Promise.all(
    types.map(async (type) => {
      const slugs = await getContentSlugs(type);
      return slugs.map((slug) => ({ type, slug }));
    }),
  );

  return results.flat();
}
