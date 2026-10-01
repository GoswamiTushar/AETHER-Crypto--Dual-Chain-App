'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { ERC20_ABI } from '@/config/contracts';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

export function useEvmToken(contractAddress?: `0x${string}`, userAddress?: `0x${string}`) {
  const { data: symbol = 'TOKEN' } = useReadContract({
    address: contractAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: decimals = 18 } = useReadContract({
    address: contractAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const { data: rawBalance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress && !!contractAddress },
  });

  const { data: txHash, writeContract, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  const balanceFormatted = rawBalance !== undefined
    ? formatTokenAmount(rawBalance, decimals)
    : '0';

  const mint = (target: `0x${string}`, amount: string, onDone: () => void) => {
    if (!contractAddress) return;
    writeContract(
      {
        address: contractAddress,
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
    if (!contractAddress) return;
    writeContract(
      {
        address: contractAddress,
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
