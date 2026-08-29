import React from 'react';
import {
  Home,
  Feather,
  Lock,
  Globe,
  Palette,
  SunMedium,
  Moon,
  Search,
  MessageSquare,
  Share2,
  Edit3,
  Trash2,
  Plus,
  Image as ImageIcon,
  Link2,
  Code2,
  Minus,
  Check,
  X,
  User,
  ArrowLeft,
  ArrowRight,
  Send,
  Copy,
  ExternalLink,
  BookOpen,
  Clock,
} from 'lucide-react';

// Minimalist Clean Circular Logo
export const CircularLogoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="4.5" strokeDasharray="2 2" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// Rounded Modern Home Icon
export const SquircleHomeIcon: React.FC<{ size?: number; className?: string; filled?: boolean }> = ({
  size = 20,
  className = '',
  filled = false,
}) => (
  <Home
    size={size}
    strokeWidth={filled ? 2.2 : 1.6}
    className={className}
  />
);

// Editorial Writer Icon (Feather Quill)
export const PeacockFeatherIcon: React.FC<{ size?: number; className?: string; active?: boolean }> = ({
  size = 20,
  className = '',
  active = false,
}) => (
  <Feather
    size={size}
    strokeWidth={active ? 2.2 : 1.6}
    className={className}
  />
);

// Authentic Minimalist Clapping Hands Icon
export const ClapIcon: React.FC<{ size?: number; className?: string; strokeWidth?: number }> = ({
  size = 16,
  className = '',
  strokeWidth = 1.75,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Clapping Palms & Fingers Geometry */}
    <path d="M14.5 17.5L9.5 22.5c-.8.8-2 .8-2.8 0l-.7-.7c-.8-.8-.8-2 0-2.8l5.5-5.5" />
    <path d="M8.5 13.5l4-4a2 2 0 0 1 2.8 0l.7.7c.8.8.8 2 0 2.8l-4 4" />
    <path d="M11.5 10.5l3.5-3.5a2 2 0 0 1 2.8 0l.7.7c.8.8.8 2 0 2.8l-3.5 3.5" />
    <path d="M14.5 7.5l2.5-2.5a2 2 0 0 1 2.8 0l.7.7c.8.8.8 2 0 2.8L17 12" />
    {/* Motion burst */}
    <path d="M4 6l2 2" opacity="0.6" />
    <path d="M2 11h2.5" opacity="0.6" />
    <path d="M6.5 3l1 2.5" opacity="0.6" />
  </svg>
);

export const MediumClapIcon = ClapIcon;

export {
  Lock,
  Globe,
  Palette,
  SunMedium,
  Moon,
  Search,
  MessageSquare,
  Share2,
  Edit3,
  Trash2,
  Plus,
  ImageIcon,
  Link2,
  Code2,
  Minus,
  Check,
  X,
  User,
  ArrowLeft,
  ArrowRight,
  Send,
  Copy,
  ExternalLink,
  BookOpen,
  Clock,
};
