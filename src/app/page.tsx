'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { PlayerManagement } from '@/components/PlayerManagement';
import { ScoreEntry } from '@/components/ScoreEntry';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { RoundManager } from '@/components/RoundManager';
import { ToastNotification } from '@/components/ToastNotification';

export default function HomePage() {
  return (
    <ToastNotification>
      <MainLayout>
        <PlayerManagement />
        <div className="space-y-6">
          <ScoreEntry />
          <ScoreDisplay />
          <RoundManager />
        </div>
      </MainLayout>
    </ToastNotification>
  );
}