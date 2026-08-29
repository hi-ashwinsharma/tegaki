import React, { useState } from 'react';
import { HeroHeader } from './HeroHeader';
import { HeroMainSection } from './HeroMainSection';
import { InteractivePaperSection } from './InteractivePaperSection';
import { TwoSpheresSection } from './TwoSpheresSection';
import { ThemeShowcaseSection } from './ThemeShowcaseSection';
import { ManifestoFooter } from './ManifestoFooter';
import { PrivacyModal } from './PrivacyModal';
import { useAuth } from '../../hooks/useAuth';

interface LandingHeroProps {
  onStartWriting: () => void;
  onExplorePublic: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartWriting,
  onExplorePublic,
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuth();
  const [modalState, setModalState] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div
      className="min-h-screen selection:bg-neutral-200 dark:selection:bg-neutral-800"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* 1. Header Navigation */}
      <HeroHeader
        isAuthenticated={isAuthenticated}
        onStartWriting={onStartWriting}
        onOpenAuth={onOpenAuth}
      />

      {/* 2. Primary Hero Headline & Value Props */}
      <HeroMainSection
        isAuthenticated={isAuthenticated}
        onStartWriting={onStartWriting}
        onExplorePublic={onExplorePublic}
        onOpenAuth={onOpenAuth}
      />

      {/* 3. Interactive Paper Canvas & Selection Toolbar */}
      <InteractivePaperSection />

      {/* 4. Two Spheres of Thought: AES-256 Intimacy vs Public Letter */}
      <TwoSpheresSection />

      {/* 5. Four Calibrated Themes with Circle Reveal */}
      <ThemeShowcaseSection />

      {/* 6. Quiet Desk Manifesto & Footer */}
      <ManifestoFooter
        isAuthenticated={isAuthenticated}
        onStartWriting={onStartWriting}
        onOpenAuth={onOpenAuth}
        onOpenPrivacy={(mode) => setModalState(mode)}
      />

      {/* Privacy Policy & Terms Modal */}
      <PrivacyModal
        isOpen={modalState !== null}
        onClose={() => setModalState(null)}
        mode={modalState || 'privacy'}
      />
    </div>
  );
};
