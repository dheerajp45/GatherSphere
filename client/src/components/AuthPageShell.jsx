function AuthPageShell({ title, subtitle, children }) {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

export const authInputClass =
  "w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900";

export const authLabelClass = "mb-1.5 block text-sm font-medium text-neutral-700";

export default AuthPageShell;
