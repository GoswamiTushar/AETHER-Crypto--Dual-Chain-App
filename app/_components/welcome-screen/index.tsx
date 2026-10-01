'use client';

import React, { useState } from 'react';
import { welcomeStyles as s } from './styles';
import { useWalletMode } from '@/app/_context/WalletModeContext';
import { generateMnemonic, english } from 'viem/accounts';
import { Cpu, Layers, RefreshCcw, KeyRound, Plus, ChevronRight, X } from 'lucide-react';
import { WaveBackground } from './WaveBackground';
import { AetheriusLogo } from '../AetheriusLogo';

const FEATURES = [
  {
    icon: <Cpu className="w-4 h-4 text-neutral-400" />,
    title: 'In-Memory Architecture',
    desc: 'Private keys are generated and stored exclusively in browser memory. No databases, no external extensions.',
  },
  {
    icon: <Layers className="w-4 h-4 text-neutral-400" />,
    title: 'Dual-Chain Environment',
    desc: 'Deploy ERC-20 smart contracts on Ethereum Sepolia or initialize SPL tokens on Solana Devnet instantly.',
  },
  {
    icon: <RefreshCcw className="w-4 h-4 text-neutral-400" />,
    title: 'Stateless Operations',
    desc: 'A pristine testing environment. The application state resets upon refresh to maintain strict isolation.',
  },
];

export function WelcomeScreen() {
  const { importWallet, importEvmWallet, importSolanaWallet } = useWalletMode();

  const [view, setView] = useState<'main' | 'import' | 'create'>('main');
  const [importMode, setImportMode] = useState<'mnemonic' | 'solana' | 'evm'>('mnemonic');
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
      <div className={`${s.leftCol} relative overflow-hidden`}>
        <WaveBackground />
        <div className={`${s.logo} relative z-10 flex items-center gap-3.5`}>
          <div className="relative p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/80 backdrop-blur-md shadow-2xl flex items-center justify-center group hover:border-neutral-700/80 transition-all">
            <AetheriusLogo size={36} withGlow={true} animated={true} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-300 font-bold flex items-center gap-2">
              Aetherius
            </span>
          </div>
        </div>
        <div className="flex flex-col relative z-10">
          <h1 className={s.title}>Aetherius</h1>
          <p className={s.subtitle}>
            A unified development environment for Ethereum and Solana. Build, deploy, and manage digital assets from a single interface.
          </p>
        </div>
      </div>

      <div className={s.rightCol}>
        <div className="flex flex-col w-full max-w-md mx-auto">
          {view === 'main' && (
            <>
              <button onClick={handleCreateInit} className={s.buttonPrimary}>
                <span>Create Wallet</span>
                <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
              <button onClick={() => setView('import')} className={s.buttonSecondary}>
                <span>Import Private Key</span>
                <KeyRound className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </>
          )}

          {view === 'import' && (
            <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex bg-[#0a0a0a] rounded-none p-1 text-[11px] font-bold text-neutral-500 border border-neutral-800">
                <button
                  onClick={() => setImportMode('mnemonic')}
                  className={`flex-1 py-3 transition-colors ${importMode === 'mnemonic' ? 'bg-neutral-200 text-neutral-900' : 'hover:text-white'}`}
                >
                  BIP-39
                </button>
                <button
                  onClick={() => setImportMode('evm')}
                  className={`flex-1 py-3 transition-colors ${importMode === 'evm' ? 'bg-neutral-200 text-neutral-900' : 'hover:text-white'}`}
                >
                  EVM
                </button>
                <button
                  onClick={() => setImportMode('solana')}
                  className={`flex-1 py-3 transition-colors ${importMode === 'solana' ? 'bg-neutral-200 text-neutral-900' : 'hover:text-white'}`}
                >
                  Solana
                </button>
              </div>
              <textarea
                placeholder={importMode === 'mnemonic' ? "Enter 12-word recovery phrase..." : importMode === 'solana' ? "Enter base58 Solana Private Key..." : "Enter 0x... EVM Private Key"}
                value={mnemonicInput}
                onChange={(e) => setMnemonicInput(e.target.value)}
                className="w-full p-5 bg-[#0a0a0a] border border-neutral-800 text-sm text-neutral-200 outline-none focus:border-neutral-500 transition-colors h-32 resize-none font-mono rounded-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={() => setView('main')} className="w-1/3 px-4 py-4 bg-transparent border border-neutral-800 hover:bg-neutral-700 text-sm font-bold text-neutral-300 transition-all">
                  Cancel
                </button>
                <button onClick={handleImportSubmit} className="flex-1 px-4 py-4 bg-neutral-200 hover:bg-neutral-300 text-sm font-bold text-neutral-900 transition-all flex items-center justify-center gap-2">
                  Launch <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {view === 'create' && (
            <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-6 bg-[#0a0a0a] border border-neutral-800 flex flex-col gap-3">
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold flex items-center gap-2">
                  <KeyRound className="w-3 h-3" /> Ephemeral Root Seed
                </p>
                <p className="text-sm font-mono text-neutral-300 select-all leading-loose">{generatedMnemonic}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setView('main')} className="w-1/3 px-4 py-4 bg-transparent border border-neutral-800 hover:bg-neutral-700 text-sm font-bold text-neutral-300 transition-all">
                  Cancel
                </button>
                <button onClick={handleCreateConfirm} className="flex-1 px-4 py-4 bg-neutral-200 hover:bg-neutral-300 text-sm font-bold text-neutral-900 transition-all flex items-center justify-center gap-2">
                  Launch Workspace <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {view === 'main' && (
            <div className={s.featureGrid}>
              {FEATURES.map((f) => (
                <div key={f.title} className={s.featureCard}>
                  <div className={s.featureTitle}>
                    {f.icon} {f.title}
                  </div>
                  <span className={s.featureDesc}>{f.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
