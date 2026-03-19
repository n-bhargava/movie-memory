export default function FilmStrip() {
  return (
    <div className="flex gap-0 w-full">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 h-6 w-8 border border-[#c8922a]/60 mx-[3px] rounded-sm"
        />
      ))}
    </div>
  );
}