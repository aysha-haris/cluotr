export const ROUTES = {
  home: "/",
  blog: "/blog",
  guides: "/guides",
  roundups: "/roundups",
  pin: "/pin",
  collections: "/collections",
} as const;

export function blogPath(slug: string): string {
  return `${ROUTES.blog}/${slug}`;
}

export function guidePath(slug: string): string {
  return `${ROUTES.guides}/${slug}`;
}

export function roundupPath(slug: string): string {
  return `${ROUTES.roundups}/${slug}`;
}

export function pinPath(slug: string): string {
  return `${ROUTES.pin}/${slug}`;
}

export function collectionPath(slug: string): string {
  return `${ROUTES.collections}/${slug}`;
}
