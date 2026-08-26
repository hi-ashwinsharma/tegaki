import React from 'react';

// Minimalist Top Left Circular Vector Icon
export const CircularLogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="16" cy="16" r="8.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
    <circle cx="16" cy="16" r="2.5" fill="currentColor" />
  </svg>
);

// iOS Rounded Squircle Home Icon
export const SquircleHomeIcon: React.FC<{ size?: number; className?: string; filled?: boolean }> = ({
  size = 22,
  className = '',
  filled = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 10.5C3 6.5 6.5 3 10.5 3H13.5C17.5 3 21 6.5 21 10.5V13.5C21 17.5 17.5 21 13.5 21H10.5C6.5 21 3 17.5 3 13.5V10.5Z"
      stroke="currentColor"
      strokeWidth="1.3"
      fill={filled ? 'currentColor' : 'none'}
      fillOpacity={filled ? 0.15 : 0}
    />
    <path
      d="M8.5 14.5V12.2C8.5 11.5 9 11 9.7 11H14.3C15 11 15.5 11.5 15.5 12.2V14.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M8 10L12 6.5L16 10"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Crafted Editorial Peacock Feather Icon (The Writer)
export const PeacockFeatherIcon: React.FC<{ size?: number; className?: string; active?: boolean }> = ({
  size = 24,
  className = '',
  active = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Central Quill Stem */}
    <path
      d="M4 20C9 17 14 13 19 4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    {/* Upper Vane Curves */}
    <path
      d="M19 4C17.5 6 15 7.5 12 8C9 8.5 7 11 6.5 13"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeDasharray="0.5 2.5"
    />
    <path
      d="M19 4C19.5 7 18.5 10 16 12C13.5 14 11 16 9 18"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeDasharray="0.5 2.5"
    />
    {/* Peacock Eye Motif at the top */}
    <ellipse
      cx="16.5"
      cy="6.5"
      rx="2.8"
      ry="3.8"
      transform="rotate(35 16.5 6.5)"
      stroke="currentColor"
      strokeWidth="1.2"
      fill={active ? 'currentColor' : 'none'}
      fillOpacity={active ? 0.2 : 0}
    />
    <circle
      cx="16.8"
      cy="6.2"
      r="1.2"
      fill="currentColor"
    />
  </svg>
);

// Medium Style Claps / Upvote Icon
export const MediumClapIcon: React.FC<{ size?: number; className?: string; active?: boolean }> = ({
  size = 22,
  className = '',
  active = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10.5 4.5C10.5 3.67 11.17 3 12 3C12.83 3 13.5 3.67 13.5 4.5V11H14C14.83 11 15.5 11.67 15.5 12.5V13.5C15.5 14.33 14.83 15 14 15H10.5M8 9.5C8 8.67 8.67 8 9.5 8C10.33 8 11 8.67 11 9.5V14M6 13C6 12.17 6.67 11.5 7.5 11.5C8.33 11.5 9 12.17 9 13V15.5C9 18.5 11.5 21 14.5 21H16C18.5 21 20.5 19 20.5 16.5V12C20.5 10.5 19.5 9.5 18 9.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? 'currentColor' : 'none'}
      fillOpacity={active ? 0.15 : 0}
    />
    <path
      d="M3.5 15.5L5.5 14"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// Minimal Encryption Shield / Lock Icon
export const EncryptedLockIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7 10V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V10" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="12" cy="15.5" r="1.5" fill="currentColor" />
  </svg>
);

// Minimalist Passkey Biometrics Icon
export const PasskeyIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 15.5 3.8 18.58 6.56 20.35M12 22C14.76 22 17.26 20.9 19.1 19.1M22 12C22 6.48 17.52 2 12 2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M12 6C8.69 6 6 8.69 6 12C6 14.88 8.04 17.28 10.76 17.84M12 18C15.31 18 18 15.31 18 12C18 9.3 16.2 7.02 13.7 6.3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);
