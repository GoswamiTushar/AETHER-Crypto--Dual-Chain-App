'use client';

import { useState } from 'react';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { inAppCreateMintAndAta, inAppMintTo, inAppTransfer } from '@/services/inAppSolanaActions';

export function useInAppSolana(connection: Connection, keypair?: Keypair) {
  const [loading, setLoading] = useState(false);
  const [txSig, setTxSig] = useState<string>();
  const [error, setError] = useState<string>();

  const execute = async (fn: () => Promise<string>) => {
    if (!keypair) return;
    setLoading(true);
    setTxSig(undefined);
    setError(undefined);
    try {
      const sig = await fn();
      setTxSig(sig);
      return sig;
    } catch (err: any) {
      console.error('In-app Solana action failed:', err);
      setError(err?.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createMint = async (name: string, symbol: string) => {
    if (!keypair) return;
    setLoading(true);
    setTxSig(undefined);
    setError(undefined);
    try {
      const res = await inAppCreateMintAndAta(connection, keypair, name, symbol);
      setTxSig(res.sig);
      return res.mintAddress;
    } catch (err: any) {
      console.error('In-app mint creation failed:', err);
      setError(err?.message || 'Failed to create Mint. Devnet RPC might be rate-limiting.');
    } finally {
      setLoading(false);
    }
  };

  const mintTo = (mint: string, amount: number) =>
    execute(async () => {
      let mintPubkey;
      try { mintPubkey = new PublicKey(mint); } catch { throw new Error('Invalid Mint address'); }
      return inAppMintTo(connection, keypair!, mintPubkey, amount);
    });

  const transfer = (mint: string, recipient: string, amount: number) =>
    execute(async () => {
      let mintPubkey, recipientPubkey;
      try {
        mintPubkey = new PublicKey(mint);
        recipientPubkey = new PublicKey(recipient);
      } catch {
        throw new Error('Invalid Solana recipient address');
      }
      return inAppTransfer(connection, keypair!, mintPubkey, recipientPubkey, amount);
    });

  return { loading, txSig, error, createMint, mintTo, transfer, setError };
}
