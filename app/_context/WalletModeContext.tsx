'use client';

import React, { createContext, useContext, useState } from 'react';
import { 
  DualChainWallet, 
  generateDualChainWallet, 
  importEvmPrivateKey, 
  importSolanaPrivateKey 
} from '@/services/inAppWallet';

interface WalletModeContextType {
  wallet: DualChainWallet | null;
  preferredChain: 'evm' | 'solana' | null;
  createWallet: () => void;
  importWallet: (mnemonic: string) => void;
  importEvmWallet: (privateKey: string) => void;
  importSolanaWallet: (privateKey: string) => void;
  logout: () => void;
}

const WalletModeContext = createContext<WalletModeContextType>({} as WalletModeContextType);

export function WalletModeProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<DualChainWallet | null>(null);
  const [preferredChain, setPreferredChain] = useState<'evm' | 'solana' | null>(null);

  const createWallet = () => {
    setWallet(generateDualChainWallet());
    setPreferredChain(null); // Defaults to whatever dashboard wants
  };

  const importWallet = (mnemonic: string) => {
    setWallet(generateDualChainWallet(mnemonic));
    setPreferredChain(null);
  };

  const importEvmWallet = (privateKey: string) => {
    setWallet(importEvmPrivateKey(privateKey));
    setPreferredChain('evm');
  };

  const importSolanaWallet = (privateKey: string) => {
    setWallet(importSolanaPrivateKey(privateKey));
    setPreferredChain('solana');
  };

  const logout = () => {
    setWallet(null);
    setPreferredChain(null);
  };

  return (
    <WalletModeContext.Provider value={{ 
      wallet, preferredChain, createWallet, importWallet, 
      importEvmWallet, importSolanaWallet, logout 
    }}>
      {children}
    </WalletModeContext.Provider>
  );
}

export const useWalletMode = () => useContext(WalletModeContext);
