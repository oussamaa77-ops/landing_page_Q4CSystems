// Q4C mark: a "Q" drawn from four arc segments (the four C's) whose tail is a validation check.
export function Q4CMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <rect width="40" height="40" rx="9" fill="#6d1a2b" />
      <circle cx="18.6" cy="18.6" r="9" stroke="#f4f4f7" strokeWidth="3.2" strokeDasharray="12.54 1.6" strokeDashoffset="6.27" />
      <path d="M21.4 24.2 24.8 27.6 31.6 19.8" stroke="#6d1a2b" strokeWidth="6.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.4 24.2 24.8 27.6 31.6 19.8" stroke="#d9a0ab" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
