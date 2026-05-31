import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="mb-4 text-3xl font-bold tracking-tight" {...props} />,
  h2: (props) => (
    <h2 className="mb-3 mt-8 text-2xl font-semibold tracking-tight" {...props} />
  ),
  h3: (props) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold tracking-tight" {...props} />
  ),
  p: (props) => <p className="mb-4 leading-7 text-neutral-700" {...props} />,
  ul: (props) => <ul className="mb-4 list-disc space-y-2 pl-6" {...props} />,
  ol: (props) => <ol className="mb-4 list-decimal space-y-2 pl-6" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  a: (props) => (
    <a className="font-medium text-neutral-900 underline underline-offset-4" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="mb-4 border-l-4 border-neutral-200 pl-4 italic text-neutral-600"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-8 border-neutral-200" {...props} />,
};
