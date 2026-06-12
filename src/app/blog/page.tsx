import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering articles and technical writing by Roshis Rai.",
};

export default function BlogPage() {
  return (
    <main className="container py-24">
      <h1 className="text-4xl font-bold">Blog</h1>
      <p className="mt-4 text-muted-foreground">
        Coming soon. I&apos;ll be sharing articles on software engineering, AI,
        system design, and lessons learned from building production applications.
      </p>
    </main>
  );
}
