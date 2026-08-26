import React from 'react';
import {
  Home,
  Feather,
  Sparkles,
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

// Upvote / Claps Icon
export const MediumClapIcon: React.FC<{ size?: number; className?: string; active?: boolean }> = ({
  size = 18,
  className = '',
  active = false,
}) => (
  <Sparkles
    size={size}
    strokeWidth={active ? 2 : 1.6}
    className={className}
  />
);

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
};
