export function Announcement() {
  return (
    <div className="relative flex w-full items-center justify-center gap-3 bg-[#1D4ED8] px-4 py-3 text-center text-sm font-medium text-white">
      <span className="hidden sm:inline">
        Now serving Milton · Oakville · Burlington 🇨🇦 — Earn rewards on every completed job.
      </span>
      <span className="sm:hidden">
        Now serving GTA 🇨🇦 — Earn rewards on every job.
      </span>
      <a
        href="/request-service"
        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2563EB] transition duration-200 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Request Help Today!
      </a>
    </div>
  );
}
