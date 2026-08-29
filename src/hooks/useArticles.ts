import { useContext } from 'react';
import { ArticlesContext } from '../context/articlesContextState';

export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticlesProvider');
  }
  return context;
}
