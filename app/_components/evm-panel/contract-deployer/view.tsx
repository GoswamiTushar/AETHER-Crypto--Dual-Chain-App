'use client';

import React from 'react';
import { ContractDeployerViewProps } from './types';
import { deployerStyles as s } from './styles';

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

export function ContractDeployerView(props: ContractDeployerViewProps) {
  return (
    <div className={s.container}>
      <div className={s.headerRow}>
        <span className={s.title}>
          <Tooltip 
            title="Deploy ERC-20 Contract" 
            content="Deploys a custom ERC-20 Smart Contract directly from your wallet to the Ethereum Sepolia network. Requires a small amount of SepoliaETH for gas."
          />
        </span>
        <button
          onClick={() => props.setIsOpen(!props.isOpen)}
          className={s.toggleBtn}
        >
          {props.isOpen ? 'Cancel' : '+ Deploy Custom Token'}
        </button>
      </div>

      {props.isOpen && (
        <div className="flex flex-col gap-2.5 pt-1">

          <div className={s.formGrid}>
            <input
              placeholder="Name (e.g. MyToken)"
              value={props.tokenName}
              onChange={(e) => props.setTokenName(e.target.value)}
              className={s.input}
            />
            <input
              placeholder="Symbol (e.g. MTK)"
              value={props.tokenSymbol}
              onChange={(e) => props.setTokenSymbol(e.target.value)}
              className={s.input}
            />
          </div>

          <input
            placeholder="Initial Supply (e.g. 1000)"
            type="number"
            value={props.initialSupply}
            onChange={(e) => props.setInitialSupply(e.target.value)}
            className={s.input}
          />

          <button
            disabled={props.isDeploying || !props.tokenName || !props.tokenSymbol}
            onClick={props.onDeploy}
            className={s.deployBtn}
          >
            {props.isDeploying ? 'Deploying to Sepolia...' : 'Deploy Contract'}
          </button>

          {props.error && (
            <div className={s.notice}>
              {props.error}
            </div>
          )}

          {props.deployedAddress && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-none p-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span>✅ Contract Deployed Successfully!</span>
                  <a
                    href={`https://sepolia.etherscan.io/address/${props.deployedAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-normal underline hover:text-emerald-300"
                  >
                    View on Etherscan
                  </a>
                </div>
                <div className="text-neutral-300">
                  <span className="text-emerald-500/80 font-bold uppercase tracking-wide">Important:</span> Please copy and save this address somewhere safe. If you switch computers, you will need this to interact with your token.
                </div>
                <div className="bg-[#050810] border border-emerald-500/20 p-2 font-mono text-emerald-200 break-all select-all mt-1">
                  {props.deployedAddress}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
