"use client";

export default function Avatar({ name, image }: { name?: string | null, image?: string | null }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  if (image) {
    return (
      <img
        src={image}
        alt="Profile"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
        className="w-14 h-14 rounded-full"
        style={{ border: "2px solid rgba(200,146,42,0.4)" }}
      />
    );
  }

  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold text-[#0a0805]"
      style={{
        fontFamily: "'Georgia', serif",
        background: "linear-gradient(135deg, #c8922a 0%, #e8b84b 50%, #c8922a 100%)",
        border: "2px solid rgba(200,146,42,0.4)",
      }}
    >
      {initials}
    </div>
  );
}