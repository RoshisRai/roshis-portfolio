export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
          Hi, I&#39;m <span className="text-cyan-600">Roshis</span>.
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
          Full-Stack Software Engineer building scalable web apps, APIs & AI-Powered Automation Solutions.
        </h2>
        <p className="mt-5 text-xl italic text-gray-700 dark:text-gray-300">
          I design and build end-to-end applications — from frontend UX to backend architecture — with experience in automation and AI integrations.
        </p>
      </main>
    </div>
  );
}
