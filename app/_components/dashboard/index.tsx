'use client';

import React, { useState, useEffect } from 'react';
import { VaultHeader } from '../vault-header';
import { ThreeDVaultCard } from '../three-d-vault-card';
import { EvmPanel } from '../evm-panel';
import { SolanaPanel } from '../solana-panel';
import { useWalletMode } from '@/app/_context/WalletModeContext';
import { Lock } from 'lucide-react';

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
            <Lock className="w-8 h-8 text-neutral-500 mb-4" />
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
            <Lock className="w-8 h-8 text-neutral-500 mb-4" />
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
    <div className="relative min-h-screen bg-[#000000] text-neutral-200 flex flex-col items-center justify-between p-4 sm:p-8 overflow-x-hidden selection:bg-white selection:text-black">
      <div className="w-full max-w-4xl flex flex-col gap-6 z-10">
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
    </div>
  );
}
