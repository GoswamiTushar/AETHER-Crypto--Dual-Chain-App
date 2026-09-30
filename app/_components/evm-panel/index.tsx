'use client';

import React, { useState } from 'react';
import { SEPOLIA_CONTRACT_ADDRESS } from '@/config/contracts';
import { useWalletMode } from '@/app/_context/WalletModeContext';
import { useInAppEvm } from './useInAppEvm';
import { EvmPanelView } from './view';

export function EvmPanel() {
  const { wallet } = useWalletMode();
  const [contractAddress, setContractAddress] = useState<string>(SEPOLIA_CONTRACT_ADDRESS);
  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  const token = useInAppEvm(wallet?.evm?.account, contractAddress);

  const handleMint = () => {
    if (!mintAmount || !wallet?.evm) return;
    const target = (mintTo.trim() || wallet.evm.address) as `0x${string}`;
    token.mint(target, mintAmount, () => setMintAmount(''));
  };

  const handleSend = () => {
    if (!sendTo || !sendAmount || !wallet) return;
    token.transfer(sendTo.trim() as `0x${string}`, sendAmount, () => {
      setSendAmount('');
      setSendTo('');
    });
  };

  return (
    <EvmPanelView
      isConnected={!!wallet}
      address={wallet?.evm?.address}
      contractAddress={contractAddress}
      symbol={token.symbol}
      balance={token.balance}
      nativeBalance={token.nativeBalance}
      onContractAddressChange={setContractAddress}
      mintTo={mintTo}
      setMintTo={setMintTo}
      mintAmount={mintAmount}
      setMintAmount={setMintAmount}
      onMint={handleMint}
      sendTo={sendTo}
      setSendTo={setSendTo}
      sendAmount={sendAmount}
      setSendAmount={setSendAmount}
      onSend={handleSend}
      isProcessing={token.isProcessing}
      txHash={token.txHash}
    />
  );
}
