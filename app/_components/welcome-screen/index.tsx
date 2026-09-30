'use client';

import React, { useState } from 'react';
import { welcomeStyles as s } from './styles';
import { useWalletMode } from '@/app/_context/WalletModeContext';
import { generateMnemonic, english } from 'viem/accounts';

const FEATURES = [
  {
    icon: '🔐',
    title: 'Zero-Knowledge Vault',
    desc: 'Keys never leave your device. True self-custody Web3 experience.',
  },
  {
    icon: '🔗',
    title: 'Dual Blockchain',
    desc: 'Manage Ethereum Sepolia & Solana Devnet addresses from a single BIP-39 seed phrase.',
  },
  {
    icon: '⚡',
    title: 'Deploy ERC-20 Contracts',
    desc: 'Mint, transfer, and deploy smart contracts in-app. No extensions needed.',
  },
];

export function WelcomeScreen() {
  const { importWallet, importEvmWallet, importSolanaWallet } = useWalletMode();
  
  const [view, setView] = useState<'main' | 'import' | 'create'>('main');
  const [importMode, setImportMode] = useState<'mnemonic'|'solana'|'evm'>('mnemonic');
  const [mnemonicInput, setMnemonicInput] = useState('');
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');

  const handleCreateInit = () => {
    setGeneratedMnemonic(generateMnemonic(english));
    setView('create');
  };

  const handleImportSubmit = () => {
    const input = mnemonicInput.trim();
    try {
      if (importMode === 'mnemonic') {
        if (input.split(' ').length !== 12 && input.split(' ').length !== 24) {
          throw new Error('Please enter a valid 12 or 24-word seed phrase.');
        }
        importWallet(input);
      } else if (importMode === 'solana') {
        importSolanaWallet(input);
      } else if (importMode === 'evm') {
        importEvmWallet(input);
      }
    } catch (e: any) {
      alert(e.message || 'Invalid input. Please check your key or phrase.');
    }
  };

  const handleCreateConfirm = () => {
    importWallet(generatedMnemonic);
  };

  return (
    <div className={s.root}>
      <div className={s.orb1} />
      <div className={s.orb2} />
      <div className={s.orb3} />

      <div className={s.hero}>
        <div className={s.badge}>
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          Self-Sovereign · Pure Web3 · Multi-Chain
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className={s.logo}>⚡</div>
          <h1 className={s.title}>Aetherius Vault</h1>
          <p className={s.subtitle}>
            Your sovereign multi-chain crypto terminal. No browser extensions required.
            You own your keys. Always.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-sm mt-4">
          {view === 'main' && (
            <>
              <button onClick={handleCreateInit} className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2">
                <span>🔮</span>
                <span>Create New Vault</span>
              </button>
              <button onClick={() => setView('import')} className="w-full px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm font-bold text-neutral-300 transition-all active:scale-95 flex items-center justify-center gap-2">
                <span>🔑</span>
                <span>Import Recovery Phrase</span>
              </button>
            </>
          )}

          {view === 'import' && (
            <div className="w-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex bg-neutral-900 rounded-lg p-1 text-[10px] font-bold text-neutral-400">
                <button 
                  onClick={() => setImportMode('mnemonic')}
                  className={`flex-1 py-2 rounded-md transition-colors ${importMode === 'mnemonic' ? 'bg-neutral-800 text-white' : 'hover:text-white'}`}
                >
                  12-Words
                </button>
                <button 
                  onClick={() => setImportMode('solana')}
                  className={`flex-1 py-2 rounded-md transition-colors ${importMode === 'solana' ? 'bg-neutral-800 text-purple-400' : 'hover:text-purple-400'}`}
                >
                  Solana PK
                </button>
                <button 
                  onClick={() => setImportMode('evm')}
                  className={`flex-1 py-2 rounded-md transition-colors ${importMode === 'evm' ? 'bg-neutral-800 text-blue-400' : 'hover:text-blue-400'}`}
                >
                  EVM PK
                </button>
              </div>
              <textarea
                placeholder={importMode === 'mnemonic' ? "Enter 12-word seed phrase..." : importMode === 'solana' ? "Enter base58 Solana Private Key..." : "Enter 0x... EVM Private Key"}
                value={mnemonicInput}
                onChange={(e) => setMnemonicInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 outline-none focus:border-indigo-500 transition-colors h-24 resize-none"
              />
              <div className="flex gap-2">
                <button onClick={() => setView('main')} className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm font-bold text-neutral-300 transition-all active:scale-95">
                  Cancel
                </button>
                <button onClick={handleImportSubmit} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                  Import Vault
                </button>
              </div>
            </div>
          )}

          {view === 'create' && (
            <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <p className="text-xs text-amber-500/80 mb-3 uppercase tracking-wider font-bold">Write this down. Never share it.</p>
                <p className="text-sm font-mono text-neutral-200 select-all leading-loose">{generatedMnemonic}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setView('main')} className="w-1/3 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm font-bold text-neutral-300 transition-all active:scale-95">
                  Cancel
                </button>
                <button onClick={handleCreateConfirm} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                  I Saved It - Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={s.featureGrid}>
        {FEATURES.map((f) => (
          <div key={f.title} className={s.featureCard}>
            <span className="text-2xl">{f.icon}</span>
            <span className="text-xs font-bold text-white">{f.title}</span>
            <span className="text-xs text-neutral-500 leading-relaxed">{f.desc}</span>
          </div>
        ))}
      </div>

      <p className={s.featureMono}>PURE WEB3 · NON-CUSTODIAL · BIP-39</p>
    </div>
  );
}
