'use client';

import React from 'react';
import { VaultHeaderProps } from './types';
import { headerStyles as s } from './styles';
import { Layers } from 'lucide-react';
import { useWalletMode } from '@/app/_context/WalletModeContext';

export function VaultHeaderView(p: VaultHeaderProps) {
  const { wallet, logout } = useWalletMode();

  return (
    <header className={s.header}>
      <div className={s.brandCol}>
        <div className={s.titleRow}>
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <h1 className={s.title}>Aetherius</h1>
        </div>
        <p className={s.subtitle}>
          Unified multi-chain development environment. Deploy smart contracts, mint assets, and manage dual EVM & Solana keys in-memory.
        </p>
      </div>

      <div className={s.actionsCol}>
        <div className={s.selectWrap}>
          <select
            value={p.selectedChain}
            onChange={(e) => p.onSelectChain(e.target.value as 'evm' | 'solana')}
            className={s.select}
          >
            <option value="evm">🔷 Ethereum Sepolia</option>
            <option value="solana">🟣 Solana Devnet</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {wallet && (
          <div className={s.userChip}>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs">Wallet Active</span>
            <button onClick={logout} className={s.logoutBtn} title="Disconnect">
              ✕
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
