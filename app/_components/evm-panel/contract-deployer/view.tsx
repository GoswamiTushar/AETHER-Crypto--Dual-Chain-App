'use client';

import React from 'react';
import { ContractDeployerViewProps } from './types';
import { deployerStyles as s } from './styles';

export function ContractDeployerView(props: ContractDeployerViewProps) {
  return (
    <div className={s.container}>
      <div className={s.headerRow}>
        <span className={s.title}>In-App ERC-20 Deployer</span>
        <button
          onClick={() => props.setIsOpen(!props.isOpen)}
          className={s.toggleBtn}
        >
          {props.isOpen ? 'Cancel' : '+ Deploy Custom Token'}
        </button>
      </div>

      {props.isOpen && (
        <div className="flex flex-col gap-2.5 pt-1">
          <p className="text-[11px] text-neutral-400">
            Deploys a custom ERC-20 contract directly from your in-app wallet to Sepolia. Requires a small amount of SepoliaETH for gas.
          </p>

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
            <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 flex items-center justify-between">
              <span>Deployed: {props.deployedAddress.slice(0, 6)}...{props.deployedAddress.slice(-4)}</span>
              <a
                href={`https://sepolia.etherscan.io/address/${props.deployedAddress}`}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-emerald-300"
              >
                Etherscan
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
