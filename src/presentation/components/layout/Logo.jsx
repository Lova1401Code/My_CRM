export function Logo({ size = 32, withText = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="logo-fg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#logo-bg)" />
        <g
          fill="none"
          stroke="url(#logo-fg)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 38 L20 26 Q20 23 23 23 L26 23" />
          <path d="M44 38 L44 26 Q44 23 41 23 L38 23" />
          <path d="M26 23 L26 19 Q26 16 29 16 L35 16 Q38 16 38 19 L38 23" />
          <path d="M20 38 Q20 44 26 44 L38 44 Q44 44 44 38" />
        </g>
        <circle cx="32" cy="30" r="4" fill="url(#logo-fg)" />
        <path
          d="M28 34 Q32 38 36 34"
          fill="none"
          stroke="url(#logo-fg)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {withText && (
        <span className="text-lg font-semibold text-white">CRM</span>
      )}
    </div>
  );
}