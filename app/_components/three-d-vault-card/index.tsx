'use client';

import React, { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { requestDevnetAirdrop } from '@/services/inAppSolanaActions';
import { ThreeDVaultCardProps } from './types';
import { CardView } from './view';

export function ThreeDVaultCard(props: ThreeDVaultCardProps) {
  const { connection } = useConnection();
  const [isCopied, setIsCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [airdropping, setAirdropping] = useState(false);
  const [airdropSuccess, setAirdropSuccess] = useState(false);
  const [airdropError, setAirdropError] = useState<string>();

  const activeAddress =
    props.selectedChain === 'evm'
      ? props.wallet?.evm?.address || ''
      : props.wallet?.solana?.address || '';

  const handleCopy = () => {
    if (!activeAddress) return;
    navigator.clipboard.writeText(activeAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAirdrop = async () => {
    if (!props.wallet || !props.wallet.solana) return;
    setAirdropping(true);
    setAirdropSuccess(false);
    setAirdropError(undefined);
    try {
      await requestDevnetAirdrop(connection, props.wallet.solana.keypair.publicKey);
      setAirdropSuccess(true);
      setTimeout(() => setAirdropSuccess(false), 4000);
    } catch (e: any) {
      console.log('Airdrop failed or rate limited:', e);
      setAirdropError(e?.message || 'Rate limit hit. Try again later.');
    } finally {
      setAirdropping(false);
    }
  };

  return (
    <CardView
      wallet={props.wallet}
      selectedChain={props.selectedChain}
      activeAddress={activeAddress}
      isCopied={isCopied}
      onCopy={handleCopy}
      airdropping={airdropping}
      airdropSuccess={airdropSuccess}
      airdropError={airdropError}
      onAirdrop={handleAirdrop}
      revealed={revealed}
      onToggleReveal={() => setRevealed(!revealed)}
    />
  );
}
