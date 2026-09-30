'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useWalletMode } from '@/app/_context/WalletModeContext';
import { useInAppSolana } from './useInAppSolana';
import { SolanaPanelView } from './view';

export function SolanaPanel() {
  const { wallet } = useWalletMode();
  const { connection } = useConnection();

  const [availableMints, setAvailableMints] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aetherius_solana_mints');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch { }
      }
    }
    return [];
  });

  const [mintAddress, setMintAddress] = useState<string>(() => {
    const initialMint = process.env.NEXT_PUBLIC_SOLANA_MINT_ADDRESS || '';
    if (initialMint) return initialMint;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aetherius_solana_mints');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) return parsed[0];
        } catch { }
      }
    }
    return '';
  });

  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');

  const [mintAmount, setMintAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [nativeBalance, setNativeBalance] = useState('0');

  const activePubkeyStr = wallet?.solana?.keypair.publicKey.toBase58();
  const inApp = useInAppSolana(connection, wallet?.solana?.keypair);
  useEffect(() => {
    if (!activePubkeyStr) return;

    // Find all token accounts owned by this wallet
    connection.getParsedTokenAccountsByOwner(new PublicKey(activePubkeyStr), {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    }).then(res => {
      const mintsFromChain = res.value.map(v => v.account.data.parsed.info.mint as string);
      setAvailableMints(prev => {
        const combined = Array.from(new Set([...prev, ...mintsFromChain]));
        localStorage.setItem('aetherius_solana_mints', JSON.stringify(combined));
        return combined;
      });
    }).catch(console.error);
  }, [activePubkeyStr, connection]);

  const fetchBalance = useCallback(async () => {
    await Promise.resolve(); // Yield to event loop to avoid synchronous setState warnings
    if (!activePubkeyStr) return;

    // Fetch Native SOL Balance
    try {
      const lamports = await connection.getBalance(new PublicKey(activePubkeyStr));
      setNativeBalance((lamports / 1e9).toFixed(4));
    } catch {
      setNativeBalance('0');
    }

    // Fetch SPL Token Balance
    if (!mintAddress) {
      setBalance('0');
      return;
    }
    try {
      const ata = await getAssociatedTokenAddress(new PublicKey(mintAddress), new PublicKey(activePubkeyStr));
      const res = await connection.getTokenAccountBalance(ata);
      setBalance(res.value.uiAmountString || '0');
    } catch {
      setBalance('0');
    }
  }, [activePubkeyStr, mintAddress, connection]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleCreateMintAndAta = async () => {
    if (!tokenName || !tokenSymbol) {
      alert("Please enter a Token Name and Symbol first.");
      return;
    }
    const res = await inApp.createMint(tokenName, tokenSymbol);
    if (res) {
      setMintAddress(res);
      setAvailableMints(prev => {
        const combined = Array.from(new Set([...prev, res]));
        localStorage.setItem('aetherius_solana_mints', JSON.stringify(combined));
        return combined;
      });
      setTokenName('');
      setTokenSymbol('');
    }
  };

  const handleMintToAta = async () => {
    if (!mintAddress || !mintAmount) return;
    await inApp.mintTo(mintAddress, Number(mintAmount));
    setMintAmount('');
    fetchBalance();
  };

  const handleTransfer = async () => {
    if (!mintAddress || !sendTo || !sendAmount) return;

    if (Number(sendAmount) > Number(balance)) {
      alert(`Insufficient funds. You only have ${balance} tokens. Please mint more first.`);
      return;
    }

    await inApp.transfer(mintAddress, sendTo, Number(sendAmount));
    setSendAmount(''); setSendTo('');
    fetchBalance();
  };

  return (
    <SolanaPanelView
      connected={!!wallet}
      publicKeyStr={activePubkeyStr}
      mintAddress={mintAddress}
      setMintAddress={setMintAddress}
      availableMints={availableMints}
      tokenName={tokenName}
      setTokenName={setTokenName}
      tokenSymbol={tokenSymbol}
      setTokenSymbol={setTokenSymbol}
      balance={balance}
      nativeBalance={nativeBalance}
      loading={inApp.loading}
      txSig={inApp.txSig}
      error={inApp.error}
      onCreateMintAndAta={handleCreateMintAndAta}
      mintAmount={mintAmount}
      setMintAmount={setMintAmount}
      onMintToAta={handleMintToAta}
      sendTo={sendTo}
      setSendTo={setSendTo}
      sendAmount={sendAmount}
      setSendAmount={setSendAmount}
      onTransfer={handleTransfer}
    />
  );
}
