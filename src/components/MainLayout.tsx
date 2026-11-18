'use client';

import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { GameProvider } from '@/contexts/GameContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <GameProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Game status banner */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-gray-100">
                      How to Play
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      1. Add players (max 7) • 2. Enter scores per round • 3. Track elimination at 201+ points
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span>Active Player</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-danger" />
                        <span>Eliminated</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-warning" />
                        <span>Near Limit (180+)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left sidebar - Player Management */}
              <div className="lg:col-span-1">
                {React.Children.toArray(children)[0]}
              </div>
              
              {/* Main content area - Score Entry & Display */}
              <div className="lg:col-span-2 space-y-6">
                {React.Children.toArray(children).slice(1)}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </GameProvider>
  );
}