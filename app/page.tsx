'use client';

import React from 'react';
import { useWalletMode } from './_context/WalletModeContext';
import { WelcomeScreen } from './_components/welcome-screen';
import { Dashboard } from './_components/dashboard';

export default function Home() {
  const { wallet } = useWalletMode();

  if (!wallet) {
    return <WelcomeScreen />;
  }

  return <Dashboard />;
}
