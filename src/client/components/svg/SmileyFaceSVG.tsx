import React from 'react';

export function SmileyFaceSvg({
  className,
  fill = 'none',
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      fill={fill}
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 9.05001V8.95001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 9.05001V8.95001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        id="mouth"
        d="M16 14C15.5 15.5 14.2091 17 12 17C9.79086 17 8.5 15.5 8 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
