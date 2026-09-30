'use client';

import React from 'react';
import { SolanaPanelViewProps } from './types';
import { solanaStyles as s } from './styles';

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

export function SolanaPanelView(props: SolanaPanelViewProps) {
  const shortAddr = (addr?: string) => addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : '';

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div className={s.titleRow}>
          <div className="h-3 w-3 rounded-full bg-neutral-300 animate-pulse" />
          <h2 className="text-lg font-bold text-white tracking-wide">Solana Devnet</h2>
        </div>
        <span className={`${s.badge} ${props.connected ? s.badgeConnected : s.badgeDisconnected}`}>
          {props.connected ? 'In-App Active' : 'Initializing'}
        </span>
      </div>

      <div className={s.balanceCard}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className={s.statLabel}>Token Mint Balance</div>
            <div className={s.statValue}>{props.balance} <span className="text-sm font-normal text-neutral-400">SPL</span></div>
            <div className={s.statSub}>Mint: {props.mintAddress ? shortAddr(props.mintAddress) : 'No Mint Initialized'}</div>
          </div>
          <div className="sm:text-right">
            <div className={s.statLabel}>Wallet Gas Balance</div>
            <div className={s.statValue}>{props.nativeBalance} <span className="text-sm font-normal text-neutral-400">SOL</span></div>
            <div className={s.statSub}>Devnet Network</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className={s.formSection}>
          <div className={s.sectionTitle}>
            <Tooltip 
              title="Create Token Mint Contract" 
              content="Deploys a new SPL Token Mint to the Solana blockchain. Your active wallet will be set as the Mint Authority, allowing you to create new tokens."
            />
          </div>
          
          <div className="flex gap-2 mb-2">
            <input
              placeholder="Token Name (e.g. Aetherius)"
              value={props.tokenName}
              onChange={(e) => props.setTokenName(e.target.value)}
              className={s.input}
            />
            <input
              placeholder="Symbol (ATH)"
              value={props.tokenSymbol}
              onChange={(e) => props.setTokenSymbol(e.target.value)}
              className={`${s.input} max-w-[120px]`}
            />
          </div>

          <button disabled={props.loading} onClick={props.onCreateMintAndAta} className={s.btnOutline}>
            {props.loading ? 'Creating...' : '+ Create New Mint & Associated Token Account'}
          </button>
        </div>

        <div className={s.formSection}>
          <div className={s.sectionTitle}>
            <Tooltip 
              title="Mint Tokens into Associated Token Account" 
              content="Generates new tokens from your Mint Contract and deposits them into your wallet's Associated Token Account (ATA)."
            />
          </div>
          
          <select 
            value={props.mintAddress} 
            onChange={(e) => props.setMintAddress(e.target.value)}
            className={`${s.input} mb-2 appearance-none`}
          >
            <option value="">-- Select Active Mint Address --</option>
            {props.availableMints.map(mint => (
              <option key={mint} value={mint}>{mint}</option>
            ))}
          </select>

          <input
            placeholder="Amount to mint"
            type="number"
            value={props.mintAmount}
            onChange={(e) => props.setMintAmount(e.target.value)}
            className={s.input}
          />
          <button disabled={props.loading || !props.mintAddress || !props.mintAmount} onClick={props.onMintToAta} className={s.btnPrimary}>
            {props.loading ? 'Minting...' : 'Mint to My Associated Token Account'}
          </button>
        </div>

        <div className={s.formSection}>
          <div className={s.sectionTitle}>
            <Tooltip 
              title="Send SPL Tokens" 
              content="Transfers SPL tokens from your Associated Token Account to another Solana wallet address."
            />
          </div>
          <input
            placeholder="Recipient Solana Address"
            value={props.sendTo}
            onChange={(e) => props.setSendTo(e.target.value.trim())}
            className={s.input}
          />
          <input
            placeholder="Amount to send"
            type="number"
            value={props.sendAmount}
            onChange={(e) => props.setSendAmount(e.target.value)}
            className={s.input}
          />
          <button 
            disabled={props.loading || !props.mintAddress || !props.sendTo || !props.sendAmount || Number(props.sendAmount) > Number(props.balance)} 
            onClick={props.onTransfer} 
            className={s.btnSecondary}
          >
            {props.loading ? 'Transferring...' : Number(props.sendAmount) > Number(props.balance) ? 'Insufficient Funds' : 'Send SPL Tokens'}
          </button>
        </div>

        {props.txSig && (
          <div className={s.txNotice}>
            <span className="font-semibold text-neutral-300">Transaction Confirmed:</span>
            <a href={`https://explorer.solana.com/tx/${props.txSig}?cluster=devnet`} target="_blank" rel="noreferrer" className="text-neutral-300 hover:text-white transition-colors hover:underline">
              View on Solana Explorer
            </a>
          </div>
        )}

        {props.error && (
          <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <span className="font-bold mr-1">Error:</span> {props.error}
            {props.error.includes('429') && (
              <p className="mt-1 text-[10px] text-red-300">
                (Public RPC Rate Limit Hit. Please wait 10-20 seconds before trying again.)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
