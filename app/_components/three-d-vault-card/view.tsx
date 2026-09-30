'use client';

import React from 'react';
import { CardViewStateProps } from './types';
import { threeDStyles as s } from './styles';

export function CardView(p: CardViewStateProps) {
  const isEvm = p.selectedChain === 'evm';
  const words = p.wallet?.mnemonic?.split(' ') || [];

  return (
    <div className={s.container}>
      <div
        className={`${s.cardWrap} ${s.cardGradient}`}
      >
        <div className={s.innerCard}>
          <div className={s.shineOverlay} />
          <div className={s.badgeRow}>
            <div className={`${s.networkBadge} ${isEvm ? s.evmBadge : s.solanaBadge}`}>
              <span className="text-base">{isEvm ? '🔷' : '🟣'}</span>
              <span>{isEvm ? 'Ethereum Sepolia Testnet' : 'Solana Devnet'}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
              Active In-App Cryptographic Address
            </span>
            <div className={s.addressBox}>
              <span className={s.addressText}>{p.activeAddress || 'No wallet loaded'}</span>
              <button onClick={p.onCopy} className={s.copyBtn}>
                {p.isCopied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className={s.actionRow}>
            <button onClick={p.onToggleReveal} className={s.chipBtn}>
              {p.revealed ? '🙈 Hide Seed Phrase' : '👁️ Reveal 12-Word Seed'}
            </button>
            {!isEvm && (
              <button disabled={p.airdropping} onClick={p.onAirdrop} className={s.faucetBtn}>
                {p.airdropping ? 'Airdropping...' : p.airdropSuccess ? '✓ 1 SOL Received' : '💧 Request 1 SOL Airdrop'}
              </button>
            )}
          </div>
          {!isEvm && p.airdropError && (
             <div className="mt-2 text-[10px] text-red-400 text-right bg-red-500/10 px-2 py-1 rounded">
               {p.airdropError.includes('429') ? 'Faucet Rate Limited. Try again later.' : p.airdropError}
             </div>
          )}

          {p.revealed && (
            <div className={`${s.phraseCard} flex flex-col gap-4`}>
              {/* Private Key Section */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-red-400 font-bold mb-2">
                  <span>{isEvm ? 'EVM Private Key' : 'Solana Private Key'}</span>
                  <span className="text-red-500/60 font-normal uppercase">Do Not Share</span>
                </div>
                <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/50 text-[10px] font-mono text-red-200 break-all select-all">
                  {isEvm 
                    ? (p.wallet?.evm?.privateKey || 'Please log out and log back in to generate EVM key')
                    : (p.wallet?.solana?.privateKey || (p.wallet?.solana?.keypair ? 'Please log out and log back in to format Solana key' : ''))
                  }
                </div>
              </div>

              {/* Seed Phrase Section */}
              {words.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold mb-2">
                    <span>BIP-39 Secret Recovery Words</span>
                    <span className="text-neutral-500 font-normal">Root Seed Entropy</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {words.map((w, i) => (
                      <div key={i} className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
                        <span className="text-neutral-500 text-[10px] mr-1.5">{i + 1}.</span>{w}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {words.length === 0 && (
                <div className="text-center text-xs text-neutral-500 py-2 border-t border-neutral-800">
                  Seed Phrase not available (Wallet imported via Private Key)
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
