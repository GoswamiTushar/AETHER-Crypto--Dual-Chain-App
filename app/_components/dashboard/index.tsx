'use client';

import React, { useState, useEffect } from 'react';
import { VaultHeader } from '../vault-header';
import { ThreeDVaultCard } from '../three-d-vault-card';
import { EvmPanel } from '../evm-panel';
import { SolanaPanel } from '../solana-panel';
import { useWalletMode } from '@/app/_context/WalletModeContext';

export function Dashboard() {
  const { wallet, preferredChain, logout } = useWalletMode();
  const [selectedChain, setSelectedChain] = useState<'evm' | 'solana'>(() => {
    if (preferredChain) return preferredChain;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aetherius_selected_chain');
      if (saved === 'evm' || saved === 'solana') return saved;
    }
    return 'evm';
  });

  useEffect(() => {
    if (preferredChain) {
      setTimeout(() => setSelectedChain(preferredChain), 0);
    }
  }, [preferredChain]);

  const handleSelectChain = (chain: 'evm' | 'solana') => {
    setSelectedChain(chain);
    localStorage.setItem('aetherius_selected_chain', chain);
  };

  const renderPanel = () => {
    if (selectedChain === 'evm') {
      if (!wallet?.evm) {
        return (
          <div className="w-full p-8 flex flex-col items-center justify-center text-center bg-neutral-900 border border-neutral-800 rounded-2xl animate-in fade-in">
            <span className="text-4xl mb-4">🔒</span>
            <h3 className="text-lg font-bold text-white mb-2">Ethereum Panel Locked</h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-sm">
              You did not import an Ethereum Private Key or a 12-Word Recovery Phrase.
            </p>
            <button onClick={logout} className="px-5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors">
              Return to Import Screen
            </button>
          </div>
        );
      }
      return <EvmPanel />;
    } else {
      if (!wallet?.solana) {
        return (
          <div className="w-full p-8 flex flex-col items-center justify-center text-center bg-neutral-900 border border-neutral-800 rounded-2xl animate-in fade-in">
            <span className="text-4xl mb-4">🔒</span>
            <h3 className="text-lg font-bold text-white mb-2">Solana Panel Locked</h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-sm">
              You did not import a Solana Private Key or a 12-Word Recovery Phrase.
            </p>
            <button onClick={logout} className="px-5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors">
              Return to Import Screen
            </button>
          </div>
        );
      }
      return <SolanaPanel />;
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-x-hidden selection:bg-indigo-500/30">
      {/* Floating 3D Cybernetic Orbs */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="pointer-events-none fixed top-1/2 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none fixed -bottom-40 left-1/3 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-3xl flex flex-col gap-6 z-10">
        <VaultHeader
          selectedChain={selectedChain}
          onSelectChain={handleSelectChain}
        />

        <ThreeDVaultCard
          wallet={wallet}
          selectedChain={selectedChain}
        />

        <main className="w-full">
          {renderPanel()}
        </main>
      </div>

      <footer className="mt-12 z-10 w-full max-w-3xl border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
        <span>Aetherius Vault — Autonomous Multi-Chain Cryptographic Terminal</span>
        <span className="font-mono text-[11px] text-neutral-600">
          Stateless • In-Memory
        </span>
      </footer>
    </div>
  );
}
