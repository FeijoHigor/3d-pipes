import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:text-primary-light transition-colors">
            <span className="text-2xl">🧊</span>
            <span>3D Pipeline</span>
          </Link>
          <span className="text-xs text-zinc-500 font-mono">MVP</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
