'use client';

import { useState } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { buildCreateMintAndAtaTx, buildMintToTx, buildTransferTx } from './transactions';

export function useExtSolana(
  connection: Connection,
  pubkey: PublicKey | null,
  sendTx: (tx: Transaction, conn: Connection, opts?: { signers?: unknown[] }) => Promise<string>
) {
  const [loading, setLoading] = useState(false);
  const [txSig, setTxSig] = useState<string>();

  const run = async (action: () => Promise<{ sig: string; mint?: string }>) => {
    if (!pubkey) return;
    setLoading(true);
    try {
      const res = await action();
      await connection.confirmTransaction(res.sig, 'confirmed');
      setTxSig(res.sig);
      return res;
    } catch (e) {
      console.log('Solana ext error:', e);
    } finally {
      setLoading(false);
    }
  };

  const createMint = () => run(async () => {
    const { tx, mintKeypair } = await buildCreateMintAndAtaTx(connection, pubkey!);
    const sig = await sendTx(tx, connection, { signers: [mintKeypair] });
    return { sig, mint: mintKeypair.publicKey.toBase58() };
  });

  const mintTo = (mint: string, amount: number) => run(async () => {
    const tx = await buildMintToTx(new PublicKey(mint), pubkey!, pubkey!, amount);
    const sig = await sendTx(tx, connection);
    return { sig };
  });

  const transfer = (mint: string, to: string, amount: number) => run(async () => {
    const tx = await buildTransferTx(new PublicKey(mint), pubkey!, new PublicKey(to), amount);
    const sig = await sendTx(tx, connection);
    return { sig };
  });

  return { loading, txSig, createMint, mintTo, transfer };
}
