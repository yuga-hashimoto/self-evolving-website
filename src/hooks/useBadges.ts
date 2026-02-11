'use client';

import { useContext } from 'react';
import { BadgeContext } from '@/components/features/badges/BadgeContext';

export const useBadges = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadges must be used within a BadgeProvider');
  }
  return context;
};
