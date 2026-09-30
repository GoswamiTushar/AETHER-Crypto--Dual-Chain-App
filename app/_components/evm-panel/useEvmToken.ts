'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { SEPOLIA_CONTRACT_ADDRESS, ERC20_ABI } from '@/config/contracts';

export function useEvmToken(address?: `0x${string}`) {
  const { data: symbol = 'TOKEN' } = useReadContract({
    address: SEPOLIA_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: decimals = 18 } = useReadContract({
    address: SEPOLIA_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const { data: rawBalance, refetch: refetchBalance } = useReadContract({
    address: SEPOLIA_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: txHash, writeContract, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  const balanceFormatted = rawBalance !== undefined
    ? Number(formatUnits(rawBalance, decimals)).toLocaleString(undefined, { maximumFractionDigits: 4 })
    : '0';

  const mint = (target: `0x${string}`, amount: string, onDone: () => void) => {
    writeContract(
      {
        address: SEPOLIA_CONTRACT_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'mint',
        args: [target, parseUnits(amount, decimals)],
      },
      {
        onSuccess: () => { onDone(); refetchBalance(); },
        onError: (err) => console.log('Mint cancelled:', err.message),
      }
    );
  };

  const transfer = (to: `0x${string}`, amount: string, onDone: () => void) => {
    writeContract(
      {
        address: SEPOLIA_CONTRACT_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [to, parseUnits(amount, decimals)],
      },
      {
        onSuccess: () => { onDone(); refetchBalance(); },
        onError: (err) => console.log('Transfer cancelled:', err.message),
      }
    );
  };

  return { symbol, balance: balanceFormatted, isProcessing: isWriting || isConfirming, txHash, mint, transfer };
}
