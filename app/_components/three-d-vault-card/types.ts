import { DualChainWallet } from '@/services/inAppWallet';

export interface ThreeDVaultCardProps {
  wallet: DualChainWallet | null;
  selectedChain: 'evm' | 'solana';
}

export interface CardViewStateProps {
  wallet: DualChainWallet | null;
  selectedChain: 'evm' | 'solana';
  activeAddress: string;
  isCopied: boolean;
  onCopy: () => void;
  airdropping: boolean;
  airdropSuccess: boolean;
  airdropError?: string;
  onAirdrop: () => void;
  revealed: boolean;
  onToggleReveal: () => void;
}
