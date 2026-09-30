'use client';

import React, { useState } from 'react';
import { useWalletMode } from '@/app/_context/WalletModeContext';
import { inAppDeployErc20 } from '@/services/inAppEvmDeploy';
import { ContractDeployerView } from './view';

interface ContractDeployerProps {
  onDeployed: (address: string) => void;
}

export function ContractDeployer({ onDeployed }: ContractDeployerProps) {
  const { wallet } = useWalletMode();
  const [isOpen, setIsOpen] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('1000');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string>();
  const [error, setError] = useState<string>();

  const handleDeploy = async () => {
    if (!wallet?.evm.account || !tokenName || !tokenSymbol) return;
    setIsDeploying(true);
    setError(undefined);
    try {
      const res = await inAppDeployErc20(
        wallet.evm.account,
        tokenName.trim(),
        tokenSymbol.trim().toUpperCase(),
        initialSupply || '0'
      );
      setDeployedAddress(res.contractAddress);
      onDeployed(res.contractAddress);
      setIsOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('insufficient funds') || msg.includes('exceeds the balance')) {
        setError('Insufficient SepoliaETH. Your in-app wallet needs gas to deploy.');
      } else {
        setError('Deployment failed. Verify network connectivity.');
      }
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <ContractDeployerView
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      tokenName={tokenName}
      setTokenName={setTokenName}
      tokenSymbol={tokenSymbol}
      setTokenSymbol={setTokenSymbol}
      initialSupply={initialSupply}
      setInitialSupply={setInitialSupply}
      isDeploying={isDeploying}
      onDeploy={handleDeploy}
      deployedAddress={deployedAddress}
      error={error}
    />
  );
}
