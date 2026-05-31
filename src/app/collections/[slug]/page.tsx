import { notFound } from "next/navigation";

import { JsonLdScript } from "@/components/seo/json-ld-script";
import { collectionPath } from "@/constants/routes";
import { getAllCollections, getCollectionBySlug } from "@/lib/db/queries/collections";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 1800;

export async function generateStaticParams() {
  try {
    const collections = await getAllCollections();
    return collections.map((collection) => ({ slug: collection.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const collection = await getCollectionBySlug(slug);
    if (!collection) {
      return buildMetadata({ title: "Not Found", noIndex: true });
    }

    return buildMetadata({
      title: collection.title,
      description: collection.description ?? undefined,
      path: collectionPath(slug),
      image: collection.cover_image ?? undefined,
    });
  } catch {
    return buildMetadata({ title: "Collection", noIndex: true });
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;

  let collection;

  try {
    collection = await getCollectionBySlug(slug);
  } catch {
    collection = null;
  }

  if (!collection) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
          { name: collection.title, path: collectionPath(slug) },
        ])}
      />

      <header className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-wide text-neutral-500">Collection</p>
        <h1 className="text-4xl font-bold tracking-tight">{collection.title}</h1>
        {collection.description ? (
          <p className="text-lg text-neutral-600">{collection.description}</p>
        ) : null}
      </header>

      <p className="text-sm text-neutral-500">
        Product listings for this collection will render here once populated in the
        database.
      </p>
    </article>
  );
}
