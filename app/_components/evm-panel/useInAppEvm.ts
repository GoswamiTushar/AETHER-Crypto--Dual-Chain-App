import { useState, useEffect, useCallback } from 'react';
import { Account } from 'viem';
import { SEPOLIA_CONTRACT_ADDRESS } from '@/config/contracts';
import { fetchInAppEvmInfo, inAppEvmMint, inAppEvmSend } from '@/services/inAppEvmActions';

export function useInAppEvm(account?: Account, contractAddress: string = SEPOLIA_CONTRACT_ADDRESS) {
  const [balance, setBalance] = useState('0');
  const [symbol, setSymbol] = useState('ATK');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}`>();

  const target = (contractAddress || SEPOLIA_CONTRACT_ADDRESS) as `0x${string}`;

  const refresh = useCallback(async () => {
    await Promise.resolve(); // Yield to avoid synchronous setState warnings
    if (!account) return;
    try {
      const info = await fetchInAppEvmInfo(account.address, target);
      setBalance(info.balance);
      setSymbol(info.symbol);
    } catch {
      setBalance('0');
    }
  }, [account, target]);

  useEffect(() => { refresh(); }, [refresh]);

  const mint = async (to: `0x${string}`, amount: string, onDone: () => void) => {
    if (!account) return;
    setIsProcessing(true);
    try {
      const hash = await inAppEvmMint(account, to, amount, target);
      setTxHash(hash);
      onDone();
      await refresh();
    } catch (err: unknown) {
      console.log('In-app EVM mint error (e.g. gas needed):', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const transfer = async (to: `0x${string}`, amount: string, onDone: () => void) => {
    if (!account) return;
    setIsProcessing(true);
    try {
      const hash = await inAppEvmSend(account, to, amount, target);
      setTxHash(hash);
      onDone();
      await refresh();
    } catch (err: unknown) {
      console.log('In-app EVM transfer error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return { balance, symbol, isProcessing, txHash, mint, transfer };
}
