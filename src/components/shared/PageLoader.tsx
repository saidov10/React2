
export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-[#0A0A0B]/80">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#DB4444]"></div>
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-zinc-800"></div>
      </div>
    </div>
  );
}
