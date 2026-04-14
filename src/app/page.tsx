import { UIComponentsTest } from "@/components/ui/test-ui-components";

export default function Home() {
  return (
    <>
      <h1 className="text-6xl font-bold text-text-primary">
        Hi, I&apos;m <span className="text-accent">Roshis</span>.
      </h1>

      <h2 className="text-2xl font-semibold text-text-secondary mt-4">
        Full-Stack Software Engineer building scalable web apps, APIs & AI-powered automation.
      </h2>

      <p className="mt-5 text-xl italic text-text-secondary">
        I design and build end-to-end applications — from frontend UX to backend architecture — with experience in automation and AI integrations.
      </p>
      {/* UI Components Test */}
      <UIComponentsTest />
    </>
  );
}