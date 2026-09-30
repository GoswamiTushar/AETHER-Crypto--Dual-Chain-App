'use client';

import React from 'react';
import { EvmPanelViewProps } from './types';
import { evmStyles as s } from './styles';
import { ContractDeployer } from './contract-deployer';

export function EvmPanelView(props: EvmPanelViewProps) {
  const shortAddr = (addr?: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div className={s.titleRow}>
          <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
          <h2 className="text-lg font-bold text-white tracking-wide">Ethereum Sepolia</h2>
        </div>
        <span className={`${s.badge} ${props.isConnected ? s.badgeConnected : s.badgeDisconnected}`}>
          {props.isConnected ? 'In-App Active' : 'Initializing'}
        </span>
      </div>

      <div className={s.balanceCard}>
        <div className={s.statLabel}>{props.symbol} Balance</div>
        <div className={s.statValue}>{props.balance} <span className="text-sm font-normal text-indigo-400">{props.symbol}</span></div>
        <div className={s.statSub}>Contract: {shortAddr(props.contractAddress)}</div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>In-App Signer: {shortAddr(props.address)}</span>
          <span className="text-[11px] text-emerald-400 font-medium">BIP-44 Key Loaded</span>
        </div>

        <ContractDeployer onDeployed={props.onContractAddressChange} />

        <div className={s.formSection}>
          <div className={s.sectionTitle}><span>Mint Tokens</span></div>
          <input
            placeholder="Recipient (default: self)"
            value={props.mintTo}
            onChange={(e) => props.setMintTo(e.target.value)}
            className={s.input}
          />
          <input
            placeholder="Amount to mint"
            type="number"
            value={props.mintAmount}
            onChange={(e) => props.setMintAmount(e.target.value)}
            className={s.input}
          />
          <button disabled={props.isProcessing || !props.mintAmount} onClick={props.onMint} className={s.btnPrimary}>
            {props.isProcessing ? 'Confirming...' : 'Mint Tokens'}
          </button>
        </div>

        <div className={s.formSection}>
          <div className={s.sectionTitle}><span>Send Tokens</span></div>
          <input
            placeholder="Recipient 0x... address"
            value={props.sendTo}
            onChange={(e) => props.setSendTo(e.target.value)}
            className={s.input}
          />
          <input
            placeholder="Amount to send"
            type="number"
            value={props.sendAmount}
            onChange={(e) => props.setSendAmount(e.target.value)}
            className={s.input}
          />
          <button disabled={props.isProcessing || !props.sendTo || !props.sendAmount} onClick={props.onSend} className={s.btnSecondary}>
            {props.isProcessing ? 'Transferring...' : 'Send Tokens'}
          </button>
        </div>

        {props.txHash && (
          <div className={s.txNotice}>
            <span className="font-semibold text-neutral-300">Transaction Confirmed:</span>
            <a href={`https://sepolia.etherscan.io/tx/${props.txHash}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
              View on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
