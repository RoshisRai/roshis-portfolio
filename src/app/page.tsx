import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
        Hi, I&#39;m <span className="text-cyan-600">Roshis</span>.
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
        Full-Stack Software Engineer building scalable web apps, APIs & AI-Powered Automation Solutions.
      </h2>
      <p className="mt-5 text-xl italic text-gray-700 dark:text-gray-300">
        I design and build end-to-end applications — from frontend UX to backend architecture — with experience in automation and AI integrations.
      </p>
      <Button variant="primary" size="lg" className="mt-8 cursor-pointer">
        View My Work
      </Button>
      <div className="mt-10 p-4 h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        TEST
      </div>
      <div className="mt-10 p-4 h-[300px] bg-sky-100 dark:bg-sky-800 rounded-lg">
        TEST
      </div>
      <div className="mt-10 p-4 h-[600px] bg-fuchsia-100 dark:bg-fuchsia-800 rounded-lg">
        TEST
      </div>
      <div className="mt-10 p-4 h-[400px] bg-rose-100 dark:bg-rose-800 rounded-lg">
        TEST
      </div>
      <div className="mt-10 p-4 h-[550px] bg-mauve-100 dark:bg-mauve-800 rounded-lg">
        TEST
      </div>
    </>
  );
}
