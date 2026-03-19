export default function Divider() {
  return (
    <div className="flex items-center gap-3 my-5 w-full max-w-xs">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c8922a]/40" />
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#c8922a]/70">
          <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill="currentColor" />
        </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c8922a]/40" />
    </div>
  );
}