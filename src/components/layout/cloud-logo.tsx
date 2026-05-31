export function CloudLogo({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="20"
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M7.5 19C3.35786 19 0 15.6421 0 11.5C0 7.63229 2.92348 4.45331 6.66986 4.04505C7.94276 1.60226 10.4907 0 13.5 0C17.3756 0 20.6121 2.72361 21.3283 6.36862C24.5186 6.67104 27 9.35246 27 12.6667C27 16.1645 24.1645 19 20.6667 19H7.5Z"
        fill="url(#paint0_linear_logo)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_logo"
          x1="0"
          y1="9.5"
          x2="27"
          y2="9.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="hsl(270 40% 65%)" />
          <stop offset="1" stopColor="hsl(348 70% 78%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
