export function Announcement() {
  return (
    <div className="relative flex w-full items-center justify-center gap-3 bg-[#000000] px-4 py-3 text-center text-sm font-medium text-[#FEFEFD]">
      <span className="hidden text-[#CCC9D8] sm:inline">
        Local home services are live for request intake.
      </span>
      <a
        href="/request-service"
        className="rounded-[22px] bg-[#F2B5D7] px-3 py-1 text-xs font-semibold text-[#0C110F] transition duration-200 hover:bg-[#f5c6e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B5D7]"
      >
        Request Service
      </a>
    </div>
  );
}
