function AuthPageShell({ title, subtitle, children }) {
  return (
    <main className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-gradient-mesh px-6 py-12 overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="glow-blob w-72 h-72 bg-violet-600/15 top-10 -left-20"></div>
      <div className="glow-blob w-96 h-96 bg-indigo-600/10 -bottom-20 right-0"></div>

      <div className="w-full max-w-md rounded-2xl glass-panel p-8 shadow-2xl relative z-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{subtitle}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export const authInputClass =
  "w-full rounded-xl bg-zinc-900/70 border border-zinc-700/60 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition-all duration-200";

export const authLabelClass =
  "mb-1.5 block text-sm font-semibold tracking-wide text-zinc-400";

export default AuthPageShell;
