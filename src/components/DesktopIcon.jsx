export default function DesktopIcon({ label, icon, onDoubleClick, darkMode }) {
  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group w-24 select-none"
      onDoubleClick={onDoubleClick}
    >
      {/* Icon Box: increased from w-12 h-12 to w-16 h-16 (64px) */}
      <div
        className="w-16 h-16 flex items-center justify-center rounded [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
        style={{
          background: "transparent",
          imageRendering: "pixelated",
        }}
      >
        {icon}
      </div>

      {/* Label: increased font size from 11px to 14px with broader width */}
      <span
        className="text-center px-1.5 py-0.5 leading-tight rounded group-hover:bg-[#000080]/60"
        style={{
          color: "#ffffff",
          textShadow: "1px 1px 2px rgba(0,0,0,0.85)",
          fontFamily: "'Courier New', monospace",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        {label}
      </span>
    </div>
  );
}