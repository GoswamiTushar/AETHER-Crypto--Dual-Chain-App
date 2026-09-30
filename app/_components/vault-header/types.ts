export interface VaultHeaderProps {
  selectedChain: 'evm' | 'solana';
  onSelectChain: (chain: 'evm' | 'solana') => void;
}
