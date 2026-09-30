'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModeProvider } from './_context/WalletModeContext';

const solanaRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

export default function Providers({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(
    () => solanaRpc || clusterApiUrl('devnet'),
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletModeProvider>
        {children}
      </WalletModeProvider>
    </ConnectionProvider>
  );
}
