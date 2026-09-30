'use client';

import React from 'react';
import { EvmPanelViewProps } from './types';
import { evmStyles as s } from './styles';
import { ContractDeployer } from './contract-deployer';

import { Info } from 'lucide-react';

const Tooltip = ({ title, content }: { title: string, content: string }) => (
  <div className="group relative flex items-center gap-2 cursor-help">
    <span>{title}</span>
    <Info className="w-3.5 h-3.5 text-neutral-500" />
    <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 p-3 bg-[#0a0a0a] border border-neutral-800 text-[11px] font-normal text-neutral-300 normal-case tracking-normal z-50 shadow-xl leading-relaxed pointer-events-none">
      {content}
    </div>
  </div>
);

export function EvmPanelView(props: EvmPanelViewProps) {
  const shortAddr = (addr?: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div className={s.titleRow}>
          <div className="h-3 w-3 rounded-full bg-neutral-300 animate-pulse" />
          <h2 className="text-lg font-semibold text-white tracking-wide">Ethereum Sepolia</h2>
        </div>
        <span className={`${s.badge} ${props.isConnected ? s.badgeConnected : s.badgeDisconnected}`}>
          {props.isConnected ? 'In-App Active' : 'Initializing'}
        </span>
      </div>

      <div className={s.balanceCard}>
        <div className={s.statLabel}>{props.symbol} Balance</div>
        <div className={s.statValue}>{props.balance} <span className="text-sm font-normal text-neutral-400">{props.symbol}</span></div>
        <div className={s.statSub}>Contract: {shortAddr(props.contractAddress)}</div>
      </div>

      <div className="flex flex-col gap-4">
        <ContractDeployer onDeployed={props.onContractAddressChange} />

        <div className={s.formSection}>
          <div className={s.sectionTitle}>
            <Tooltip 
              title="Mint Tokens" 
              content="Generates new ERC-20 tokens from your active Smart Contract and deposits them into the specified wallet address. If left blank, it defaults to your own wallet."
            />
          </div>
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
          <div className={s.sectionTitle}>
            <Tooltip 
              title="Send Tokens" 
              content="Transfers ERC-20 tokens from your wallet to another Ethereum wallet address."
            />
          </div>
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
            <a href={`https://sepolia.etherscan.io/tx/${props.txHash}`} target="_blank" rel="noreferrer" className="text-neutral-300 hover:text-white hover:underline transition-colors">
              View on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
